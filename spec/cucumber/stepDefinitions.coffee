# Use the external Chai As Promised to deal with resolving promises in
# expectations.
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
chai.use(chaiAsPromised)

expect = chai.expect

g =
  protractor:protractor
  browser:browser
  by:`by`
  element:element
  '$':$

module.exports = ->

  @Given /^I run Cucumber with Protractor$/, (next) ->
    next()

  @Given /^I go on(?: the website)? "([^"]*)"$/, (url, next) ->
    browser.get(url)
    next()

  @Then /^it should still do normal tests$/, (next) ->
    expect(true).to.equal(true)
    next()

  @Then /^it should expose the correct global variables$/, (next) ->
    expect(protractor).to.exist
    expect(browser).to.exist
    expect(`by`).to.exist
    expect(element).to.exist
    expect($).to.exist
    next()


  @Then /^it should expose the correct global variable "([^"]*)"$/, (variable,next) ->
    expect(g[variable]).to.exist
    next()


  @Then /the title should equal "([^"]*)"$/, (text, next) ->
    expect(browser.getTitle()).to.eventually.equal(text).and.notify(next)

