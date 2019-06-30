#!/bin/sh
cd "$( dirname "${BASH_SOURCE[0]}" )/.."

# Check number of parameters
if [ "$#" -gt 1 ]; then
  echo "Usage: ./scripts/generate-docs.sh [commit_ref]"
  exit 1
fi

# Check that directory is clean
if [ $(git status --porcelain | wc -l) != "0" ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "We cannot push the generated docs unless the working directory is" 1>&2
  echo "clean.  Either commit your changes, stash them, or generate the" 1>&2
  echo "docs manually by running gulp in /website/ and push them to" 1>&2
  echo "gh-pages at a later date." 1>&2
  echo -e "\033[0m" 1>&2 # Normal color
  exit 1
fi

# If a commit ref is passed as a command line option, use that.
# Otherwise, default to the tag corresponding to the version in package.json.
if [ "$#" -eq 0 ]; then
  VERSION=$(node scripts/get-version.js)
else
  VERSION=$1
fi
EXEC_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Switching to ${VERSION}..."
git checkout "${VERSION}"
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  if [ "$#" -eq 0 ]; then
    echo "The package.json file indicates that the current version is" 1>&2
    echo "\"${VERSION}\", but there is no corresponding git tag." 1>&2
  else
    echo "Cannot checkout \"${VERSION}\"." 1>&2
  fi
  echo -e "\033[0m" 1>&2 # Normal Color
  git checkout "${EXEC_BRANCH}"
  exit 1
fi

echo "Removing temp files..."
git clean -fxd
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Could not remove untracked/ignored files."
  echo -e "\033[0m" 1>&2 # Normal Color
  git checkout "${EXEC_BRANCH}"
  exit 1
fi

echo "Main \`npm install\`..."
npm install
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "\`npm install\` failed."
  echo -e "\033[0m" 1>&2 # Normal Color
  git checkout "${EXEC_BRANCH}"
  exit 1
fi

# Compile to es5
./scripts/compile_to_es5.sh
if [ $? -ne 0 ]; then
  git checkout "${EXEC_BRANCH}"
  exit 1
fi

echo "Installing the testapp..."
npm run install_testapp
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Couldn't install testapp."
  echo -e "\033[0m" 1>&2 # Normal Color
  git checkout "${EXEC_BRANCH}"
  exit 1
fi

echo "Installing the website..."
cd website
npm install
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Failed to install website dependencies."
  echo -e "\033[0m" 1>&2 # Normal Color
  git checkout "${EXEC_BRANCH}"
  exit 1
fi


echo "Building the website..."
npm run build
if [ $? -ne 0 ]; then
  echo -e "\033[0;31m" 1>&2 # Red
  echo "Website build failed."
  echo -e "\033[0m" 1>&2 # Normal Color
  git checkout "${EXEC_BRANCH}"
  exit 1
fi

echo "Transfering files to gh-pages..."
cd ".."
git branch -D gh-pages
git pull -f https://github.com/angular/protractor.git gh-pages:gh-pages
git reset --hard
git checkout gh-pages
cp -r website/build/* .
git add -A
git commit -m "chore(website): automatic docs update for ${VERSION}"
echo -e "\033[0;32m" # Green
echo "Created update commit in gh-pages branch."
echo -e "\033[0m" 1>&2 # Normal Color
git checkout "${EXEC_BRANCH}"
