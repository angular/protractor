declare var angular: angular.IAngularStatic;
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule, downgradeComponent } from '@angular/upgrade/static';

import { RootDirective } from './myApp';
import { Ng2Component } from './ng2';
import { Ng1Directive, Ng1Component } from './ng1';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  declarations: [
    Ng2Component,
    Ng1Component,
  ],
  entryComponents: [
    Ng2Component
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}

angular.module('upgradeApp', [])
  .directive('ng1', Ng1Directive)
  .directive('ng2', downgradeComponent({
    component: Ng2Component,
  }) as angular.IDirectiveFactory)
  .directive('myApp', RootDirective);
