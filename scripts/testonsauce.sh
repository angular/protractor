SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

node bin/protractor spec/ciConf.js
