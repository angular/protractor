describe('angular-material input component page', () => {
  const EC = protractor.ExpectedConditions;

  it('Should change input component value', async () => {
    await browser.get('https://material.angular.io/components/input/examples');

    await browser.wait(
      EC.elementToBeClickable($('.mat-button-wrapper>.mat-icon')), 5000);

    const emailInputField = $$('.mat-form-field-infix>input').get(1);
    await emailInputField.sendKeys('invalid');
    expect(await $('mat-error').isPresent()).toBe(true);
  });
});