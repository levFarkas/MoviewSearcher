import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MovieComponent } from './movie/movie.component';
import {MovieService} from './movie.service';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';
import {RouterModule} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    MovieComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, AppRoutingModule, RouterModule
  ],
  providers: [MovieService],
  bootstrap: [AppComponent]
})

export class AppModule {

}
