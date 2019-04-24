describe('angularjs homepage', () => {
  it('should greet the named user', async () => {
    await browser.get('http://www.angularjs.org');

    await element(by.model('yourName')).sendKeys('Julie');
    const greeting = element(by.binding('yourName'));
    expect(await greeting.getText()).toEqual('Hello Julie!');
  });

  describe('todo list', () => {
    let todoList;

    beforeEach(async () => {
      await browser.get('http://www.angularjs.org');
      todoList = element.all(by.repeater('todo in todoList.todos'));
    });

    it('should list todos', async () => {
      expect(await todoList.count()).toEqual(2);
      expect(await todoList.get(1).getText()).toEqual('build an AngularJS app');
    });

    it('should add a todo', async () => {
      const addTodo = element(by.model('todoList.todoText'));
      const addButton = element(by.css('[value="add"]'));

      await addTodo.sendKeys('write a protractor test');
      await addButton.click();

      expect(await todoList.count()).toEqual(3);
      expect(await todoList.get(2).getText())
        .toEqual('write a protractor test');
    });
  });
});
