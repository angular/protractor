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
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The binding, e.g. {{cat.name}}.
 *
 * @return {Array.<WebElement>} The elements containing the binding.
 */
clientSideScripts.findBindings = function() {
  var using = arguments[0] || document;
  var binding = arguments[1];
  var bindings = using.getElementsByClassName('ng-binding');
  var matches = [];
  for (var i = 0; i < bindings.length; ++i) {
    var elemData  = angular.element(bindings[i]).data();
    if (!elemData || !elemData.$binding) {
      continue;
    }
    var bindingName = elemData.$binding[0].exp || elemData.$binding;
    if (bindingName.indexOf(binding) != -1) {
      matches.push(bindings[i]);
    }
  }
  return matches; // Return the whole array for webdriver.findElements.
};

/**
 * Find an array of elements matching a row within an ng-repeat. Always returns
 * an array of only one element.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[2] {number} The row index.
 *
 * @return {Array.<Element>} An array of a single element, the row of the
 *     repeater.
 */
 clientSideScripts.findRepeaterRows = function() {
  var using = arguments[0] || document;
  var repeater = arguments[1];
  var index = arguments[2];

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
  return [rows[index]];
 };

 /**
 * Find all rows of an ng-repeat.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The text of the repeater, e.g. 'cat in cats'.
 *
 * @return {Array.<Element>} All rows of the repeater.
 */
 clientSideScripts.findAllRepeaterRows = function() {
  var using = arguments[0] || document;
  var repeater = arguments[1];

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
  return rows;
 };

/**
 * Find an element within an ng-repeat by its row and column.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[2] {number} The row index.
 * arguments[3] {string} The column binding, e.g. '{{cat.name}}'.
 *
 * @return {Array.<Element>} The element in an array.
 */
clientSideScripts.findRepeaterElement = function() {
  var matches = [];
  var using = arguments[0] || document;
  var repeater = arguments[1];
  var index = arguments[2];
  var binding = arguments[3];

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
  var row = rows[index];
  var bindings = [];
  if (row.className.indexOf('ng-binding') != -1) {
    bindings.push(row);
  }
  var childBindings = row.getElementsByClassName('ng-binding');
  for (var i = 0; i < childBindings.length; ++i) {
    bindings.push(childBindings[i]);
  }
  for (var i = 0; i < bindings.length; ++i) {
    var elemData  = angular.element(bindings[i]).data();
    if (!elemData || !elemData.$binding) {
      continue;
    }
    var bindingName = elemData.$binding[0].exp || elemData.$binding;
    if (bindingName.indexOf(binding) != -1) {
      matches.push(bindings[i]);
    }
  }
  return matches;
};

/**
 * Find the elements in a column of an ng-repeat.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[2] {string} The column binding, e.g. '{{cat.name}}'.
 *
 * @return {Array.<Element>} The elements in the column.
 */
clientSideScripts.findRepeaterColumn = function() {
  var matches = [];
  var using = arguments[0] || document;
  var repeater = arguments[1];
  var binding = arguments[2];

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
  for (var i = 0; i < rows.length; ++i) {
    var bindings = [];
    if (rows[i].className.indexOf('ng-binding') != -1) {
      bindings.push(rows[i]);
    }
    var childBindings = rows[i].getElementsByClassName('ng-binding');
    for (var k = 0; k < childBindings.length; ++k) {
      bindings.push(childBindings[k]);
    }
    for (var j = 0; j < bindings.length; ++j) {
      var elemData  = angular.element(bindings[j]).data();
      if (!elemData || !elemData.$binding) {
        continue;
      }
      var bindingName = elemData.$binding[0].exp || elemData.$binding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[j]);
      }
    }
  }
  return matches;
};

/**
 * Find an input elements by model name.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The model name.
 *
 * @return {Array.<Element>} The matching input elements.
 */
clientSideScripts.findInputs = function() {
  var using = arguments[0] || document;
  var model = arguments[1];
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
 * Find multiple select elements by model name.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The model name.
 *
 * @return {Array.<Element>} The matching select elements.
 */
clientSideScripts.findSelects = function() {
  var using = arguments[0] || document;
  var model = arguments[1];
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
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The model name.
 *
 * @return {Array.<Element>} The matching select elements.
*/
clientSideScripts.findSelectedOptions = function() {
  var using = arguments[0] || document;
  var model = arguments[1];
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
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {String} The model name.
 *
 * @return {Array.<Element>} An array of matching textarea elements.
*/
clientSideScripts.findTextareas = function() {
  var using = arguments[0] || document;
  var model = arguments[1];

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
  var callback = arguments[arguments.length - 1];
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
