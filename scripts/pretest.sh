#!/bin/bash
# When running `npm test`, this script is intended to run during pretest step.

bin/webdriver-manager update   # updates the local webdriver manager
node_modules/.bin/jshint lib spec scripts
