import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {MovieService} from '../movie.service';
import {Subject} from 'rxjs';
import {GenreService} from '../genre.service';
import {ResponseGenre} from '../movie/genre';
import {Movie, Response} from '../movie/movie';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../css/animate.css', '../css/bootstrap.css', '../css/search.css', '../css/magnific-popup.css', '../css/style.css', '../css/genres.css'],

})
export class DashboardComponent implements OnInit {

  /** Response of moviess**/
  response: Response;

  /** Copy of response of movies to handle filtering**/
  responseCopy: Response;

  /** select genre on UI**/
  selectedGenre: string;

  /** searchtext on UI **/
  searchKeyword: string;

  /** similar to this movie_id **/
  similarId: string;
  actualPage: number = 1;
  private searchTerm = new Subject<string>();
  private searchGenre = new Subject<string>();
  private searchSimilar = new Subject<string>();
  private nextPage = new Subject<number>();

  constructor(private movieService: MovieService, private genreService: GenreService, private route: ActivatedRoute) { }
  ngOnInit(): void {

    /** if parameterized url, then run similarity function **/
    const id = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe((params: Params) => {
      this.movieService.getSimilarities(params['id'], this.actualPage).subscribe(response => this.response = response);
    };
    this.searchTerm.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.movieService.search(term, this.selectedGenre, this.actualPage))
    ).subscribe(response => {

      /** when a genre is already selected then we would only filter on response else search with API **/
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
    if (!(id && id.length > 0)) {
      this.movieService.getLastMovies(this.actualPage).subscribe(response => {
        this.response = response;
        this.responseCopy = Object.assign({}, response)
      });
    }
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
