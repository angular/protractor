#!/bin/sh

#Check that directory is clean
cd "$( dirname "${BASH_SOURCE[0]}" )/../website"
if [ $(git status --porcelain | wc -l) != "0" ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "We cannot push the generated docs unless the working directory is" 1>&2
  echo "clean.  Either commit your changes, stash them, or generate the" 1>&2
  echo "docs manually by running gulp in /website/ and push them to" 1>&2
  echo "gh-pages at a later date" 1>&2
  echo -e "\033[0m" 1>&2 # Normal color
  exit 1
fi

#Generate files
npm run build
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Build failed. Try running 'npm install' in /website/." 1>&2
  echo -e "\033[0m" 1>&2 # Normal Color
  exit 1
fi

#Transfer files to gh-pages
cd ".."
EXEC_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git branch -D gh-pages
git branch gh-pages
git checkout gh-pages
git pull https://github.com/angular/protractor.git gh-pages:gh-pages -f
git reset --hard
cp -r website/build/* .
git add -A
git commit -m "chore(website): automatic docs update"
echo
echo -e "\tCreated update commit in gh-pages branch"
echo
git checkout "${EXEC_BRANCH}"
