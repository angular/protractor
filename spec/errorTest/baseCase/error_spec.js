describe('finding an element that does not exist', () => {
  it('should throw an error', async () => {
    await browser.get('index.html');
    element(by.binding('INVALID'));  // greeting
  });
});
