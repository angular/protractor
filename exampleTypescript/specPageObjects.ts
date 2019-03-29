// local import of the exported AngularPage class
import {AngularHomepage} from './angularPage';

// The jasmine typings are brought in via DefinitelyTyped ambient typings.
describe('angularjs homepage', () => {
  it('should greet the named user', async () => {
    const angularHomepage = new AngularHomepage();
    await angularHomepage.get();
    await angularHomepage.setName('Julie');
    expect(await angularHomepage.getGreeting()).toEqual('Hello Julie!');
  });
});
