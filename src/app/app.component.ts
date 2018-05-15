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
export class AppComponent implements OnInit {
  response: Response;
  responseCopy: Response;
  responseGenre: ResponseGenre;
  selectedGenre: string;
  searchKeyword: string;
  similarId: string;
  actualPage: number = 1;
  private searchTerm = new Subject<string>();
  private searchGenre = new Subject<string>();
  private searchSimilar = new Subject<string>();
  private nextPage = new Subject<number>();

  constructor(private movieService: MovieService, private genreService: GenreService) { }
  ngOnInit(): void {
    this.searchTerm.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.movieService.search(term, this.selectedGenre, this.actualPage))
    ).subscribe(response => {
      if (this.selectedGenre && this.selectedGenre.length > 0) {
        this.response.results = this.responseCopy.results.filter(x => x.title.toUpperCase().includes(this.searchKeyword.toUpperCase()));
      } else {
        this.response = response;
      }
    });
    this.searchGenre.pipe(
      distinctUntilChanged(),
      switchMap( term => this.movieService.searchByGenre(term, this.actualPage))
    ).subscribe(response => {
      this.response = response;
      this.responseCopy = Object.assign({}, response);
    });
    this.searchSimilar.pipe(
      distinctUntilChanged(),
      switchMap( term => this.movieService.getSimilarities(term, this.actualPage))
    ).subscribe(response => {
      this.response = response;
      this.responseCopy = Object.assign({}, response);
    });

    this.nextPage.pipe(
      switchMap(x => this.movieService.nextPage(this.selectedGenre, this.similarId, x))
    ).subscribe(response => this.response = response);

    this.movieService.getLastMovies(this.actualPage).subscribe(response => {
      this.response = response;
      this.responseCopy = Object.assign({}, response)
    });
    this.genreService.getAllGenres().subscribe(responseGenre => this.responseGenre = responseGenre);

  }
  search(text: string) {
    this.actualPage = 1;
    this.searchKeyword = text;
    this.searchTerm.next(text);
    this.similarId = null;
  }
  searchByGenre(text: string) {
    this.actualPage = 1;
    this.selectedGenre = text;
    this.searchGenre.next(text);
    this.similarId = null;
  }
  searchSimilarities(text: string) {
    this.actualPage = 1;
    this.similarId = text;
    this.searchSimilar.next(text);
    this.selectedGenre = null;
  }
  pagingToNext(): void {
    if (this.actualPage < this.response.total_pages){
      this.actualPage++;
      this.nextPage.next(this.actualPage);
    }
  }
  pagingToPrevious(): void {
    if (this.actualPage > 1){
      this.actualPage--;
      this.nextPage.next(this.actualPage);
    }
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
