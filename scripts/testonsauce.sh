SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

if [ $JOB = "smoke" ]; then
  node bin/protractor spec/smokeConf.js
elif [ $JOB = "suite" ]; then
  node bin/protractor spec/ciConf.js
  if [ $? == 0 ]; then
    website/run-tests.js
  fi
else
  echo "Unknown job type. Please set JOB=smoke or JOB=suite"
  exit 1
fi
