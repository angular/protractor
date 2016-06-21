import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AsyncComponent } from './async/async.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [ ROUTER_DIRECTIVES ]
})
export class AppComponent {

}
