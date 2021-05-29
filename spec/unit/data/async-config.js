exports.config = Promise.resolve({
  onPrepare: 'foo/bar.js',
  specs: ['fakespec[AB].js'],
  rootElement: '.mycontainer'
});
