var _ = require('lodash');
var path = require('path');
var Package = require('dgeni').Package;

var jsDocProcessor = require('dgeni-packages/jsdoc');

// Configure the tags that will be parsed from the jsDoc.
jsDocProcessor.config(function(parseTagsProcessor) {
  var tagDefs = parseTagsProcessor.tagDefinitions;

  // Parse the following annotations.
  tagDefs.push({name: 'alias'});
  tagDefs.push({name: 'augments'});
  tagDefs.push({name: 'deprecated'});
  tagDefs.push({name: 'example'});
  tagDefs.push({name: 'extends'});
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

var myPackage = new Package('myPackage', [
  jsDocProcessor,
  require('dgeni-packages/nunjucks')
]);

// Handle Inline Tags
myPackage.factory(require('./inline_tags/code'))
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
myPackage.processor(require('./processors/tag-fixer'));
myPackage.processor(require('./processors/these-children'));
myPackage.processor(require('./processors/filter-jsdoc'));
myPackage.processor(require('./processors/set-file-name'));
myPackage.processor(require('./processors/transfer-see'));
myPackage.processor(require('./processors/add-links'));
myPackage.processor(require('./processors/add-toc'));

myPackage.config(function(readFilesProcessor, templateFinder, writeFilesProcessor) {

  // Go to the protractor project root.
  readFilesProcessor.basePath = path.resolve(__dirname, '../..');

  readFilesProcessor.sourceFiles = [
    {include: 'lib/**/element.js'},
    {include: 'lib/**/protractor.js'},
    {include: 'lib/**/locators.js'},
    {include: 'lib/**/expectedConditions.js'},
    {include: 'node_modules/selenium-webdriver/lib/**/locators.js'},
    {include: 'node_modules/selenium-webdriver/lib/webdriver/webdriver.js'}
  ];

  // Add a folder to search for our own templates to use when rendering docs
  templateFinder.templateFolders.unshift(path.resolve('docgen/templates'));

  // Specify how to match docs to templates.
  // In this case we just use the same static template for all docs
  templateFinder.templatePatterns.unshift('toc-template.txt');

  // Specify where the writeFilesProcessor will write our generated doc files
  writeFilesProcessor.outputFolder = 'website/docgen/build';
});

module.exports = myPackage;
