import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MovieComponent} from './movie/movie.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'movie/:id', component: MovieComponent },
  { path: '', component: DashboardComponent},
  { path: ':id', component: DashboardComponent}
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
  constructor() {}
}
