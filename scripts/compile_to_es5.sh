#!/bin/sh
cd "$( dirname "${BASH_SOURCE[0]}" )/.."

# Check number of parameters
if [ "$#" -gt 0 ]; then
  echo "Usage: ./scripts/compile_to_es5.sh"
  exit 1
fi

echo "Getting types for es6 promises..."
npm install @types/es6-promise
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Couldn't get types for es6 promises."
  echo -e "\033[0m" 1>&2 # Normal Color
  exit 1
fi

echo "Compiling down to es5..."
node node_modules/typescript/bin/tsc --target es5
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Couldn't compile for es5."
  echo -e "\033[0m" 1>&2 # Normal Color
  npm remove @types/es6-promise
  exit 1
fi

echo "Uninstalling types for es6 promises..."
npm remove @types/es6-promise
if [ $? -ne 0 ]; then
  echo -e "\033[0;33m" 1>&2 # Yellow
  echo "Warning: couldn't uninstall types for es6 promises"
  echo -e "\033[0m" 1>&2 # Normal Color
fi

echo -e "\033[0;32m" # Green
echo "Compiled to es5"
echo -e "\033[0m" 1>&2 # Normal Color
