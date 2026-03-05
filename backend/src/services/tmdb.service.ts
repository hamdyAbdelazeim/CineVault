import { TmdbMovie, TmdbMovieDetails, TmdbResponse, TmdbVideo } from '../types';

const TMDB_BASE = 'https://api.themoviedb.org/3';

/**
 * Internal fetch wrapper that injects the API key and language,
 * then parses the JSON response. All TMDB calls go through this
 * function so the API key is never exposed to the browser.
 */
async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB_API_KEY is not configured');

  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = new Error(`TMDB ${res.status}: ${res.statusText}`) as Error & { statusCode: number };
    err.statusCode = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

export const tmdbService = {
  /** Weekly trending movies. */
  getTrending: () =>
    tmdbFetch<TmdbResponse<TmdbMovie>>('/trending/movie/week'),

  /** Top-rated movies. */
  getTopRated: () =>
    tmdbFetch<TmdbResponse<TmdbMovie>>('/movie/top_rated'),

  /** Movies filtered by TMDB genre ID. */
  getByGenre: (genreId: string) =>
    tmdbFetch<TmdbResponse<TmdbMovie>>('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
    }),

  /** Full movie details including cast credits. */
  getMovieDetails: (id: string) =>
    tmdbFetch<TmdbMovieDetails>(`/movie/${id}`, {
      append_to_response: 'credits',
    }),

  /** Multi-search across movies, TV shows, and people. */
  search: (query: string) =>
    tmdbFetch<TmdbResponse<TmdbMovie>>('/search/multi', { query }),

  /** YouTube trailers and clips for a movie. */
  getMovieVideos: (id: string) =>
    tmdbFetch<{ id: number; results: TmdbVideo[] }>(`/movie/${id}/videos`),
};
