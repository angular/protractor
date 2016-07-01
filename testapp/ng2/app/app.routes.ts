import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AsyncComponent } from './async/async.component';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'async', component: AsyncComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
]
