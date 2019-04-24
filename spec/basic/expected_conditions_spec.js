describe('expected conditions', () => {
  let EC = null;

  beforeEach(async () => {
    await browser.get('index.html#/form');
    EC = protractor.ExpectedConditions;
  });

  it('should have alertIsPresent', async () => {
    const alertIsPresent = EC.alertIsPresent();
    expect(await alertIsPresent.call()).toBe(false);

    const alertButton = $('#alertbutton');
    await alertButton.click();
    await browser.wait(protractor.ExpectedConditions.alertIsPresent(), 5000);
    await browser.switchTo().alert().accept();
  });

  it('should have presenceOf', async () => {
    const presenceOfInvalid = EC.presenceOf($('#INVALID'));
    const presenceOfHideable = EC.presenceOf($('#shower'));

    expect(await presenceOfInvalid.call()).toBe(false);
    expect(await presenceOfHideable.call()).toBe(true);
    await element(by.model('show')).click();
    expect(await presenceOfHideable.call()).toBe(true); // Should be able to reuse.
  });

  it('should have stalenessOf', async () => {
    const stalenessOfInvalid = EC.stalenessOf($('#INVALID'));
    const stalenessOfHideable = EC.stalenessOf($('#shower'));

    expect(await stalenessOfInvalid.call()).toBe(true);
    expect(await stalenessOfHideable.call()).toBe(false);
    await element(by.model('show')).click();
    expect(await stalenessOfHideable.call()).toBe(false);
  });

  it('should have visibilityOf', async () => {
    const visibilityOfInvalid = EC.visibilityOf($('#INVALID'));
    const visibilityOfHideable = EC.visibilityOf($('#shower'));

    expect(await visibilityOfInvalid.call()).toBe(false);
    expect(await visibilityOfHideable.call()).toBe(true);
    await element(by.model('show')).click();
    expect(await visibilityOfHideable.call()).toBe(false);
  });

  it('should have invisibilityOf', async () => {
    const invisibilityOfInvalid = EC.invisibilityOf($('#INVALID'));
    const invisibilityOfHideable = EC.invisibilityOf($('#shower'));

    expect(await invisibilityOfInvalid.call()).toBe(true);
    expect(await invisibilityOfHideable.call()).toBe(false);
    await element(by.model('show')).click();
    expect(await invisibilityOfHideable.call()).toBe(true);
  });

  it('should have titleContains', async () => {
    expect(await EC.titleContains('My Angular').call()).toBe(true);
    expect(await EC.titleContains('My AngularJS App').call()).toBe(true);
  });

  it('should have titleIs', async () => {
    expect(await EC.titleIs('My Angular').call()).toBe(false);
    expect(await EC.titleIs('My AngularJS App').call()).toBe(true);
  });

  it('should have urlContains', async () => {
    const baseUrlFromSpec = browser.baseUrl;
    expect(await EC.urlContains('/form').call()).toBe(true);
    expect(await EC.urlContains(baseUrlFromSpec+ 'index.html#/form').call()).toBe(true);
  });

  it('should have urlIs', async () => {
    const baseUrlFromSpec = browser.baseUrl;
    expect(await EC.urlIs(browser.baseUrl).call()).toBe(false);
    expect(await EC.urlIs(baseUrlFromSpec+'index.html#/form').call()).toBe(true);
  });

  it('should have elementToBeClickable', async () => {
    const invalidIsClickable = EC.elementToBeClickable($('#INVALID'));
    const buttonIsClickable = EC.elementToBeClickable($('#disabledButton'));

    expect(await invalidIsClickable.call()).toBe(false);
    expect(await buttonIsClickable.call()).toBe(true);
    await element(by.model('disabled')).click();
    expect(await buttonIsClickable.call()).toBe(false);
  });

  it('should have textToBePresentInElement', async () => {
    const invalidHasText = EC.textToBePresentInElement($('#INVALID'), 'shouldnt throw');
    const hideableHasText = EC.textToBePresentInElement($('#shower'), 'Shown');

    expect(await invalidHasText.call()).toBe(false);
    expect(await hideableHasText.call()).toBe(true);
    await element(by.model('show')).click();
    expect(await hideableHasText.call()).toBe(false);
  });

  it('should have textToBePresentInElementValue', async () => {
    const invalid = $('#INVALID');
    const about = element(by.model('aboutbox'));

    expect(await EC.textToBePresentInElementValue(invalid, 'shouldnt throw').call()).toBe(false);
    expect(await EC.textToBePresentInElementValue(about, 'text box').call()).toBe(true);
  });

  it('should have elementToBeSelected', async () => {
    const checkbox = element(by.model('show'));

    expect(await EC.elementToBeSelected(checkbox).call()).toBe(true);
    await checkbox.click();
    expect(await EC.elementToBeSelected(checkbox).call()).toBe(false);
  });

  it('should have not', async () => {
    const presenceOfValidElement = EC.presenceOf($('#shower'));
    expect(await presenceOfValidElement.call()).toBe(true);
    expect(await EC.not(presenceOfValidElement).call()).toBe(false);
  });

  it('should have and', async () => {
    const presenceOfValidElement = EC.presenceOf($('#shower'));
    const presenceOfInvalidElement = EC.presenceOf($('#INVALID'));
    const validityOfTitle = EC.titleIs('My AngularJS App');

    expect(await EC.and(presenceOfValidElement, validityOfTitle).call()).toBe(true);
    // support multiple conditions
    expect(await EC.and(presenceOfValidElement, validityOfTitle, presenceOfInvalidElement).call()).toBe(false);
  });

  it('and should shortcircuit', async () => {
    const invalidElem = $('#INVALID');

    const presenceOfInvalidElement = EC.presenceOf(invalidElem);
    const isDisplayed = invalidElem.isDisplayed.bind(invalidElem);

    // check isDisplayed on invalid element
    const condition = EC.and(presenceOfInvalidElement, isDisplayed);

    // Should short circuit after the first condition is false, and not throw error
    expect(await condition.call()).toBe(false);
  });

  it('should have or', async () => {
    const presenceOfValidElement = EC.presenceOf($('#shower'));
    const presenceOfInvalidElement = EC.presenceOf($('#INVALID'));
    const presenceOfInvalidElement2 = EC.presenceOf($('#INVALID2'));

    expect(await EC.or(presenceOfInvalidElement, presenceOfInvalidElement2).call()).toBe(false);
    // support multiple conditions
    expect(await EC.or(presenceOfInvalidElement, presenceOfInvalidElement2, presenceOfValidElement).call()).toBe(true);
  });

  it('or should shortcircuit', async () => {
    const validElem = $('#shower');
    const invalidElem = $('#INVALID');

    const presenceOfValidElement = EC.presenceOf(validElem);
    const isDisplayed = invalidElem.isDisplayed.bind(invalidElem);

    // check isDisplayed on invalid element
    const condition = EC.or(presenceOfValidElement, isDisplayed);

    // Should short circuit after the first condition is true, and not throw error
    expect(await condition.call()).toBe(true);
  });

  it('should be able to mix conditions', async () => {
    const valid = EC.presenceOf($('#shower'));
    const invalid = EC.presenceOf($('#INVALID'));

    expect(await EC.or(valid, await EC.and(valid, invalid)).call()).toBe(true);
    expect(await EC.or(EC.not(valid), EC.and(valid, invalid)).call()).toBe(false);
  });

  describe('for forked browsers', () => {
    // ensure that we can run EC on forked browser instances
    it('should have alertIsPresent', async () => {
      const browser2 = await browser.forkNewDriverInstance();
      await browser2.get('index.html#/form');
      const EC2 = browser2.ExpectedConditions;
      const alertIsPresent = EC2.alertIsPresent();
      expect(await alertIsPresent.call()).toBe(false);

      const alertButton = browser2.$('#alertbutton');
      await alertButton.click();
      await browser2.wait(EC2.alertIsPresent(), 1000);

      await browser2.switchTo().alert().accept();
    });
  });

  describe('race condition handling', () => {

    let disabledButton;

    beforeEach(() => {
      disabledButton = $('#disabledButton[disabled="disabled"]');
    });

    const enableButtonBeforeCallToUnmatchSelector = async (testElement, fnName) => {
      const originalFn = testElement[fnName];

      testElement[fnName] = async () => {
        await element(by.model('disabled')).click();
        return originalFn.apply(this, arguments);
      };

      // save original fn with _ prefix
      testElement[`_${fnName}`] = originalFn;
    };

    it('can deal with missing elements in visibilityOf', async () => {
      await enableButtonBeforeCallToUnmatchSelector(disabledButton, 'isDisplayed');

      await element(by.model('disabled')).click();

      expect(await disabledButton._isDisplayed()).toBe(true);
      expect(await EC.visibilityOf(disabledButton).call()).toBe(false);
    });

    it('can deal with missing elements in textToBePresentInElement', async () => {
      await enableButtonBeforeCallToUnmatchSelector(disabledButton, 'getText');

      await element(by.model('disabled')).click();

      expect(await disabledButton._getText()).toBe('Dummy');
      expect(await EC.textToBePresentInElement(disabledButton, 'Dummy').call()).toBe(false);
    });

    it('can deal with missing elements in textToBePresentInValue', async () => {
      await enableButtonBeforeCallToUnmatchSelector(disabledButton, 'getAttribute');

      await element(by.model('disabled')).click();

      expect(await disabledButton._getAttribute('value')).toBe('');
      expect(await EC.textToBePresentInElementValue(disabledButton, '').call()).toBe(false);
    });

    it('can deal with missing elements in elementToBeClickable', async () => {
      await enableButtonBeforeCallToUnmatchSelector(disabledButton, 'isEnabled');

      await element(by.model('disabled')).click();

      expect(await disabledButton._isEnabled()).toBe(false);
      expect(await EC.elementToBeClickable(disabledButton).call()).toBe(false);
    });
  });
});
