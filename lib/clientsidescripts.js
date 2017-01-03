/**
 * All scripts to be run on the client via executeAsyncScript or
 * executeScript should be put here.
 *
 * NOTE: These scripts are transmitted over the wire as JavaScript text
 * constructed using their toString representation, and *cannot*
 * reference external variables.
 *
 * Some implementations seem to have issues with // comments, so use star-style
 * inside scripts.  (TODO: add issue number / example implementations
 * that caused the switch to avoid the // comments.)
 */

// jshint browser: true
// jshint shadow: true
/* global angular */
var functions = {};

///////////////////////////////////////////////////////
////                                               ////
////                    HELPERS                    ////
////                                               ////
///////////////////////////////////////////////////////


/* Wraps a function up into a string with its helper functions so that it can
 * call those helper functions client side
 *
 * @param {function} fun The function to wrap up with its helpers
 * @param {...function} The helper functions.  Each function must be named
 *
 * @return {string} The string which, when executed, will invoke fun in such a
 *   way that it has access to its helper functions
 */
function wrapWithHelpers(fun) {
  var helpers = Array.prototype.slice.call(arguments, 1);
  if (!helpers.length) {
    return fun;
  }
  var FunClass = Function; // Get the linter to allow this eval
  return new FunClass(
      helpers.join(';') + String.fromCharCode(59) +
      '  return (' + fun.toString() + ').apply(this, arguments);');
}

/* Tests if an ngRepeat matches a repeater
 *
 * @param {string} ngRepeat The ngRepeat to test
 * @param {string} repeater The repeater to test against
 * @param {boolean} exact If the ngRepeat expression needs to match the whole
 *   repeater (not counting any `track by ...` modifier) or if it just needs to
 *   match a substring
 * @return {boolean} If the ngRepeat matched the repeater
 */
function repeaterMatch(ngRepeat, repeater, exact) {
  if (exact) {
    return ngRepeat.split(' track by ')[0].split(' as ')[0].split('|')[0].
        split('=')[0].trim() == repeater;
  } else {
    return ngRepeat.indexOf(repeater) != -1;
  }
}

/* Tries to find $$testability and possibly $injector for an ng1 app
 *
 * By default, doesn't care about $injector if it finds $$testability.  However,
 * these priorities can be reversed.
 *
 * @param {string=} selector The selector for the element with the injector.  If
 *   falsy, tries a variety of methods to find an injector
 * @param {boolean=} injectorPlease Prioritize finding an injector
 * @return {$$testability?: Testability, $injector?: Injector} Returns whatever
 *   ng1 app hooks it finds
 */
function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {} 
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng:controller]');
  }
}

///////////////////////////////////////////////////////
////                                               ////
////                    SCRIPTS                    ////
////                                               ////
///////////////////////////////////////////////////////


/**
 * Wait until Angular has finished rendering and has
 * no outstanding $http calls before continuing. The specific Angular app
 * is determined by the rootSelector.
 *
 * Asynchronous.
 *
 * @param {string} rootSelector The selector housing an ng-app
 * @param {function(string)} callback callback. If a failure occurs, it will
 *     be passed as a parameter.
 */
