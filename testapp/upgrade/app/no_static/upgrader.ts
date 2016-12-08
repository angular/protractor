import { UpgradeAdapter } from '@angular/upgrade';
import { BrowserModule } from '@angular/platform-browser';
import { forwardRef, NgModule } from '@angular/core';
import { Ng2Component } from '../ng2'


export const adapter: UpgradeAdapter = new UpgradeAdapter(forwardRef(() => Ng2Module));

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    Ng2Component, adapter.upgradeNg1Component('ng1')
  ],

})
export class Ng2Module {}
