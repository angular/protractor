if [ $JOB == "bstack" ]; then
  echo "Setting up Browser Stack"
  ./scripts/browserstack_local_setup.sh
else
  echo "Setting up Sauce Labs"
  ./scripts/sauce_connect_setup.sh
  ./scripts/wait_for_browser_provider.sh
fi