functions.waitForAngular = function(rootSelector, callback) {
  try {
    if (window.angular && !(window.angular.version &&
          window.angular.version.major > 1)) {
      /* ng1 */
      let hooks = getNg1Hooks(rootSelector);
      if (hooks.$$testability) {
        hooks.$$testability.whenStable(callback);
      } else if (hooks.$injector) {
        hooks.$injector.get('$browser').
            notifyWhenNoOutstandingRequests(callback);
      } else if (!!rootSelector) {
        throw new Error('Could not automatically find injector on page: "' +
            window.location.toString() + '".  Consider using config.rootEl');
      } else {
        throw new Error('root element (' + rootSelector + ') has no injector.' +
           ' this may mean it is not inside ng-app.');
      }
    } else if (rootSelector && window.getAngularTestability) {
      var el = document.querySelector(rootSelector);
      window.getAngularTestability(el).whenStable(callback);
    } else if (window.getAllAngularTestabilities) {
      var testabilities = window.getAllAngularTestabilities();
      var count = testabilities.length;
      var decrement = function() {
        count--;
        if (count === 0) {
          callback();
        }
      };
      testabilities.forEach(function(testability) {
        testability.whenStable(decrement);
      });
    } else if (!window.angular) {
      throw new Error('window.angular is undefined.  This could be either ' +
          'because this is a non-angular page or because your test involves ' +
          'client-side navigation, which can interfere with Protractor\'s ' +
          'bootstrapping.  See http://git.io/v4gXM for details');
    } else if (window.angular.version >= 2) {
      throw new Error('You appear to be using angular, but window.' +
          'getAngularTestability was never set.  This may be due to bad ' +
          'obfuscation.');
    } else {
      throw new Error('Cannot get testability API for unknown angular ' +
          'version "' + window.angular.version + '"');
    }
  } catch (err) {
    callback(err.message);
  }
};

/**
 * Find a list of elements in the page by their angular binding.
 *
 * @param {string} binding The binding, e.g. {{cat.name}}.
 * @param {boolean} exactMatch Whether the binding needs to be matched exactly
 * @param {Element} using The scope of the search.
 * @param {string} rootSelector The selector to use for the root app element.
 *
 * @return {Array.<Element>} The elements containing the binding.
 */
functions.findBindings = function(binding, exactMatch, using, rootSelector) {
  using = using || document;
  if (angular.getTestability) {
    return getNg1Hooks(rootSelector).$$testability.
        findBindings(using, binding, exactMatch);
  }
  var bindings = using.getElementsByClassName('ng-binding');
  var matches = [];
  for (var i = 0; i < bindings.length; ++i) {
    var dataBinding = angular.element(bindings[i]).data('$binding');
    if (dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (exactMatch) {
        var matcher = new RegExp('({|\\s|^|\\|)' +
            /* See http://stackoverflow.com/q/3561711 */
            binding.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') +
            '(}|\\s|$|\\|)');
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
 * @param {boolean} exact Whether the repeater needs to be matched exactly
 * @param {number} index The row index.
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} The row of the repeater, or an array of elements
 *     in the first row in the case of ng-repeat-start.
 */
function findRepeaterRows(repeater, exact, index, using) {
  using = using || document;

  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  var rows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
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
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 ||
            !repeaterMatch(elem.nodeValue, repeater)) {
          if (elem.nodeType == 1) {
            row.push(elem);
          }
          elem = elem.nextSibling;
        }
        multiRows.push(row);
      }
    }
  }
  var row = rows[index] || [], multiRow = multiRows[index] || [];
  return [].concat(row, multiRow);
}
functions.findRepeaterRows = wrapWithHelpers(findRepeaterRows, repeaterMatch); 

 /**
 * Find all rows of an ng-repeat.
 *
 * @param {string} repeater The text of the repeater, e.g. 'cat in cats'.
 * @param {boolean} exact Whether the repeater needs to be matched exactly
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} All rows of the repeater.
 */
function findAllRepeaterRows(repeater, exact, using) {
  using = using || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        rows.push(repeatElems[i]);
      }
    }
  }
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        while (elem.nodeType != 8 ||
            !repeaterMatch(elem.nodeValue, repeater)) {
          if (elem.nodeType == 1) {
            rows.push(elem);
          }
          elem = elem.nextSibling;
        }
      }
    }
  }
  return rows;
}
functions.findAllRepeaterRows = wrapWithHelpers(findAllRepeaterRows, repeaterMatch);

/**
 * Find an element within an ng-repeat by its row and column.
 *
 * @param {string} repeater The text of the repeater, e.g. 'cat in cats'.
 * @param {boolean} exact Whether the repeater needs to be matched exactly
 * @param {number} index The row index.
 * @param {string} binding The column binding, e.g. '{{cat.name}}'.
 * @param {Element} using The scope of the search.
 * @param {string} rootSelector The selector to use for the root app element.
 *
 * @return {Array.<Element>} The element in an array.
 */
