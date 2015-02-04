SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

if [ $JOB = "smoke" ]; then
  node bin/protractor spec/smokeConf.js
elif [ $JOB = "suite" ]; then
  if [[ `node -v` == v0.10.* ]]; then
    node bin/protractor spec/ciConf.js
  fi
else
  echo "Unknown job type. Please set JOB=smoke or JOB=suite"
fi
