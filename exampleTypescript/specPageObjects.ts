// local import of the exported AngularPage class
import {AngularHomepage} from './angularPage';

// The jasmine typings are brought in via DefinitelyTyped ambient typings.
describe('angularjs homepage', () => {
  it('should greet the named user', () => {
    let angularHomepage = new AngularHomepage();
    angularHomepage.get();
    angularHomepage.setName('Julie');
    expect(angularHomepage.getGreeting()).toEqual('Hello Julie!');
  });
});
