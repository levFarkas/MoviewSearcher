import {Component, OnInit} from '@angular/core';
import {Movie, Response} from './movie/movie';
import {MovieService} from './movie.service';
import {fromEvent, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './css/animate.css', './css/bootstrap.css', './css/search.css', './css/magnific-popup.css', './css/style.css'],
  providers: [MovieService]
})
export class AppComponent implements OnInit {
  response: Response;
  private searchTerm = new Subject<string>();

  constructor(private movieService: MovieService) { }
  ngOnInit(): void {
    this.searchTerm.pipe(
      debounceTime(5000),
      distinctUntilChanged(),
      switchMap(term => this.movieService.search(term))
    ).subscribe(response => this.response = response);
    
    this.movieService.getLastMovies().subscribe(response => this.response = response);
  }
  search(text: string) {
    this.searchTerm.next(text);
  }
}
