import * as angular from 'angular';
import { NgModule , Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { downgradeComponent } from '@angular/upgrade/static';

import { ng1module } from './ng1';

@Component({
  selector: 'ng2',
  template: `
    <h2>ng2</h2>
    <button (click)='clickButton()'>Click Count: {{callCount}}</button>
  `
})
export class Ng2Component {
  callCount: number = 0;
  clickButton = () => {
    setTimeout(() => {
      this.callCount++;
    }, 1000);
  };
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
  ],
  declarations: [
    Ng2Component,
  ],
  entryComponents: [
    Ng2Component
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}



  // Register the Angular 2 component with the Angular 1 module.
ng1module.directive(
  'ng2',  // lowerCamel when registering.
  // propagateDigest: false will detach the digest cycle from AngularJS from
  // propagating into the Angular (2+) CD.
  downgradeComponent({component: Ng2Component, propagateDigest: false}));

