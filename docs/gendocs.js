var fs = require('fs');
var util = require('util');
var mustache = require('mustache');

// Temporary awful hacky solution. The output should be something much prettier,
// and make clear what is webdriver and what is wrapped. But for now, let's
// get some docs!

var versionHash ='8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a';

var NEW_LINE = /\n\r?/;

var getInfoFromFile = function(filename, link) {
  var infos = [];
  var file = fs.readFileSync(filename, 'utf8');
  var ln = 0,
      inComment = false;
  var lines = file.split(NEW_LINE);
  while (ln < lines.length) {
    if (lines[ln].match(/\/\*\*/)) {
      inComment = true;
      var info = {
        fullName: '',
        name: '',
        description: '',
        lineNumber: null,
        params: [],
        returnValue: undefined,
        link: link + ln,
        filename: filename
      };
      var comment = '';
      while (inComment) {
        var strippedLine = lines[ln].replace(/^\s*\/\*\*/, '');
        strippedLine = strippedLine.replace(/\s*\*\//, '')
        strippedLine = strippedLine.replace(/^\s*\*/, '')
        comment += strippedLine;

        if (lines[ln].match(/\*\//)) {
          // The comment is over. The next line should be the thingy we want
          // info about.
          ln++;
          var objArr = (/\s*([^\s]+)/).exec(lines[ln]);

          info.fullName = objArr ? objArr[1] : null;
          if (info.fullName) {
            var names = info.fullName.split('.');
            info.name = names.length ? names[names.length - 1] : null;
          }
          info.lineNumber = ln;
          inComment = false;
        } else {
          ln++;
        }
      }
      comment = comment.replace(/\s+/g, ' ');

      var description = comment;
      var paramRe = /\@param\ \{([^}]+)\}/g;
      var returnRe = /\@return\ \{([^}]+)\}/;
      var myArray;
      while ((arr = paramRe.exec(comment)) !== null) {
        info.params.push({type: arr[1]});
      }
      if ((arr = returnRe.exec(comment)) !== null) {
        info.returnValue = {type: arr[1]};
      }
      info.description = description;
      infos.push(info);
    }
    ln++;
  }

  return infos;
};

// Files we care about:
var files = {
  'wd': __dirname + '/../node_modules/selenium-webdriver/lib/webdriver/webdriver.js',
  'protractor': __dirname + '/../lib/protractor.js',
  'locators': __dirname + '/../lib/locators.js'
};

var docInfo;

var wdInfo = getInfoFromFile(files['wd'], 'https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#');
var protractorInfo = getInfoFromFile(files['protractor'], 'https://github.com/angular/protractor/blob/' + versionHash + '/lib/protractor.js#L');
var locatorInfo = getInfoFromFile(files['locators'], 'https://github.com/angular/protractor/blob/' + versionHash + '/lib/locators.js#L');

var model = {
  versionHash: versionHash,
  baseInfos: [],
  locatorInfos: [],
  elementInfos: []
};

// Pre-fill the badly documentated other locator webdriver info.

model.locatorInfos = [
{ name: 'id'
}, { name: 'css'
}, { name: 'xpath'
}, { name: 'name'
}, { name: 'tagName'
}, { name: 'className'
}, { name: 'linkText'
}, { name: 'partialLinkText'
}, { name: 'js'
}
];

var names = {};

for (var i = 0; i < wdInfo.length; ++i) {
  var info = wdInfo[i];
  if (!info.fullName) {
    continue;
  }
  if (info.fullName.match(/WebDriver\.prototype/)) {
    names[info.name] = info;
    model.baseInfos.push(info);
    info.wd = {link: info.link};
  }

  if (info.fullName.match(/WebElement.prototype/)) {
    names[info.name] = info;
    model.elementInfos.push(info);
    info.wd = {link: info.link};
  }
}

for (var i = 0; i < protractorInfo.length; ++i) {
  var info = protractorInfo[i];
  if (!info.fullName) {
    continue;
  }
  if (info.fullName.match(/Protractor\.prototype/)) {
    if (names[info.name]) {
      var overridden = names[info.name];
      overridden.p = {link: info.link};
    } else {
      names[info.name] = info;
      model.baseInfos.push(info);
      info.p = {link: info.link};
    }
  }
  if (info.fullName.match(/element\./)) {
    if (names[info.name]) {
      var overridden = names[info.name];
      overridden.p = {link: info.link};
    } else {
      names[info.name] = info;
      model.elementInfos.push(info);
      info.p = {link: info.link};
    }
  }
}

for (var i = 0; i < locatorInfo.length; ++i) {
  var info = locatorInfo[i];
  if (!info.fullName) {
    continue;
  }
  if (info.fullName.match(/ProtractorBy\.prototype/)) {
    model.locatorInfos.push(info);
    info.p = {link: info.link};
  }
}

var out = mustache.render(
    fs.readFileSync(__dirname + '/apitemplate.mustache', 'utf8'),
    model);

fs.writeFileSync(__dirname + '/api.md', out);
