/**
 * All scripts to be run on the client via executeAsyncScript or
 * executeScript should be put here. These scripts are transmitted over
 * the wire using their toString representation, and cannot reference
 * external variables. They can, however use the array passed in to
 * arguments. Instead of params, all functions on clientSideScripts
 * should list the arguments array they expect.
 */
var clientSideScripts = exports;

/**
 * Wait until Angular has finished rendering and has
 * no outstanding $http calls before continuing.
 *
 * Asynchronous.
 * arguments[0] {string} The selector housing an ng-app
 * arguments[1] {function} callback
 */
clientSideScripts.waitForAngular = function() {
  var el = document.querySelector(arguments[0]);
  var callback = arguments[1];
  try {
    angular.element(el).injector().get('$browser').
        notifyWhenNoOutstandingRequests(callback);
  } catch (e) {
    callback(e);
  }
};

/**
 * Find a list of elements in the page by their angular binding.
 *
 * arguments[0] {string} The binding, e.g. {{cat.name}}.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The elements containing the binding.
 */
clientSideScripts.findBindings = function() {
  var binding = arguments[0];
  var using = arguments[1] || document;
  var bindings = using.getElementsByClassName('ng-binding');
  var matches = [];
  for (var i = 0; i < bindings.length; ++i) {
    var dataBinding = angular.element(bindings[i]).data('$binding');
    if(dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[i]);
      }
    }
  }
  return matches; // Return the whole array for webdriver.findElements.
};

/**
 * Find an array of elements matching a row within an ng-repeat.
 * Always returns an array of only one element for plain old ng-repeat.
 * Returns an array of all the elements in one segment for ng-repeat-start.
 *
 * arguments[0] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[1] {number} The row index.
 * arguments[2] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The row of the repeater, or an array of elements
 *     in the first row in the case of ng-repeat-start.
 */
 clientSideScripts.findRepeaterRows = function() {
  var repeater = arguments[0];
  var index = arguments[1];
  var using = arguments[2] || document;

  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  var rows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        rows.push(repeatElems[i]);
      }
    }
  }
  // multiRows is an array of arrays, where each inner array contains
  // one row of elements.
  var multiRows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 ||
            elem.nodeValue.indexOf(repeater) == -1) {
          if (elem.nodeType == 1) {
            row.push(elem);
          }
          elem = elem.nextSibling;
        }
        multiRows.push(row);
      }
    }
  }
  return [rows[index]].concat(multiRows[index]);
 };

 /**
 * Find all rows of an ng-repeat.
 *
 * arguments[0] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} All rows of the repeater.
 */
 clientSideScripts.findAllRepeaterRows = function() {
  var repeater = arguments[0];
  var using = arguments[1] || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        rows.push(repeatElems[i]);
      }
    }
  }
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 ||
            elem.nodeValue.indexOf(repeater) == -1) {
          rows.push(elem);
          elem = elem.nextSibling;
        }
      }
    }
  }
  return rows;
 };

/**
 * Find an element within an ng-repeat by its row and column.
 *
 * arguments[0] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[1] {number} The row index.
 * arguments[2] {string} The column binding, e.g. '{{cat.name}}'.
 * arguments[3] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The element in an array.
 */
clientSideScripts.findRepeaterElement = function() {
  var matches = [];
  var repeater = arguments[0];
  var index = arguments[1];
  var binding = arguments[2];
  var using = arguments[3] || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        rows.push(repeatElems[i]);
      }
    }
  }
  // multiRows is an array of arrays, where each inner array contains
  // one row of elements.
  var multiRows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 ||
            (elem.nodeValue && elem.nodeValue.indexOf(repeater) == -1)) {
          if (elem.nodeType == 1) {
            row.push(elem);
          }
          elem = elem.nextSibling;
        }
        multiRows.push(row);
      }
    }
  }
  var row = rows[index];
  var multiRow = multiRows[index];
  var bindings = [];
  if (row) {
    if (row.className.indexOf('ng-binding') != -1) {
      bindings.push(row);
    }
    var childBindings = row.getElementsByClassName('ng-binding');
    for (var i = 0; i < childBindings.length; ++i) {
      bindings.push(childBindings[i]);
    }
  }
  if (multiRow) {
    for (var i = 0; i < multiRow.length; ++i) {
      rowElem = multiRow[i];
      if (rowElem.className.indexOf('ng-binding') != -1) {
        bindings.push(rowElem);
      }
      var childBindings = rowElem.getElementsByClassName('ng-binding');
      for (var j = 0; j < childBindings.length; ++j) {
        bindings.push(childBindings[j]);
      }
    }
  }
  for (var i = 0; i < bindings.length; ++i) {
    var dataBinding = angular.element(bindings[i]).data('$binding');
    if(dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[i]);
      }
    }
  }
  return matches;
};

/**
 * Find the elements in a column of an ng-repeat.
 *
 * arguments[0] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[1] {string} The column binding, e.g. '{{cat.name}}'.
 * arguments[2] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The elements in the column.
 */
