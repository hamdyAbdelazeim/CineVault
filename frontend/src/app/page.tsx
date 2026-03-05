import HeroSection from '@/components/movie/HeroSection';
import MovieRow from '@/components/movie/MovieRow';
import type { Movie } from '@/types';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

// ISR: pages are statically generated and revalidated every hour.
// This gives us edge-cached performance with fresh data.
const ISR_OPTS = { next: { revalidate: 3600 } };

async function fetchMovies(endpoint: string): Promise<Movie[]> {
  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, ISR_OPTS);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

// TMDB genre IDs
const GENRES = {
  ACTION: 28,
  SCIFI: 878,
  COMEDY: 35,
  THRILLER: 53,
} as const;

export default async function HomePage() {
  const [trending, topRated, action, scifi, comedy, thriller] =
    await Promise.all([
      fetchMovies('/api/movies/trending'),
      fetchMovies('/api/movies/top-rated'),
      fetchMovies(`/api/movies/genre/${GENRES.ACTION}`),
      fetchMovies(`/api/movies/genre/${GENRES.SCIFI}`),
      fetchMovies(`/api/movies/genre/${GENRES.COMEDY}`),
      fetchMovies(`/api/movies/genre/${GENRES.THRILLER}`),
    ]);

  const hero = trending[0] ?? null;

  return (
    <main>
      {/* Full-viewport hero */}
      {hero && <HeroSection movie={hero} />}

      {/* Movie rows — negative margin pulls them over the hero gradient */}
      <div className="relative z-10 -mt-16 space-y-10 pb-24">
        <MovieRow title="🔥 Trending This Week" movies={trending} />
        <MovieRow title="⭐ Top Rated" movies={topRated} />
        <MovieRow title="💥 Action" movies={action} />
        <MovieRow title="🚀 Sci-Fi" movies={scifi} />
        <MovieRow title="😂 Comedy" movies={comedy} />
        <MovieRow title="🔪 Thriller" movies={thriller} />
      </div>
    </main>
  );
}
