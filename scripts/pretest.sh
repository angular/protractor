#!/bin/bash
# When running `npm test`, this script is intended to run during pretest step.

WS=$(pwd)                          # the protractor directory
$WS/bin/webdriver-manager update   # updates the local webdriver manager
$WS/node_modules/.bin/jshint lib spec scripts
cd $WS/website && npm install      # installs dependencies for the website
