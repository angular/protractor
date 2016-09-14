import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { appRouting } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AsyncComponent } from './async/async.component';

@NgModule({
  imports: [
    BrowserModule,
    appRouting
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AsyncComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
