/**
 *  A PageObject for the bindings page.
 */

var bindings = function () {

  /**
   *  Load the bindings page.
   */
  this.load = function () {
    browser.get('index.html#/bindings');
  };

  /**
   *  Get planet info
   *  @returns {object} a promise.
   */
  this.getPlanetInfo = function () {
    return element(by.css('.planet-info')).getText();
  };

  /**
   *  Get the select element.
   *  Returns a Select object which encapsulates the select element
   */
  this.getSelect = function () {
    return new Select(element(by.css('select')));
  };

  /**
   *  Get the info element.
   *  Returns an Info object which encapsulates the info element
   */
  this.getInfo = function () {
    return new Info(browser.findElement(by.css('.planet-info')));
  };

  /**
   *  Get all select options.
   *  @returns {object} a promise.
   */
  this.getOptions = function () {
    return element.all(by.css('option'));
  };

  /**
   *  Get a planet.
   *  Found via findElement.
   *  @returns {object} a promise.
   */
  this.getPlanet = function () {
    return browser.findElement(by.binding('planet.name'));
  };

  /**
   *  Get all planets.
   *  Found via findElements.
   *  @returns {object} a promise.
   */
  this.getPlanets = function () {
    return browser.findElements(by.binding('planet.name'));
  };

  /**
   *  Get an option with a particular value.
   *  Found via findElement.
   *  @param {string} the value.
   *  @returns {object} a promise.
   */
  this.getOption = function (value) {
    var optionString = getOptionString(value);
    return browser.findElement(by.css(optionString));
  };

  /**
   *  Get all options with a particular value.
   *  Found via findElements.
   *  @param {string} the value.
   *  @returns {object} a promise.
   */
  this.getOptionsWithValue = function (value) {
    var optionString = getOptionString(value);
    return browser.findElements(by.css(optionString));
  };

  /**
   *  Get a planet.
   *  Found with global element.
   *  @returns {object} a promise.
   */
  this.getPlanetWithGlobalElement = function () {
    return element(by.binding('planet.name')).find();
  };

  /**
   *  Get an option having a particular value.
   *  Found with global element.
   *  @param {string} the value.
   *  @returns {object} a promise.
   */
  this.getOptionWithGlobalElement = function (value) {
    var optionString = getOptionString(value);
    return element(by.css(optionString)).find();
  };

  /*
   *  Get all planets.
   *  Found with global element.
   *  @returns {object} a promise.
   */
  this.getPlanetsWithGlobalElement = function () {
    return element.all(by.binding('planet.name'));
  };

  /**
   *  Get all option having a particular value.
   *  Found with global element.
   *  @returns {object} a promise.
   */
  this.getOptionsWithValueWithGlobalElement = function (value) {
    var optionString = getOptionString(value);
    return element.all(by.css(optionString));
  };

  return this;

};

/**
 *  Like PageObjects, but within a page.
 *  Select encapsulates the select element.
 *  Info encapsulates the planet info element.
 */

var Select = function (selectElement) {

  this.selectElement = selectElement;

  /**
   *  Get an option with a particular value.
   *  Found using findElement.
   *  @param {string} the value.
   *  @returns {object} a promise.
   */
  this.getOption = function (value) {
    var optionString = getOptionString(value);
    return this.selectElement.findElement(by.css(optionString)).getText()
  };

  /**
   *  Get all options.
   *  Found using findElements.
   *  @returns {object} a promise.
   */
  this.getOptions = function () {
    return this.selectElement.findElements(by.css('option'));
  };

  /**
   *  Get the underlying element.
   *  @returns {object} ElementFinder.
   */
  this.getElement = function () {
    return this.selectElement;
  };

};

var Info = function (infoElement) {

  this.info = infoElement;

  /**
   *  Get a planet name
   *  Found using findElement.
   *  @returns {object} a promise.
   */
  this.getPlanetName = function () {
    return this.info.findElement(by.binding('planet.name'));
  };

  /**
   *  Get all planet names
   *  Found using findElements.
   *  @returns {object} a promise.
   */
  this.getPlanetNames = function () {
    return this.info.findElements(by.binding('planet.name'));
  };

  /**
   *  Get a last-child element.
   *  Found using findElement.
   *  @returns {object} a promise.
   */
  this.getLastChild = function () {
    return this.info.findElement(by.css('div:last-child'));
  };

  /**
   *  Get all last-child elements.
   *  Found using findElement.
   *  @returns {object} a promise.
   */
  this.getLastChildren = function () {
    return this.info.findElements(by.css('div:last-child'));
  };

};

/**
 *  Helper methods
 */

var getOptionString = function (value) {
  return 'option[value="' + value + '"]';
};

module.exports = bindings;
