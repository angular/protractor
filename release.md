Protractor Release Checklist
----------------------------

Say the previous release was 0.0.J, the current release is 0.0.K, and the next release will be 0.0.L.

 - Check that features and bug fixes are in by looking at the milestone tag for 0.0.K. Create a milestone for 0.0.L, and bump anything that doesn't need to be finished from 0.0.K to 0.0.L.

 - Check if there are new versions of [selenium and iedriver](http://selenium-release.storage.googleapis.com/index.html), [chromedriver](http://chromedriver.storage.googleapis.com/index.html), or [latest browsers](https://saucelabs.com/platforms) that the configuration needs to be updated against. We test against the latest two versions of Chrome, Firefox, and IE.

   - The latest selenium version should be used in spec/ciFullConf.js, spec/ciSmokeConf.js, and spec/ciNg2Conf.js.
   - The versions in config.json/webdriverVersions should be up to date, and you should run `webdriver-manager update` locally.
   - The latest version of Chrome and Firefox should be used in spec/ciFullConf.js and spec/ciNg2Conf.js. All other browsers we support should be listed in spec/ciSmokeConf.js.

 - Make sure [Travis](https://travis-ci.org/angular/protractor/builds) is passing. Note that there is an 'allowed failures' section in Travis - make sure that all failures are known.

 - Make sure [CircleCI](https://circleci.com/gh/angular/protractor) is passing (this runs `npm test`)

 - Make sure .gitignore and .npmignore are updated with any new files that need to be ignored.

 - Make sure that the website and doc generation still work.  Doing so now, before you update the package.json or CHANGELOG.md, will save you a big headache.
   - Run `./scripts/generate-docs.sh HEAD` to generate the docs against the current commit.
   - We have to compile down to es5 to get dgeni to work. `generate-docs.sh` can handle some of this but you may have to make minor changes to the codebase/build infrastructure.
   - Run the unit and e2e tests for the website.

 - Update package.json with a version bump. If the changes are only bug fixes, increment the patch (e.g. 0.0.5 -> 0.0.6), otherwise increment the minor version.

 - Update CHANGELOG.md.
   - You can get a list of changes in the correct format by running
     ```
     git log 0.0.J..HEAD --format="- ([%h](https://github.com/angular/protractor/commit/%H)) %n%w(100,2,2)%B" > /tmp/changes.txt
     ```

   - Create a new section in CHANGELOG.md and copy in features (`feat`), big dependency version updates (`deps`), bug fixes (`fix`), and breaking changes. No need to note chores or stylistic changes - the changelog should be primarily useful to someone using Protractor, not developing on it.

   - Breaking changes should be in their own section and include before/after examples of how to fix code that needs to change.

 - Make a commit with the API and package.json changes titled chore(release): version bump and changelog for 0.0.K.

 - Tag the release with `git tag 0.0.K`

 - Push to github

 - Push tags to github (`git push <remote> --tags`)

 - Verify that the changelog and tags look sane on github

 - NPM publish

 - Update the website. Run `./scripts/generate-docs.sh`, then switch to the `gh-pages` branch, edit the commit message with `git commit --amend`, and push the new website.

 - Run e2e test against the published website.

 - Let people know
   - Have @ProtractorTest tweet about it

 - Close the 0.0.K milestone
