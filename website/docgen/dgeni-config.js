var _ = require('lodash');
var path = require('path');
var Package = require('dgeni').Package;

var jsDocPackage = require('dgeni-packages/jsdoc');
var nunjucksPackage = require('dgeni-packages/nunjucks');
var typescriptPackage = require('dgeni-packages/typescript');

// Configure the tags that will be parsed from the jsDoc.
jsDocPackage.config(function(parseTagsProcessor) {
  var tagDefs = parseTagsProcessor.tagDefinitions;

  // Parse the following annotations.
  tagDefs.push({name: 'alias'});
  tagDefs.push({name: 'augments'});
  tagDefs.push({name: 'deprecated'});
  tagDefs.push({name: 'example'});
  tagDefs.push({name: 'extends'});
  tagDefs.push({name: 'external'});
  tagDefs.push({name: 'private'});
  tagDefs.push({name: 'type'});
  tagDefs.push({name: 'view'});
  tagDefs.push({name: 'template'});
  tagDefs.push({name: 'fileoverview'});
  tagDefs.push({name: 'const'});
  tagDefs.push({name: 'throws'});
  tagDefs.push({name: 'typedef'});
  tagDefs.push({name: 'override'});
  tagDefs.push({name: 'implements'});
  tagDefs.push({name: 'final'});

  // The name tag should not be required.
  var nameTag = _.find(tagDefs, {name: 'name'});
  nameTag.required = false;
});

var protractorPackage = new Package('protractorPackage', [
  jsDocPackage,
  nunjucksPackage,
  typescriptPackage
]);

// Handle Inline Tags
protractorPackage.factory(require('./inline_tags/code'))
    .config(function(inlineTagProcessor, codeTagDef) {
      inlineTagProcessor.inlineTagDefinitions.push(codeTagDef);
    });

/*
 * Add a couple of processors to the pipe to do extra parsing and rendering.
 * Note that the order in which these are included is very important.
 *
 * tag-fixer: Get the name of the function, format the @param and @return
 *     annotations to prepare them for rendering.
 * filter-jsdoc: Filter the functions that will not be part of the output
 *     documentation and generate a unique name for the output partial file.
 * transfer-see: Takes the information in @see tags and appends it to the
 *     description
 * add-links: Add links to the source code for protractor.js, locators.js,
 *     and webdriver.js.
 * add-toc: Generates the table of contents.
 */
protractorPackage.processor(require('./processors/tag-fixer'));
protractorPackage.processor(require('./processors/these-children'));
protractorPackage.processor(require('./processors/filter-jsdoc'));
protractorPackage.processor(require('./processors/set-file-name'));
protractorPackage.processor(require('./processors/transfer-see'));
protractorPackage.processor(require('./processors/add-links'));
protractorPackage.processor(require('./processors/filter-promise'));
protractorPackage.processor(require('./processors/add-toc'));

protractorPackage.config(function(readFilesProcessor, templateFinder, writeFilesProcessor) {

  // Go to the protractor project root.
  readFilesProcessor.basePath = path.resolve(__dirname, '../..');

  readFilesProcessor.sourceFiles = [
    {include: 'lib/browser.ts'},
    {include: 'lib/element.ts'},
    {include: 'lib/locators.ts'},
    {include: 'lib/expectedConditions.ts'},
    {include: 'lib/selenium-webdriver/locators.js'},
    {include: 'lib/selenium-webdriver/webdriver.js'},
    {include: 'lib/webdriver-js-extender/index.js'}
  ];

  // Add a folder to search for our own templates to use when rendering docs
  templateFinder.templateFolders.unshift(path.resolve('docgen/templates'));

  // Specify how to match docs to templates.
  // In this case we just use the same static template for all docs
  templateFinder.templatePatterns.unshift('toc-template.txt');

  // Specify where the writeFilesProcessor will write our generated doc files
  writeFilesProcessor.outputFolder = 'website/docgen/build';
});

module.exports = protractorPackage;
