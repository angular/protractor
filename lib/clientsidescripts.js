/**
 * All scripts to be run on the client via executeAsyncScript or
 * executeScript should be put here. These scripts are transmitted over
 * the wire using their toString representation, and cannot reference
 * external variables. They can, however use the array passed in to
 * arguments.
 *
 * Some implementations seem to have issues with // comments, so use star-style
 * inside scripts.
 */

 // jshint browser: true
 // jshint shadow: true
 /* global angular */
var clientSideScripts = exports;

/**
 * Wait until Angular has finished rendering and has
 * no outstanding $http calls before continuing.
 *
 * Asynchronous.
 *
 * @param {string} selector The selector housing an ng-app
 * @param {function} callback callback
 */
clientSideScripts.waitForAngular = function(selector, callback) {
  var el = document.querySelector(selector);
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
 * @param {string} binding The binding, e.g. {{cat.name}}.
 * @param {boolean} exactMatch Whether the binding needs to be matched exactly
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} The elements containing the binding.
 */
clientSideScripts.findBindings = function(binding, exactMatch, using) {
  using = using || document;
  var bindings = using.getElementsByClassName('ng-binding');
  var matches = [];
  for (var i = 0; i < bindings.length; ++i) {
    var dataBinding = angular.element(bindings[i]).data('$binding');
    if(dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (exactMatch) {
        var matcher = new RegExp('([^a-zA-Z\\d]|$)' + binding + '([^a-zA-Z\\d]|^)');
        if (matcher.test(bindingName)) {
          matches.push(bindings[i]);
        }
      } else {
        if (bindingName.indexOf(binding) != -1) {
          matches.push(bindings[i]);
        }
      }
      
    }
  }
  return matches; /* Return the whole array for webdriver.findElements. */
};

/**
 * Find an array of elements matching a row within an ng-repeat.
 * Always returns an array of only one element for plain old ng-repeat.
 * Returns an array of all the elements in one segment for ng-repeat-start.
 *
 * @param {string} repeater The text of the repeater, e.g. 'cat in cats'.
 * @param {number} index The row index.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The row of the repeater, or an array of elements
 *     in the first row in the case of ng-repeat-start.
 */
 clientSideScripts.findRepeaterRows = function(repeater, index, using) {
  using = using || document;

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
  /* multiRows is an array of arrays, where each inner array contains
     one row of elements. */
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
 * @param {string} repeater The text of the repeater, e.g. 'cat in cats'.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} All rows of the repeater.
 */
 clientSideScripts.findAllRepeaterRows = function(repeater, using) {
  using = using || document;

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
 * @param {string} repeater The text of the repeater, e.g. 'cat in cats'.
 * @param {number} index The row index.
 * @param {string} binding The column binding, e.g. '{{cat.name}}'.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The element in an array.
 */
clientSideScripts.findRepeaterElement = function(repeater, index, binding, using) {
  var matches = [];
  using = using || document;

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
  /* multiRows is an array of arrays, where each inner array contains
     one row of elements. */
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
      var rowElem = multiRow[i];
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
 * @param {string} repeater The text of the repeater, e.g. 'cat in cats'.
 * @param {string} binding The column binding, e.g. '{{cat.name}}'.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The elements in the column.
 */
clientSideScripts.findRepeaterColumn = function(repeater, binding, using) {
  var matches = [];
  using = using || document;

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
  /* multiRows is an array of arrays, where each inner array contains
     one row of elements. */
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
 * @param {string} model The model name.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The matching input elements.
 */
clientSideScripts.findInputs = function(model, using) {
  using = using || document;
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
 * @param {string} model The model name.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The matching elements.
 */
clientSideScripts.findByModel = function(model, using) {
  using = using || document;
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
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The matching elements.
 */
clientSideScripts.findByButtonText = function(searchText, using) {
  using = using || document;
  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == 'button') {
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
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The matching elements.
 */
clientSideScripts.findByPartialButtonText = function(searchText, using) {
  using = using || document;
  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == 'button') {
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
 * @param {string} model The model name.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The matching select elements.
 */
clientSideScripts.findSelects = function(model, using) {
  using = using || document;
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
 * @param {string} model The model name.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} The matching select elements.
*/
clientSideScripts.findSelectedOptions = function(model, using) {
  using = using || document;
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
 * @param {String} model The model name.
 * @param {Element} using The scope of the search.  Defaults to 'document'.
 *
 * @return {Array.<Element>} An array of matching textarea elements.
*/
clientSideScripts.findTextareas = function(model, using) {
  using = using || document;

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
 * Find elements by css selector and textual content.
 *
 * @param {string} cssSelector The css selector to match.
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search. Defaults to 'document'.
 *
 * @return {Array.<Element>} An array of matching elements.
 */
clientSideScripts.findByCssContainingText = function(cssSelector, searchText, using) {
  var using = using || document;
  var elements = using.querySelectorAll(cssSelector);
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText = element.innerText || element.textContent;
    if (elementText.indexOf(searchText) > -1) {
      matches.push(element);
    }
  }
  return matches;
};

/**
 * Tests whether the angular global variable is present on a page. Retries
 * in case the page is just loading slowly.
 *
 * Asynchronous.
 *
 * @param {number} attempts Number of times to retry.
 * @param {function} asyncCallback callback
 */
clientSideScripts.testForAngular = function(attempts, asyncCallback) {
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
        window.setTimeout(function() {check(n - 1);}, 1000);
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
 * @param {Element} element The element in whose scope to evaluate.
 * @param {string} expression The expression to evaluate.
 *
 * @return {?Object} The result of the evaluation.
 */
clientSideScripts.evaluate = function(element, expression) {

  return angular.element(element).scope().$eval(expression);
};

/**
 * Return the current url using $location.absUrl().
 *
 * @param {string} selector The selector housing an ng-app
 */
clientSideScripts.getLocationAbsUrl = function(selector) {
  var el = document.querySelector(selector);
  return angular.element(el).injector().get('$location').absUrl();
};

/**
 * Browse to another page using in-page navigation.
 *
 * @param {string} selector The selector housing an ng-app
 * @param {string} url In page URL using the same syntax as $location.url(),
 *     /path?search=a&b=c#hash
 */
clientSideScripts.setLocation = function(selector, url) {
  var el = document.querySelector(selector);
  var $injector = angular.element(el).injector();
  var $location = $injector.get('$location');
  var $rootScope = $injector.get('$rootScope');

  if (url !== $location.url()) {
    $location.url(url);
    $rootScope.$digest();
  }
};
