import { Injectable } from '@angular/core';
import {ResponseCast} from './movie/cast';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CastService {

  constructor(private http: HttpClient) { }

  /** return the casts by movie_id**/
  getCastsByMovieId(id): Observable<ResponseCast>{
    return this.http.get<ResponseCast>('https://api.themoviedb.org/3/movie/' + id + '/casts?' + this.getApiKeyParam());
  }

  /** necessary parameter **/
  getApiKeyParam(): string {
    return 'api_key=ebbc2e84db90a6c822906cb5f45b655d';
  }
}
