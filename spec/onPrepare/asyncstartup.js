module.exports = async() => {
  browser.params.password = '12345';
  return await new Promise((resolve, _) => {
    setTimeout(resolve, 1000);
  });
}