function findRepeaterElement(repeater, exact, index, binding, using, rootSelector) {
  var matches = [];
  using = using || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
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
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 || (elem.nodeValue &&
            !repeaterMatch(elem.nodeValue, repeater))) {
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
    if (angular.getTestability) {
      matches.push.apply(
          matches,
          getNg1Hooks(rootSelector).$$testability.findBindings(row, binding));
    } else {
      if (row.className.indexOf('ng-binding') != -1) {
        bindings.push(row);
      }
      var childBindings = row.getElementsByClassName('ng-binding');
      for (var i = 0; i < childBindings.length; ++i) {
        bindings.push(childBindings[i]);
      }
    }
  }
  if (multiRow) {
    for (var i = 0; i < multiRow.length; ++i) {
      var rowElem = multiRow[i];
      if (angular.getTestability) {
        matches.push.apply(
            matches,
            getNg1Hooks(rootSelector).$$testability.findBindings(rowElem,
                binding));
      } else {
        if (rowElem.className.indexOf('ng-binding') != -1) {
          bindings.push(rowElem);
        }
        var childBindings = rowElem.getElementsByClassName('ng-binding');
        for (var j = 0; j < childBindings.length; ++j) {
          bindings.push(childBindings[j]);
        }
      }
    }
  }
  for (var i = 0; i < bindings.length; ++i) {
    var dataBinding = angular.element(bindings[i]).data('$binding');
    if (dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[i]);
      }
    }
  }
  return matches;
}
functions.findRepeaterElement =
    wrapWithHelpers(findRepeaterElement, repeaterMatch, getNg1Hooks);

/**
 * Find the elements in a column of an ng-repeat.
 *
 * @param {string} repeater The text of the repeater, e.g. 'cat in cats'.
 * @param {boolean} exact Whether the repeater needs to be matched exactly
 * @param {string} binding The column binding, e.g. '{{cat.name}}'.
 * @param {Element} using The scope of the search.
 * @param {string} rootSelector The selector to use for the root app element.
 *
 * @return {Array.<Element>} The elements in the column.
 */
function findRepeaterColumn(repeater, exact, binding, using, rootSelector) {
  var matches = [];
  using = using || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
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
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 || (elem.nodeValue &&
            !repeaterMatch(elem.nodeValue, repeater))) {
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
    if (angular.getTestability) {
      matches.push.apply(
          matches,
          getNg1Hooks(rootSelector).$$testability.findBindings(rows[i],
              binding));
    } else {
      if (rows[i].className.indexOf('ng-binding') != -1) {
        bindings.push(rows[i]);
      }
      var childBindings = rows[i].getElementsByClassName('ng-binding');
      for (var k = 0; k < childBindings.length; ++k) {
        bindings.push(childBindings[k]);
      }
    }
  }
  for (var i = 0; i < multiRows.length; ++i) {
    for (var j = 0; j < multiRows[i].length; ++j) {
      if (angular.getTestability) {
        matches.push.apply(
            matches,
            getNg1Hooks(rootSelector).$$testability.findBindings(
                multiRows[i][j], binding));
      } else {
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
}
functions.findRepeaterColumn =
    wrapWithHelpers(findRepeaterColumn, repeaterMatch, getNg1Hooks);

/**
 * Find elements by model name.
 *
 * @param {string} model The model name.
 * @param {Element} using The scope of the search.
 * @param {string} rootSelector The selector to use for the root app element.
 *
 * @return {Array.<Element>} The matching elements.
 */
functions.findByModel = function(model, using, rootSelector) {
  using = using || document;

  if (angular.getTestability) {
    return getNg1Hooks(rootSelector).$$testability.
        findModels(using, model, true);
  }
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
 * Find elements by options.
 *
 * @param {string} optionsDescriptor The descriptor for the option
 *     (i.e. fruit for fruit in fruits).
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} The matching elements.
 */
functions.findByOptions = function(optionsDescriptor, using) {
  using = using || document;

  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = '[' + prefixes[p] + 'options="' + optionsDescriptor + '"] option';
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
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} The matching elements.
 */
functions.findByButtonText = function(searchText, using) {
  using = using || document;

  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == 'button') {
      elementText = element.textContent || element.innerText || '';
    } else {
      elementText = element.value;
    }
    if (elementText.trim() === searchText) {
      matches.push(element);
    }
  }

  return matches;
};

