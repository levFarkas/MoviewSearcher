import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Response} from './movie/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) {}

  getLastMovies(page): Observable<Response>{
    return this.http.get<Response>('https://api.themoviedb.org/3/discover/movie?' + this.getApiKeyParam() + this.getQueryParam() + this.getPageParam(page));
  }

  nextPage(genre_id, similar_id, page): Observable<Response>{
    if (genre_id && genre_id.length > 0){
      return this.searchByGenre(genre_id, page);
    }
    if (similar_id && similar_id.length > 0){
      return this.getSimilarities(similar_id, page);
    }
    return this.getLastMovies(page)
  }

  search(term, genre_id, page): Observable<Response> {
    if (term && term.length > 0) {
      return this.http.get<Response>('https://api.themoviedb.org/3/search/movie?' + this.getApiKeyParam() + '&query=' + encodeURI(term));
    }
    if (genre_id && genre_id.length > 0) {
      return this.searchByGenre(genre_id, page);
    }
    return this.getLastMovies(page);
  }

  searchByGenre(genre_id, page): Observable<Response> {
    if (genre_id && genre_id.length > 0){
      return this.http.get<Response>('https://api.themoviedb.org/3/discover/movie?' + this.getApiKeyParam() + this.getGenreParam(genre_id) + this.getPageParam(page));
    }
    return this.getLastMovies(page);
  }

  getSimilarities(movie_id, page): Observable<Response> {
    return this.http.get<Response>('https://api.themoviedb.org/3/movie/' + movie_id + '/similar?' + this.getApiKeyParam() + this.getPageParam(page));
  }
  getApiKeyParam(): string {
    return 'api_key=ebbc2e84db90a6c822906cb5f45b655d';
  }
  getQueryParam(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const part1 = '&primary_release_date.gte=' + year + '-' + (month - 1) + '-' + day;
    const part2 = '&primary_release_date.lte=' +  year + '-' + month + '-' + day;
    return part1 + part2;
  }

  getGenreParam(genre_id): string {
    return '&with_genres=' + genre_id;
  }
  getKeyWordParam(keyword): string {
    return '&with_keywords=' + keyword;
  }
  getPageParam(page){
    return '&page=' + page;
  }

}
