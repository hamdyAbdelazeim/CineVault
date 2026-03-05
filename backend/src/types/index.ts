export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  media_type?: string;
}

export interface TmdbResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TmdbVideo {
  id: string;
  key: string;          // YouTube video ID
  name: string;
  site: string;         // "YouTube" | "Vimeo"
  type: string;         // "Trailer" | "Teaser" | "Clip" | ...
  official: boolean;
  published_at: string;
}

export interface TmdbMovieDetails extends TmdbMovie {
  tagline: string;
  status: string;
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
}