/**
 * Find buttons by textual content.
 *
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} The matching elements.
 */
functions.findByPartialButtonText = function(searchText, using) {
  using = using || document;

  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == 'button') {
      elementText = element.textContent || element.innerText || '';
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
 * Find elements by css selector and textual content.
 *
 * @param {string} cssSelector The css selector to match.
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} An array of matching elements.
 */
functions.findByCssContainingText = function(cssSelector, searchText, using) {
  using = using || document;

  var elements = using.querySelectorAll(cssSelector);
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText = element.textContent || element.innerText || '';
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
 * @param {boolean} ng12Hybrid Flag set if app is a hybrid of angular 1 and 2
 * @param {function({version: ?number, message: ?string})} asyncCallback callback
 *
 */
functions.testForAngular = function(attempts, ng12Hybrid, asyncCallback) {
  var callback = function(args) {
    setTimeout(function() {
      asyncCallback(args);
    }, 0);
  };
  var definitelyNg1 = !!ng12Hybrid;
  var definitelyNg2OrNewer = false;
  var check = function(n) {
    try {
      /* Figure out which version of angular we're waiting on */
      if (!definitelyNg1 && !definitelyNg2OrNewer) {
        if (window.angular && !(window.angular.version && window.angular.version.major > 1)) {
          definitelyNg1 = true;
        } else if (window.getAllAngularTestabilities) {
          definitelyNg2OrNewer = true;
        }
      }
      /* See if our version of angular is ready */
      if (definitelyNg1) {
        if (window.angular && window.angular.resumeBootstrap) {
          return callback({ver: 1});
        }
      } else if (definitelyNg2OrNewer) {
        if (true /* ng2 has no resumeBootstrap() */) {
          return callback({ver: 2});
        }
      }
      /* Try again (or fail) */
      if (n < 1) {
        if (definitelyNg1 && window.angular) {
          callback({message: 'angular never provided resumeBootstrap'});
        } else if (ng12Hybrid && !window.angular) { 
          callback({message: 'angular 1 never loaded' +
              window.getAllAngularTestabilities ? ' (are you sure this app ' +
              'uses ngUpgrade?  Try un-setting ng12Hybrid)' : ''});
        } else {
          callback({message: 'retries looking for angular exceeded'});
        }
      } else {
        window.setTimeout(function() {check(n - 1);}, 1000);
      }
    } catch (e) {
      callback({message: e});
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
functions.evaluate = function(element, expression) {
  return angular.element(element).scope().$eval(expression);
};

functions.allowAnimations = function(element, value) {
  var ngElement = angular.element(element);
  if (ngElement.allowAnimations) {
    // AngularDart: $testability API.
    return ngElement.allowAnimations(value);
  } else {
    // AngularJS
    var enabledFn = ngElement.injector().get('$animate').enabled;
    return (value == null) ? enabledFn() : enabledFn(value);
  }
};

/**
 * Return the current url using $location.absUrl().
 *
 * @param {string} selector The selector housing an ng-app
 */
functions.getLocationAbsUrl = function(selector) {
  var hooks = getNg1Hooks(selector);
  if (angular.getTestability) {
    return hooks.$$testability.getLocation();
  }
  return hooks.$injector.get('$location').absUrl();
};

/**
 * Browse to another page using in-page navigation.
 *
 * @param {string} selector The selector housing an ng-app
 * @param {string} url In page URL using the same syntax as $location.url(),
 *     /path?search=a&b=c#hash
 */
functions.setLocation = function(selector, url) {
  var hooks = getNg1Hooks(selector);
  if (angular.getTestability) {
    return hooks.$$testability.setLocation(url);
  }
  var $injector = hooks.$injector;
  var $location = $injector.get('$location');
  var $rootScope = $injector.get('$rootScope');

  if (url !== $location.url()) {
    $location.url(url);
    $rootScope.$digest();
  }
};

/**
 * Retrieve the pending $http requests.
 *
 * @param {string} selector The selector housing an ng-app
 * @return {!Array<!Object>} An array of pending http requests.
 */
functions.getPendingHttpRequests = function(selector) {
  var hooks = getNg1Hooks(selector, true);
  var $http = hooks.$injector.get('$http');
  return $http.pendingRequests;
};

['waitForAngular', 'findBindings', 'findByModel', 'getLocationAbsUrl',
  'setLocation', 'getPendingHttpRequests'].forEach(function(funName) {
    functions[funName] = wrapWithHelpers(functions[funName], getNg1Hooks);
});

/* Publish all the functions as strings to pass to WebDriver's
 * exec[Async]Script.  In addition, also include a script that will
 * install all the functions on window (for debugging.)
 *
 * We also wrap any exceptions thrown by a clientSideScripts function
 * that is not an instance of the Error type into an Error type.  If we
 * don't do so, then the resulting stack trace is completely unhelpful
 * and the exception message is just "unknown error."  These types of
 * exceptions are the common case for dart2js code.  This wrapping gives
 * us the Dart stack trace and exception message.
 */
var util = require('util');
var scriptsList = [];
var scriptFmt = (
    'try { return (%s).apply(this, arguments); }\n' +
    'catch(e) { throw (e instanceof Error) ? e : new Error(e); }');
for (var fnName in functions) {
  if (functions.hasOwnProperty(fnName)) {
    exports[fnName] = util.format(scriptFmt, functions[fnName]);
    scriptsList.push(util.format('%s: %s', fnName, functions[fnName]));
  }
}

exports.installInBrowser = (util.format(
    'window.clientSideScripts = {%s};', scriptsList.join(', ')));

/**
 * Automatically installed by Protractor when a page is loaded, this
 * default mock module decorates $timeout to keep track of any
 * outstanding timeouts.
 *
 * @param {boolean} trackOutstandingTimeouts
 */
exports.protractorBaseModuleFn = function(trackOutstandingTimeouts) {
  var ngMod = angular.module('protractorBaseModule_', []).config([
    '$compileProvider',
    function($compileProvider) {
      if ($compileProvider.debugInfoEnabled) {
        $compileProvider.debugInfoEnabled(true);
      }
    }
  ]);
  if (trackOutstandingTimeouts) {
    ngMod.config([
      '$provide',
      function ($provide) {
        $provide.decorator('$timeout', [
          '$delegate',
          function ($delegate) {
            var $timeout = $delegate;

            var taskId = 0;

            if (!window['NG_PENDING_TIMEOUTS']) {
              window['NG_PENDING_TIMEOUTS'] = {};
            }

            var extendedTimeout= function() {
              var args = Array.prototype.slice.call(arguments);
              if (typeof(args[0]) !== 'function') {
                return $timeout.apply(null, args);
              }

              taskId++;
              var fn = args[0];
              window['NG_PENDING_TIMEOUTS'][taskId] =
                  fn.toString();
              var wrappedFn = (function(taskId_) {
                return function() {
                  delete window['NG_PENDING_TIMEOUTS'][taskId_];
                  return fn.apply(null, arguments);
                };
              })(taskId);
              args[0] = wrappedFn;

              var promise = $timeout.apply(null, args);
              promise.ptorTaskId_ = taskId;
              return promise;
            };

            extendedTimeout.cancel = function() {
              var taskId_ = arguments[0] && arguments[0].ptorTaskId_;
              if (taskId_) {
                delete window['NG_PENDING_TIMEOUTS'][taskId_];
              }
              return $timeout.cancel.apply($timeout, arguments);
            };

            return extendedTimeout;
          }
        ]);
      }
    ]);
  }
};
