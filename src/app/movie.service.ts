import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Response} from './movie/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) {}

  getLastMovies(): Observable<Response>{
    return this.http.get<Response>('https://api.themoviedb.org/3/discover/movie?' + this.getApiKeyParam() + this.getQueryParam());
  }

  search(term): Observable<Response>{
    return this.http.get<Response>('https://api.themoviedb.org/3/search/movie?' + this.getApiKeyParam() + '&query=' + encodeURI(term));
  }

  getApiKeyParam(): string{
    return 'api_key=ebbc2e84db90a6c822906cb5f45b655d';
  }
  getQueryParam(): string{
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const part1 = '&primary_release_date.gte=' + year + '-' + (month - 1) + '-' + day;
    const part2 = '&primary_release_date.lte=' +  year + '-' + month + '-' + day;
    return part1 + part2;
  }

}
