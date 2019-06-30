describe('locators', () => {
  beforeEach(async() => {
    await browser.get('index.html#/form');
  });

  describe('by binding', () => {
    it('should find an element by binding', async() => {
      const greeting = element(by.binding('greeting'));

      expect(await greeting.getText()).toEqual('Hiya');
    });

    it('should find a binding by partial match', async() => {
      const greeting = element(by.binding('greet'));

      expect(await greeting.getText()).toEqual('Hiya');
    });

    it('should find exact match by exactBinding', async() => {
      const greeting = element(by.exactBinding('greeting'));

      expect(await greeting.getText()).toEqual('Hiya');
    });

    it('should not find partial match by exactBinding', async() => {
      const greeting = element(by.exactBinding('greet'));

      expect(await greeting.isPresent()).toBe(false);
    });

    it('should find an element by binding with ng-bind attribute',
        async() => {
      const name = element(by.binding('username'));

      expect(await name.getText()).toEqual('Anon');
    });

    it('should find an element by binding with ng-bind-template attribute',
        async() => {
      const name = element(by.binding('nickname|uppercase'));

      expect(await name.getText()).toEqual('(ANNIE)');
    });
  });

  describe('by model', () => {
    it('should find an element by text input model', async() => {
      const username = element(by.model('username'));
      const name = element(by.binding('username'));

      await username.clear();
      expect(await name.getText()).toEqual('');

      await username.sendKeys('Jane Doe');
      expect(await name.getText()).toEqual('Jane Doe');
    });

    it('should find an element by checkbox input model', async() => {
      expect(await element(by.id('shower')).isDisplayed()).toBe(true);

      await element(by.model('show')).click();  // colors

      expect(await element(by.id('shower')).isDisplayed()).toBe(false);
    });

    it('should find a textarea by model', async() => {
      const about = element(by.model('aboutbox'));
      expect(await about.getAttribute('value')).toEqual('This is a text box');

      await about.clear();
      await about.sendKeys('Something else to write about');

      expect(await about.getAttribute('value'))
          .toEqual('Something else to write about');
    });

    it('should find multiple selects by model', async() => {
      const selects = element.all(by.model('dayColor.color'));
      expect(await selects.count()).toEqual(3);
    });

    it('should find the selected option', async() => {
      const select = element(by.model('fruit'));
      const selectedOption = select.element(by.css('option:checked'));
      expect(await selectedOption.getText()).toEqual('apple');
    });

    it('should find inputs with alternate attribute forms', async() => {
      const letterList = element(by.id('letterlist'));
      expect(await letterList.getText()).toBe('');

      await element(by.model('check.w')).click();
      expect(await letterList.getText()).toBe('w');

      await element(by.model('check.x')).click();
      expect(await letterList.getText()).toBe('wx');
    });

    it('should find multiple inputs', async() => {
      const arr = await element.all(by.model('color'));
      expect(arr.length).toEqual(3);
    });

    it('should clear text from an input model', async() => {
      const username = element(by.model('username'));
      const name = element(by.binding('username'));

      await username.clear();
      expect(await name.getText()).toEqual('');

      await username.sendKeys('Jane Doe');
      expect(await name.getText()).toEqual('Jane Doe');

      await username.clear();
      expect(await name.getText()).toEqual('');
    });
  });

  describe('by partial button text', () => {
    it('should find multiple buttons containing "text"', async() => {
      const arr = await element.all(by.partialButtonText('text'));
      expect(arr.length).toEqual(4);
      expect(await arr[0].getAttribute('id')).toBe('exacttext');
      expect(await arr[1].getAttribute('id')).toBe('otherbutton');
      expect(await arr[2].getAttribute('id')).toBe('submitbutton');
      expect(await arr[3].getAttribute('id')).toBe('inputbutton');
    });
  });

  describe('by button text', () => {
    it('should find two button containing "Exact text"', async() => {
      const arr = await element.all(by.buttonText('Exact text'));
      expect(arr.length).toEqual(2);
      expect(await arr[0].getAttribute('id')).toBe('exacttext');
      expect(await arr[1].getAttribute('id')).toBe('submitbutton');
    });

    it('should not find any buttons containing "text"', async() => {
      const arr = await element.all(by.buttonText('text'));
      expect(arr.length).toEqual(0);
    });

  });

  describe('by repeater', () => {
    beforeEach(async() => {
      await browser.get('index.html#/repeater');
    });

    it('should find by partial match', async() => {
      const fullMatch = element(by.repeater('baz in days | filter:\'T\'')
          .row(0).column('baz.initial'));
      expect(await fullMatch.getText()).toEqual('T');

      const partialMatch = element(by.repeater('baz in days')
          .row(0).column('b'));
      expect(await partialMatch.getText()).toEqual('T');

      const partialRowMatch = element(by.repeater('baz in days').row(0));
      expect(await partialRowMatch.getText()).toEqual('T');
    });

    it('should return all rows when unmodified', async() => {
      const arr = await element.all(by.repeater('allinfo in days'));
      expect(arr.length).toEqual(5);
      expect(await arr[0].getText()).toEqual('M Monday');
      expect(await arr[1].getText()).toEqual('T Tuesday');
      expect(await arr[2].getText()).toEqual('W Wednesday');
    });

    it('should return a single column', async() => {
      const initial = await element.all(
          by.repeater('allinfo in days').column('initial'));
      
      expect(initial.length).toEqual(5);
      expect(await initial[0].getText()).toEqual('M');
      expect(await initial[1].getText()).toEqual('T');
      expect(await initial[2].getText()).toEqual('W');

      const names = await element.all(
          by.repeater('allinfo in days').column('name'));

      expect(names.length).toEqual(5);
      expect(await names[0].getText()).toEqual('Monday');
      expect(await names[1].getText()).toEqual('Tuesday');
      expect(await names[2].getText()).toEqual('Wednesday');
    });

    it('should allow chaining while returning a single column', async() => {
      const secondName = element(by.css('.allinfo')).element(
        by.repeater('allinfo in days').column('name').row(2));
      expect(await secondName.getText()).toEqual('Wednesday');
    });

    it('should return a single row', async() => {
      const secondRow = element(by.repeater('allinfo in days').row(1));
      expect(await secondRow.getText()).toEqual('T Tuesday');
    });

    it('should return an individual cell', async() => {
      const secondNameByRowFirst = element(by.repeater('allinfo in days')
          .row(1).column('name'));

      const secondNameByColumnFirst = element(by.repeater('allinfo in days')
          .column('name').row(1));

      expect(await secondNameByRowFirst.getText()).toEqual('Tuesday');
      expect(await secondNameByColumnFirst.getText()).toEqual('Tuesday');
    });

    it('should find a using data-ng-repeat', async() => {
      const byRow = element(by.repeater('day in days').row(2));
      expect(await byRow.getText()).toEqual('W');

      const byCol = element(by.repeater('day in days').row(2).column('day'));
      expect(await byCol.getText()).toEqual('W');
    });

    it('should find using ng:repeat', async() => {
      const byRow = element(by.repeater('bar in days').row(2));
      expect(await byRow.getText()).toEqual('W');

      const byCol = element(by.repeater('bar in days').row(2).column('bar'));
      expect(await byCol.getText()).toEqual('W');
    });

    it('should determine if repeater elements are present', async() => {
      expect(await element(by.repeater('allinfo in days').row(3)).isPresent())
          .toBe(true);
      // There are only 5 rows, so the 6th row is not present.
      expect(await element(by.repeater('allinfo in days').row(5)).isPresent())
          .toBe(false);
    });

    it('should have by.exactRepeater working', async() => {
      expect(await element(by.exactRepeater('day in d')).isPresent())
          .toBe(false);
      expect(await element(by.exactRepeater('day in days')).isPresent())
          .toBe(true);

      // Full ng-repeat: baz in tDays = (days | filter:'T')
      const repeaterWithEqualSign = element(by.exactRepeater('baz in tDays')
          .row(0));
      expect(await repeaterWithEqualSign.getText()).toEqual('T');

      // Full ng-repeat: baz in days | filter:'T'
      const repeaterWithPipe = element(by.exactRepeater('baz in days').row(0));
      expect(await repeaterWithPipe.getText()).toEqual('T');
    });

    describe('repeaters using ng-repeat-start and ng-repeat-end', () => {
      it('should return all elements when unmodified', async() => {
        const all = await element.all(by.repeater('bloop in days'));

        expect(all.length).toEqual(3 * 5);
        expect(await all[0].getText()).toEqual('M');
        expect(await all[1].getText()).toEqual('-');
        expect(await all[2].getText()).toEqual('Monday');
        expect(await all[3].getText()).toEqual('T');
        expect(await all[4].getText()).toEqual('-');
        expect(await all[5].getText()).toEqual('Tuesday');
      });

      it('should return a group of elements for a row', async() => {
        const firstRow = await element.all(by.repeater('bloop in days').row(0));

        expect(firstRow.length).toEqual(3);
        expect(await firstRow[0].getText()).toEqual('M');
        expect(await firstRow[1].getText()).toEqual('-');
        expect(await firstRow[2].getText()).toEqual('Monday');
      });

      it('should return a group of elements for a column', async() => {
        const nameColumn = await element.all(
          by.repeater('bloop in days').column('name'));

        expect(nameColumn.length).toEqual(5);
        expect(await nameColumn[0].getText()).toEqual('Monday');
        expect(await nameColumn[1].getText()).toEqual('Tuesday');
      });

      it('should find an individual element', async() => {
        const firstInitial = element(
          by.repeater('bloop in days').row(0).column('bloop.initial'));

        expect(await firstInitial.getText()).toEqual('M');
      });
    });
  });

  describe('by css containing text', () => {
    it('should find elements by css and partial text', async() => {
      const arr = await element.all(
          by.cssContainingText('#animals ul .pet', 'dog'))
      expect(arr.length).toEqual(2);
      expect(await arr[0].getAttribute('id')).toBe('bigdog');
      expect(await arr[1].getAttribute('id')).toBe('smalldog');
    });

    it('should find elements with text-transform style', async() => {
      expect(await element(by.cssContainingText('#transformedtext div',
          'Uppercase')).getAttribute('id')).toBe('textuppercase');
      expect(await element(by.cssContainingText('#transformedtext div',
          'Lowercase')).getAttribute('id')).toBe('textlowercase');
      expect(await element(by.cssContainingText('#transformedtext div',
          'capitalize')).getAttribute('id')).toBe('textcapitalize');
    });

    it('should find elements with a regex', async() => {
      const found = await element.all(by.cssContainingText(
          '#transformedtext div', /(upper|lower)case/i));
        
      expect(found.length).toEqual(2);
      expect(await found[0].getText()).toBe('UPPERCASE');
      expect(await found[1].getText()).toBe('lowercase');
    });

    it('should find elements with a regex with no flags', async() => {
      // this test matches the non-transformed text.
      // the text is actually transformed with css,
      // so you can't match the Node innerText or textContent.
      const found = await element.all(by.cssContainingText(
          '#transformedtext div', /Uppercase/));

      expect(found.length).toEqual(1);
      expect(await found[0].getText()).toBe('UPPERCASE');
    });
  });

  describe('by options', () => {
    it('should find elements by options', async() => {
      const allOptions = element.all(by.options('fruit for fruit in fruits'));
      expect(await allOptions.count()).toEqual(4);

      const firstOption = allOptions.first();
      expect(await firstOption.getText()).toEqual('apple');
    });
  });

  describe('by deep css', () => {
    beforeEach(async() => {
      await browser.get('index.html#/shadow');
    });

    // Shadow DOM is not currently supported outside of Chrome.
    browser.getCapabilities().then((capabilities) => {
      if (capabilities.get('browserName') == 'chrome') {

        it('should find items inside the shadow DOM', async() => {
          const parentHeading = element(by.deepCss('.parentshadowheading'));
          const olderChildHeading = element(by.deepCss('.oldershadowheading'));
          const youngerChildHeading = element(
              by.deepCss('.youngershadowheading'));

          expect(await parentHeading.isPresent()).toBe(true);
          expect(await olderChildHeading.isPresent()).toBe(true);
          expect(await youngerChildHeading.isPresent()).toBe(true);

          expect(await parentHeading.getText()).toEqual('Parent');
          expect(await olderChildHeading.getText()).toEqual('Older Child');
          expect(await youngerChildHeading.getText()).toEqual('Younger Child');

          expect(await element(by.deepCss('.originalcontent')).getText())
              .toEqual('original content');
        });
      }
    });
  });

  it('should determine if an element is present', async() => {
    expect(await browser.isElementPresent(by.binding('greet'))).toBe(true);
    expect(await browser.isElementPresent(by.binding('nopenopenope')))
        .toBe(false);
  });

  it('should determine if an ElementFinder is present', async() => {
    expect(await browser.isElementPresent(element(by.binding('greet'))))
        .toBe(true);
    expect(await browser.isElementPresent(element(by.binding('nopenopenope'))))
        .toBe(false);
  });
});
