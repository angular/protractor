import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AsyncComponent } from './async/async.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'async', component: AsyncComponent }
];

export const appRouting = RouterModule.forRoot(routes, { useHash: true });
