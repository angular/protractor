Protractor website
==================

Generates the documentation for the protractor website.

##How to run

```shell
cd website/
npm install
```

And then copy all the files from the `build` directory to the gh-pages branch.
If you want to run the website locally then run the following command:

```shell
./node_modules/.bin/gulp liveReload
```

And point your browser to: [localhost:8080](http://localhost:8080/)

##How to run the tests

Start the server first

```shell
npm run server
```

Run the tests

```shell
npm test
```
