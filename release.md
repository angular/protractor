Protractor Release Checklist
----------------------------

Say the previous release was 0.0.J, the current release is 0.0.K, and the next release will be 0.0.L.

 - Check that features and bug fixes are in by looking at the milestone tag for 0.0.K. Create a milestone for 0.0.L, and bump anything that doesn't need to be finished from 0.0.K to 0.0.L.

 - Check if there are new versions of selenium, chromedriver, or latest browsers that the configuration needs to be updated against.

 - Make sure [Travis](https://travis-ci.org/angular/protractor/builds) is passing

 - Make sure `npm test` is passing (this runs more that just what is run on Travis)

 - Make sure .gitignore and .npmignore are updated with any new files that need to be ignored.

 - Generate new API documentation. Run `scripts/generate-docs.js`

 - Update package.json with a version bump. If the changes are only bug fixes, increment the patch (e.g. 0.0.5 -> 0.0.6), otherwise increment the minor version.

 - Update CHANGELOG.md.
   - You can get a list of changes in the correct format by running
     ```
     git log 0.0.J..HEAD --format="- ([%h](https://github.com/angular/protractor/commit/%H)) %n%w(100,2,2)%B" > /tmp/changes.txt
     ```

   - Create a new section in CHANGELOG.md and copy in features, bug fixes, and breaking changes. No need to note chores or stylistic changes - the changelog should be primarily useful to someone using Protractor, not developing on it.

   - Breaking changes should be in their own section and include before/after examples of how to fix code that needs to change.

 - Make a commit with the API and package.json changes titled chore(release): version bump and changelog for 0.0.K.

 - Tag the release with `git tag 0.0.K`

 - Push to github

 - Push tags to github (`git push upstream --tags`)

 - Verify that the changelog and tags look sane on github

 - NPM publish

 - Let people know
   - Have @ProtractorTest tweet about it

 - Close the 0.0.K milestone
