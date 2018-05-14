import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Genre, ResponseGenre} from './movie/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }
  getAllGenres(): Observable<ResponseGenre> {
    return this.http.get<ResponseGenre>('https://api.themoviedb.org/3/genre/movie/list?' + this.getApiKeyParam());
  }
  getApiKeyParam(): string{
    return 'api_key=ebbc2e84db90a6c822906cb5f45b655d';
  }
}
