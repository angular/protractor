var EC = protractor.ExpectedConditions;

describe('expected conditions', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should have alertIsPresent', function() {
    var alertIsPresent = EC.alertIsPresent();
    expect(alertIsPresent.call()).toBe(false);

    var alertButton = $('#alertbutton');
    alertButton.click();
    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 5000);
    browser.switchTo().alert().accept();
  });

  it('should have presenceOf', function() {
    var presenceOfInvalid = EC.presenceOf($('#INVALID'));
    var presenceOfHideable = EC.presenceOf($('#shower'));

    expect(presenceOfInvalid.call()).toBe(false);
    expect(presenceOfHideable.call()).toBe(true);
    element(by.model('show')).click();
    expect(presenceOfHideable.call()).toBe(true); // Should be able to reuse.
  });

  it('should have stalenessOf', function() {
    var stalenessOfInvalid = EC.stalenessOf($('#INVALID'));
    var stalenessOfHideable = EC.stalenessOf($('#shower'));

    expect(stalenessOfInvalid.call()).toBe(true);
    expect(stalenessOfHideable.call()).toBe(false);
    element(by.model('show')).click();
    expect(stalenessOfHideable.call()).toBe(false);
  });

  it('should have visibilityOf', function() {
    var visibilityOfInvalid = EC.visibilityOf($('#INVALID'));
    var visibilityOfHideable = EC.visibilityOf($('#shower'));

    expect(visibilityOfInvalid.call()).toBe(false);
    expect(visibilityOfHideable.call()).toBe(true);
    element(by.model('show')).click();
    expect(visibilityOfHideable.call()).toBe(false);
  });

  it('should have invisibilityOf', function() {
    var invisibilityOfInvalid = EC.invisibilityOf($('#INVALID'));
    var invisibilityOfHideable = EC.invisibilityOf($('#shower'));

    expect(invisibilityOfInvalid.call()).toBe(true);
    expect(invisibilityOfHideable.call()).toBe(false);
    element(by.model('show')).click();
    expect(invisibilityOfHideable.call()).toBe(true);
  });

  it('should have titleContains', function() {
    expect(EC.titleContains('My Angular').call()).toBe(true);
    expect(EC.titleContains('My AngularJS App').call()).toBe(true);
  });

  it('should have titleIs', function() {
    expect(EC.titleIs('My Angular').call()).toBe(false);
    expect(EC.titleIs('My AngularJS App').call()).toBe(true);
  });

  it('should have urlContains', function() {
      var baseUrlFromSpec = browser.baseUrl;
      expect(EC.urlContains('/form').call()).toBe(true);
      expect(EC.urlContains(baseUrlFromSpec+ 'index.html#/form').call()).toBe(true);
  });

  it('should have urlIs', function() {
      var baseUrlFromSpec = browser.baseUrl;
      expect(EC.urlIs(browser.baseUrl).call()).toBe(false);
      expect(EC.urlIs(baseUrlFromSpec+'index.html#/form').call()).toBe(true);
  });

  it('should have elementToBeClickable', function() {
    var invalidIsClickable = EC.elementToBeClickable($('#INVALID'));
    var buttonIsClickable = EC.elementToBeClickable($('#disabledButton'));

    expect(invalidIsClickable.call()).toBe(false);
    expect(buttonIsClickable.call()).toBe(true);
    element(by.model('disabled')).click();
    expect(buttonIsClickable.call()).toBe(false);
  });

  it('should have textToBePresentInElement', function() {
    var invalidHasText = EC.textToBePresentInElement($('#INVALID'), 'shouldnt throw');
    var hideableHasText = EC.textToBePresentInElement($('#shower'), 'Shown');

    expect(invalidHasText.call()).toBe(false);
    expect(hideableHasText.call()).toBe(true);
    element(by.model('show')).click();
    expect(hideableHasText.call()).toBe(false);
  });

  it('should have textToBePresentInElementValue', function() {
    var invalid = $('#INVALID');
    var about = element(by.model('aboutbox'));

    expect(EC.textToBePresentInElementValue(invalid, 'shouldnt throw').call()).toBe(false);
    expect(EC.textToBePresentInElementValue(about, 'text box').call()).toBe(true);
  });

  it('should have elementToBeSelected', function() {
    var checkbox = element(by.model('show'));

    expect(EC.elementToBeSelected(checkbox).call()).toBe(true);
    checkbox.click();
    expect(EC.elementToBeSelected(checkbox).call()).toBe(false);
  });

  it('should have not', function() {
    var presenceOfValidElement = EC.presenceOf($('#shower'));
    expect(presenceOfValidElement.call()).toBe(true);
    expect(EC.not(presenceOfValidElement).call()).toBe(false);
  });

  it('should have and', function() {
    var presenceOfValidElement = EC.presenceOf($('#shower'));
    var presenceOfInvalidElement = EC.presenceOf($('#INVALID'));
    var validityOfTitle = EC.titleIs('My AngularJS App');

    expect(EC.and(presenceOfValidElement, validityOfTitle).call()).toBe(true);
    // support multiple conditions
    expect(EC.and(presenceOfValidElement,
       validityOfTitle, presenceOfInvalidElement).call()).toBe(false);
  });

  it('and should shortcircuit', function() {
    var invalidElem = $('#INVALID');

    var presenceOfInvalidElement = EC.presenceOf(invalidElem);
    var isDisplayed = invalidElem.isDisplayed.bind(invalidElem);

    // check isDisplayed on invalid element
    var condition = EC.and(presenceOfInvalidElement, isDisplayed);

    // Should short circuit after the first condition is false, and not throw error
    expect(condition.call()).toBe(false);
  });

  it('should have or', function() {
    var presenceOfValidElement = EC.presenceOf($('#shower'));
    var presenceOfInvalidElement = EC.presenceOf($('#INVALID'));
    var presenceOfInvalidElement2 = EC.presenceOf($('#INVALID2'));

    expect(EC.or(presenceOfInvalidElement, presenceOfInvalidElement2).call()).toBe(false);
    // support multiple conditions
    expect(EC.or(presenceOfInvalidElement,
        presenceOfInvalidElement2, presenceOfValidElement).call()).toBe(true);
  });

  it('or should shortcircuit', function() {
    var validElem = $('#shower');
    var invalidElem = $('#INVALID');

    var presenceOfValidElement = EC.presenceOf(validElem);
    var isDisplayed = invalidElem.isDisplayed.bind(invalidElem);

    // check isDisplayed on invalid element
    var condition = EC.or(presenceOfValidElement, isDisplayed);

    // Should short circuit after the first condition is true, and not throw error
    expect(condition.call()).toBe(true);
  });

  it('should be able to mix conditions', function() {
    var valid = EC.presenceOf($('#shower'));
    var invalid = EC.presenceOf($('#INVALID'));

    expect(EC.or(valid, EC.and(valid, invalid)).call()).toBe(true);
    expect(EC.or(EC.not(valid), EC.and(valid, invalid)).call()).toBe(false);
  });

  describe('for forked browsers', function() {
    // ensure that we can run EC on forked browser instances
    it('should have alertIsPresent', function() {
      var browser2 = browser.forkNewDriverInstance();
      browser2.get('index.html#/form');
      var EC2 = browser2.ExpectedConditions;
      var alertIsPresent = EC2.alertIsPresent();
      expect(alertIsPresent.call()).toBe(false);

      var alertButton = browser2.$('#alertbutton');
      alertButton.click();
      browser2.wait(EC2.alertIsPresent(), 1000);

      // TODO: Remove sleep when this is fixed:
      //    https://bugs.chromium.org/p/chromedriver/issues/detail?id=1500
      browser2.sleep(250);
      browser2.switchTo().alert().accept();
    });
  });

  describe('race condition handling', function () {

    var disabledButton;

    beforeEach(function () {
      disabledButton = $('#disabledButton[disabled="disabled"]');
    });

    function enableButtonBeforeCallToUnmatchSelector(testElement, fnName) {
      var originalFn = testElement[fnName];

      testElement[fnName] = function () {
        element(by.model('disabled')).click();
        return originalFn.apply(this, arguments);
      };

      // save original fn with _ prefix
      testElement['_' + fnName] = originalFn;
    }

    it('can deal with missing elements in visibilityOf', function() {
      enableButtonBeforeCallToUnmatchSelector(disabledButton, 'isDisplayed');

      element(by.model('disabled')).click();

      expect(disabledButton._isDisplayed()).toBe(true);
      expect(EC.visibilityOf(disabledButton).call()).toBe(false);
    });

    it('can deal with missing elements in textToBePresentInElement', function() {
      enableButtonBeforeCallToUnmatchSelector(disabledButton, 'getText');

      element(by.model('disabled')).click();

      expect(disabledButton._getText()).toBe('Dummy');
      expect(EC.textToBePresentInElement(disabledButton, 'Dummy').call()).toBe(false);
    });

    it('can deal with missing elements in textToBePresentInValue', function() {
      enableButtonBeforeCallToUnmatchSelector(disabledButton, 'getAttribute');

      element(by.model('disabled')).click();

      expect(disabledButton._getAttribute('value')).toBe('');
      expect(EC.textToBePresentInElementValue(disabledButton, '').call()).toBe(false);
    });

    it('can deal with missing elements in elementToBeClickable', function() {
      enableButtonBeforeCallToUnmatchSelector(disabledButton, 'isEnabled');

      element(by.model('disabled')).click();

      expect(disabledButton._isEnabled()).toBe(false);
      expect(EC.elementToBeClickable(disabledButton).call()).toBe(false);
    });
  });
});
