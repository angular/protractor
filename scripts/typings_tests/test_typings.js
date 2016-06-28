/**
 * Protractor is generating a custom declaration file (.d.ts) to expose APIs from
 * both selenium-webdriver and Protractor. Because of the unusual setup,
 * the declaration file is being tested to ensure that types are being maintained.
 *
 * Test:
 *   - Files include reference paths to the Protractor's generated typings file.
 *   - Each file is transpiled using:
 *        tsc {fileName}
 *   - Files that follow the type declarations should produce no errors.
 *   - Files that do not follow the type declarations should produce errors.
 *     For error files, it is assumed that the format matches the following:
 *        {fileName}({lineNumber}
 *     and should have an error for each line from starting line using the types
 *     to the ending line of the file.
 */

var spawnSync = require('child_process').spawnSync;
var path = require('path');
var fs = require('fs');

// Suite variables:
var passSuite = true;
var errors = '';

// Test functions:

/**
 * Runs transpile checks against the failed typed file and should show an error
 * for each line from the start to the ending line.
 *
 * @param file The typescript file producing type errors
 * @param start The starting line in the file where the first error occurs
 * @param end The ending line number in which the final error occurs
 */
var testFailures = function(file, start, end) {
  var spawned = spawnSync('node', ['node_modules/typescript/bin/tsc',
      path.resolve('scripts/typings_tests', file)]);
  var output = spawned.output.toString();
  var lines = output.split('\n');
  var pos = 0;

  for (var currentError = start; currentError <= end; currentError++) {
    var line = lines[pos];
    if (line.indexOf(file + '(' + currentError) >= 0) {
      pos++;
      process.stdout.write('\033[32m.\033[0m');
    } else {
      process.stdout.write('\033[31mF\033[0m');
      errors += file + ', line: ' + currentError + ' - ' + line + '\n';
    }
  }
  fs.unlinkSync(path.resolve('scripts/typings_tests', file.replace('.ts', '.js')));
};

/**
 * Runs transpile checks against the passing typed file and should have no errors.
 *
 * @param file The passing typed file using protractor typings
 */
var testPassing = function(file) {
  var spawned = spawnSync('node', ['node_modules/typescript/bin/tsc',
      path.resolve('scripts/typings_tests', file)]);
  var output = spawned.output.toString().replace(/,/g,'').trim();
  if (output !== '') {
    errors += file + ': passing file should not have errors\n';
    process.stdout.write('\033[31mF\033[0m');
    errors += file + ': errors\n';
    errors += output + '\n';
  } else {
    process.stdout.write('\033[32m.\033[0m');
  }
  fs.unlinkSync(path.resolve('scripts/typings_tests', file.replace('.ts', '.js')));
};


// The tests:
testFailures('test_fail_browser.ts', 4, 94);
testFailures('test_fail_by.ts', 5, 209);
testFailures('test_fail_elements.ts', 7, 482);
testFailures('test_fail_expected_conditions.ts', 4, 25);
testPassing('test_pass.ts');

// Test evaluation and exiting:
console.log('\n');
if (errors !== '') {
  passSuite = false;
  console.log('Failures:');
  console.log('\033[31m' + errors + '\033[0m');
}
if (!passSuite) {
  process.exit(1);
}
