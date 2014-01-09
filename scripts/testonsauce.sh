SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

node bin/protractor spec/basicConf.js --seleniumAddress='' --sauceUser=$SAUCE_USERNAME --sauceKey=$SAUCE_ACCESS_KEY --capabilities.tunnel-identifier=$TRAVIS_JOB_NUMBER --capabilities.build=$TRAVIS_BUILD_NUMBER
