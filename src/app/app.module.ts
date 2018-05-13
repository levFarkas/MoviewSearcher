import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MovieComponent } from './movie/movie.component';
import {MovieService} from './movie.service';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    MovieComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [MovieService],
  bootstrap: [AppComponent]
})

export class AppModule {

}
