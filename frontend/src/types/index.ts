export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Movie {
  id: number;
  title?: string;
  name?: string;          // TV series title
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

export interface MovieDetails extends Movie {
  tagline: string;
  status: string;
  runtime: number;
  genres: Genre[];
  credits: { cast: CastMember[] };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
}
