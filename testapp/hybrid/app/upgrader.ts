import { UpgradeAdapter } from '@angular/upgrade';
import { BrowserModule } from '@angular/platform-browser';
import { forwardRef, NgModule } from '@angular/core';

export const adapter: UpgradeAdapter = new UpgradeAdapter(forwardRef(() => Ng2Module));

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
  ],

})
export class Ng2Module {}
