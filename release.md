Protractor Release Checklist (5.4 edition)
------------------------------------------

This branch is only for releases in the 5.4 series. This is the last version of Protractor that supports the WebDriver control flow, and is only compatible with Selenium version prior to Selenium 4.

If you need to do a release of Protractor 5, follow these steps:

 - Make sure [CircleCI](https://circleci.com/gh/angular/protractor) is passing (this runs `npm test`)

 - Make sure .gitignore and .npmignore are updated with any new files that need to be ignored.

 - Update package.json with a version bump. The only releases from this branch should be bug fixes, so you should only be incrementing the patch version.

 - Update CHANGELOG.md.
   - You can get a list of changes in the correct format by running
     ```
     git log 0.0.J..HEAD --format="- ([%h](https://github.com/angular/protractor/commit/%H)) %n%w(100,2,2)%B" > /tmp/changes.txt
     ```
   - Create a new section in CHANGELOG.md and copy in features (`feat`), big dependency version updates (`deps`), bug fixes (`fix`), and breaking changes. No need to note chores or stylistic changes - the changelog should be primarily useful to someone using Protractor, not developing on it.

   - You won't be adding any breaking changes to the changelog, since breaking changes aren't allowed for Protractor 5! If there's a breaking change, something has gone wrong.

 - Make a commit with the API and package.json changes titled chore(release): version bump and changelog for 0.0.K.

 - Tag the release with `git tag 0.0.K`

 - Push to github

 - Push tags to github (`git push <remote> --tags`)

 - Verify that the changelog and tags look sane on github

 - NPM publish

 - Let people know
   - Have @ProtractorTest tweet about it
