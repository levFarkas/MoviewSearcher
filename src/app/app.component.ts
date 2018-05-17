import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Movie, Response} from './movie/movie';
import {MovieService} from './movie.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {GenreService} from './genre.service';
import {ResponseGenre} from './movie/genre';
import {subscribeTo} from 'rxjs/internal-compatibility';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './css/animate.css', './css/bootstrap.css', './css/search.css', './css/magnific-popup.css', './css/style.css', './css/genres.css'],
  providers: [MovieService, GenreService]
})
export class AppComponent{

}
