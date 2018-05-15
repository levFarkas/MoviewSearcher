export class Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export class Response  {
  results: Movie[];
  total_pages: number;
}
