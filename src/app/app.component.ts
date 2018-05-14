import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Movie, Response} from './movie/movie';
import {MovieService} from './movie.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {GenreService} from './genre.service';
import {ResponseGenre} from './movie/genre';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './css/animate.css', './css/bootstrap.css', './css/search.css', './css/magnific-popup.css', './css/style.css', './css/genres.css'],
  providers: [MovieService, GenreService]
})
export class AppComponent implements OnInit {
  response: Response;
  responseGenre: ResponseGenre;
  selectedGenre: string;
  searchKeyword: string;
  private searchTerm = new Subject<string>();
  private searchGenre = new Subject<string>();
  constructor(private movieService: MovieService, private genreService: GenreService) { }
  ngOnInit(): void {
    this.searchTerm.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.movieService.search(term, this.selectedGenre))
    ).subscribe(response => {
      if (this.selectedGenre && this.selectedGenre.length > 0) {
        this.response.results = this.response.results.filter(x => x.title.toUpperCase().includes(this.searchKeyword.toUpperCase()));
      } else {
        this.response = response;
      }
    });
    this.searchGenre.pipe(
      distinctUntilChanged(),
      switchMap( term => this.movieService.searchByGenre(term))
    ).subscribe(response => this.response = response);
    this.movieService.getLastMovies().subscribe(response => this.response = response);
    this.genreService.getAllGenres().subscribe(responseGenre => this.responseGenre = responseGenre);
  }
  search(text: string) {
    this.searchKeyword = text;
    this.searchTerm.next(text);
  }
  searchByGenre(text: string) {
    this.selectedGenre = text;
    this.searchGenre.next(text);
  }

}
@Pipe({
  name: 'my-filter',
  pure: false
})
class MyPipe implements PipeTransform{
  transform(list: Movie[], value: string) : Movie[]{
    return list.filter(x => x.title.includes(value));
  }
}
