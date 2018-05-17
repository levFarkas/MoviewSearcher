import {Component, Input, OnInit} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Movie} from './movie';
import {ActivatedRoute} from '@angular/router';
import {MovieService} from '../movie.service';
import {CastService} from '../cast.service';
import {ResponseCast} from './cast';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css', '../css/style.css', '../css/search.css']
})
export class MovieComponent implements OnInit {
  @Input() movie: Movie;
  responseCast: ResponseCast;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private castService: CastService) {
  }

  ngOnInit() {
    this.getMovie();
  }

  /** init: get details and casts of movie**/
  getMovie(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.movieService.getMovie(id)
      .subscribe(movie => this.movie = movie);
    this.castService.getCastsByMovieId(id)
      .subscribe(cast => this.responseCast = cast);

  }
}
