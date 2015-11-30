curl -sO https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
unzip BrowserStackLocal-linux-x64.zip -d local
./local/BrowserStackLocal ` echo $BROWSER_STACK_ACCESS_KEY | rev ` &