clientSideScripts.findRepeaterColumn = function() {
  var matches = [];
  var repeater = arguments[0];
  var binding = arguments[1];
  var using = arguments[2] || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        rows.push(repeatElems[i]);
      }
    }
  }
  // multiRows is an array of arrays, where each inner array contains
  // one row of elements.
  var multiRows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 ||
            (elem.nodeValue && elem.nodeValue.indexOf(repeater) == -1)) {
          if (elem.nodeType == 1) {
            row.push(elem);
          }
          elem = elem.nextSibling;
        }
        multiRows.push(row);
      }
    }
  }
  var bindings = [];
  for (var i = 0; i < rows.length; ++i) {
    if (rows[i].className.indexOf('ng-binding') != -1) {
      bindings.push(rows[i]);
    }
    var childBindings = rows[i].getElementsByClassName('ng-binding');
    for (var k = 0; k < childBindings.length; ++k) {
      bindings.push(childBindings[k]);
    }
  }
  for (var i = 0; i < multiRows.length; ++i) {
    for (var j = 0; j < multiRows[i].length; ++j) {
      var elem = multiRows[i][j];
      if (elem.className.indexOf('ng-binding') != -1) {
        bindings.push(elem);
      }
      var childBindings = elem.getElementsByClassName('ng-binding');
      for (var k = 0; k < childBindings.length; ++k) {
        bindings.push(childBindings[k]);
      }
    }
  }
  for (var j = 0; j < bindings.length; ++j) {
    var dataBinding = angular.element(bindings[j]).data('$binding');
    if (dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[j]);
      }
    }
  }
  return matches;
};

/**
 * Find an input elements by model name.
 * DEPRECATED - use findByModel
 *
 * arguments[0] {string} The model name.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The matching input elements.
 */
clientSideScripts.findInputs = function() {
  var model = arguments[0];
  var using = arguments[1] || document;
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = 'input[' + prefixes[p] + 'model="' + model + '"]';
    var inputs = using.querySelectorAll(selector);
    if (inputs.length) {
      return inputs;
    }
  }
};

/**
 * Find elements by model name.
 *
 * arguments[0] {string} The model name.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The matching elements.
 */
clientSideScripts.findByModel = function() {
  var model = arguments[0];
  var using = arguments[1] || document;
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = '[' + prefixes[p] + 'model="' + model + '"]';
    var elements = using.querySelectorAll(selector);
    if (elements.length) {
      return elements;
    }
  }
};

/**
 * Find buttons by textual content.
 *
 * arguments[0] {string} The exact text to match.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The matching elements.
 */
clientSideScripts.findByButtonText = function() {
  var searchText = arguments[0];
  var using = arguments[1] || document;
  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == "button") {
      elementText = element.innerText || element.textContent;
    } else {
      elementText = element.value;
    }
    if (elementText === searchText) {
      matches.push(element);
    }
  }

  return matches;
};

/**
 * Find buttons by textual content.
 *
 * arguments[0] {string} The exact text to match.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The matching elements.
 */
clientSideScripts.findByPartialButtonText = function() {
  var searchText = arguments[0];
  var using = arguments[1] || document;
  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == "button") {
      elementText = element.innerText || element.textContent;
    } else {
      elementText = element.value;
    }
    if (elementText.indexOf(searchText) > -1) {
      matches.push(element);
    }
  }

  return matches;
};


/**
 * Find multiple select elements by model name.
 *
 * arguments[0] {string} The model name.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The matching select elements.
 */
clientSideScripts.findSelects = function() {
  var model = arguments[0];
  var using = arguments[1] || document;
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = 'select[' + prefixes[p] + 'model="' + model + '"]';
    var inputs = using.querySelectorAll(selector);
    if (inputs.length) {
      return inputs;
    }
  }
};

/**
 * Find selected option elements by model name.
 *
 * arguments[0] {string} The model name.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} The matching select elements.
*/
clientSideScripts.findSelectedOptions = function() {
  var model = arguments[0];
  var using = arguments[1] || document;
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = 'select[' + prefixes[p] + 'model="' + model + '"] option:checked';
    var inputs = using.querySelectorAll(selector);
    if (inputs.length) {
      return inputs;
    }
  }
};

/**
 * Find textarea elements by model name.
 *
 * arguments[0] {String} The model name.
 * arguments[1] {Element} The scope of the search.
 *
 * @return {Array.<Element>} An array of matching textarea elements.
*/
clientSideScripts.findTextareas = function() {
  var model = arguments[0];
  var using = arguments[1] || document;

  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = 'textarea[' + prefixes[p] + 'model="' + model + '"]';
    var textareas = using.querySelectorAll(selector);
    if (textareas.length) {
      return textareas;
    }
  }
};

/**
 * Tests whether the angular global variable is present on a page. Retries
 * in case the page is just loading slowly.
 *
 * Asynchronous.
 * arguments[0] {number} Number of times to retry.
 * arguments[1] {function} callback
 */
clientSideScripts.testForAngular = function() {
  var attempts = arguments[0];
  var asyncCallback = arguments[arguments.length - 1];
  var callback = function(args) {
    setTimeout(function() {
      asyncCallback(args);
    }, 0);
  };
  var check = function(n) {
    try {
      if (window.angular && window.angular.resumeBootstrap) {
        callback([true, null]);
      } else if (n < 1) {
        if (window.angular) {
          callback([false, 'angular never provided resumeBootstrap']);
        } else {
          callback([false, 'retries looking for angular exceeded']);
        }
      } else {
        window.setTimeout(function() {check(n - 1)}, 1000);
      }
    } catch (e) {
      callback([false, e]);
    }
  };
  check(attempts);
};

/**
 * Evalute an Angular expression in the context of a given element.
 *
 * arguments[0] {Element} The element in whose scope to evaluate.
 * arguments[1] {string} The expression to evaluate.
 *
 * @return {?Object} The result of the evaluation.
 */
clientSideScripts.evaluate = function() {
  var element = arguments[0];
  var expression = arguments[1];

  return angular.element(element).scope().$eval(expression);
};

/**
 * Return the current url using $location.absUrl().
 *
 * arguments[0] {string} The selector housing an ng-app
 */
clientSideScripts.getLocationAbsUrl = function() {
  var el = document.querySelector(arguments[0]);
  return angular.element(el).injector().get('$location').absUrl();
};
