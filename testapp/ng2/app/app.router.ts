import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeComponent} from './home/home.component';
import {AsyncComponent} from './async/async.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app-router.html',
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path:'/', name: 'Home', component: HomeComponent},
  {path:'/async', name: 'Async', component: AsyncComponent},
])
export class AppRouter {
}
