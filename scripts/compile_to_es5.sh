#!/bin/sh
cd "$( dirname "${BASH_SOURCE[0]}" )/.."

# Check number of parameters
if [ "$#" -gt 0 ]; then
  echo "Usage: ./scripts/compile_to_es5.sh"
  exit 1
fi

echo "Compiling down to es5..."
node node_modules/typescript/bin/tsc --target es5 --lib DOM,ES5,ScriptHost,ES6
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Couldn't compile for es5."
  echo -e "\033[0m" 1>&2 # Normal Color
  exit 1
fi

echo -e "\033[0;32m" # Green
echo "Compiled to es5"
echo -e "\033[0m" 1>&2 # Normal Color
