if [ $JOB == "bstack" ]; then
  ./scripts/browserstack_local_setup.sh
else
  ./scripts/sauce_connect_setup.sh
  ./scripts/wait_for_browser_provider.sh
fi
