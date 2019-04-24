SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`
BROWSER_STACK_ACCESS_KEY=`echo $BROWSER_STACK_ACCESS_KEY | rev`

if [ $JOB = "smoke" ]; then
  node bin/protractor spec/ciSmokeConf.js
elif [ $JOB = "full" ]; then
  node bin/protractor spec/ciFullConf.js
  # if [ $? = "0" ]; then
  #   node bin/protractor spec/ciNg2Conf.js
  # else
  # 	exit 1
  # fi
elif [ $JOB = "bstack" ]; then
  node bin/protractor spec/ciBStackConf.js
else
  echo "Unknown job type. Please set JOB=smoke, JOB=full, or JOB=bstack"
fi
