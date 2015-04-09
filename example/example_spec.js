function printflow(tag) {
  console.log(tag);
  console.log(protractor.promise.controlFlow().getSchedule());
}

describe('angularjs homepage', function() {
  it('should get each 1', function() {
    browser.get('http://localhost:8081');

    var stuffs = element.all(by.css('.teststuff'));
    expect(stuffs.count()).toBe(2);
    stuffs.each(function(stuff) {
      console.log('In an each');
      expect(stuff.getAttribute('value').then(function(value) {
        console.log('in expect, value = ' + value);
        return value;
      })).toEqual('10');
      stuff.sendKeys(
        protractor.Key.chord(protractor.Key.COMMAND, 'a'),
        protractor.Key.NULL,
        '30').then(function() {
          console.log('After sendKeys');
        });
    }).then(function() {
      console.log('Done with each');
    });
    // printflow('end');
  });

  it('should get each 2', function() {
    console.log('');
    // This fails.
    browser.get('http://localhost:8081');

    var stuffs = element.all(by.css('.rowlike'));
    expect(stuffs.count()).toBe(2);
    stuffs.each(function(stuff) {
      console.log('In an each');
      var input = stuff.element(by.css('.teststuff')); // this is an ElementFinder
      expect(input.getAttribute('value').then(function(value) {
        console.log('in expect, value = ' + value);
        return value;
      })).toEqual('10');
      input.sendKeys(
        protractor.Key.chord(protractor.Key.COMMAND, 'a'),
        protractor.Key.NULL,
        '30').then(function() {
          console.log('After sendKeys');
        });
    }).then(function() {
      console.log('Done with each');
    });
    // printflow('end');
  });



  // it('should greet the named user', function() {
  //   browser.get('http://www.angularjs.org');

  //   element(by.model('yourName')).sendKeys('Julie');

  //   var greeting = element(by.binding('yourName'));

  //   expect(greeting.getText()).toEqual('Hello Julie!');
  // });

  // describe('todo list', function() {
  //   var todoList;

  //   beforeEach(function() {
  //     browser.get('http://www.angularjs.org');

  //     todoList = element.all(by.repeater('todo in todos'));
  //   });

  //   it('should list todos', function() {
  //     expect(todoList.count()).toEqual(2);
  //     expect(todoList.get(1).getText()).toEqual('build an angular app');
  //   });

  //   it('should add a todo', function() {
  //     var addTodo = element(by.model('todoText'));
  //     var addButton = element(by.css('[value="add"]'));

  //     addTodo.sendKeys('write a protractor test');
  //     addButton.click();

  //     expect(todoList.count()).toEqual(3);
  //     expect(todoList.get(2).getText()).toEqual('write a protractor test');
  //   });
  // });
});
