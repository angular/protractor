SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

if [ $JOB = "smoke" ]; then
  node bin/protractor spec/ciSmokeConf.js
elif [ $JOB = "full" ]; then
  node bin/protractor spec/ciFullConf.js
else
  echo "Unknown job type. Please set JOB=smoke or JOB=full"
fi
