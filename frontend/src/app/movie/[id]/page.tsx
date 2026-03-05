import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { MovieDetails } from '@/types';
import MovieDetailClient from '@/components/movie/MovieDetailClient';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
const IMG = 'https://image.tmdb.org/t/p';

// ---------------------------------------------------------------------------
// Data Fetcher — Server-side, cached with ISR
// ---------------------------------------------------------------------------
async function getMovie(id: string): Promise<MovieDetails | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/movies/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<MovieDetails>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Dynamic Metadata (SEO)
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) return { title: 'Not Found' };

  const year = new Date(movie.release_date ?? '').getFullYear();
  const posterUrl = movie.poster_path
    ? `${IMG}/w500${movie.poster_path}`
    : undefined;

  return {
    title: `${movie.title ?? movie.name} (${year})`,
    description: movie.overview.slice(0, 155) + '…',
    openGraph: {
      title: movie.title ?? movie.name,
      description: movie.overview,
      type: 'video.movie',
      ...(posterUrl && {
        images: [{ url: posterUrl, width: 500, height: 750, alt: movie.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: movie.title ?? movie.name,
      description: movie.overview.slice(0, 155),
      ...(posterUrl && { images: [posterUrl] }),
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD Structured Data (Schema.org — enables Google Rich Results)
// ---------------------------------------------------------------------------
function MovieJsonLd({ movie }: { movie: MovieDetails }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title ?? movie.name,
    description: movie.overview,
    datePublished: movie.release_date,
    duration: `PT${movie.runtime}M`,
    genre: movie.genres?.map((g) => g.name) ?? [],
    ...(movie.poster_path && { image: `${IMG}/w500${movie.poster_path}` }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average?.toFixed(1),
      ratingCount: movie.vote_count,
      bestRating: '10',
      worstRating: '0',
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Page — Server Component (SSR)
// ---------------------------------------------------------------------------
export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) notFound();

  const title = movie.title ?? movie.name ?? '';
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const hours = Math.floor((movie.runtime ?? 0) / 60);
  const mins = (movie.runtime ?? 0) % 60;
  const posterUrl = movie.poster_path
    ? `${IMG}/w500${movie.poster_path}`
    : '/poster-placeholder.jpg';
  const backdropUrl = movie.backdrop_path
    ? `${IMG}/original${movie.backdrop_path}`
    : null;

  return (
    <>
      <MovieJsonLd movie={movie} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* ── Hero backdrop ── */}
        <div className="relative h-[65vh] w-full overflow-hidden">
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={`${title} backdrop`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
        </div>

        {/* ── Main content ── */}
        <div className="relative -mt-52 mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">

            {/* Poster */}
            <div className="mx-auto flex-shrink-0 md:mx-0">
              <div className="relative w-44 overflow-hidden rounded-2xl shadow-2xl shadow-black/70 ring-1 ring-white/10 sm:w-56 md:w-64">
                <Image
                  src={posterUrl}
                  alt={`${title} poster`}
                  width={256}
                  height={384}
                  priority
                  className="w-full object-cover"
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 256px"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col gap-4">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                {movie.tagline && (
                  <p className="mt-1 italic text-neutral-400">{movie.tagline}</p>
                )}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                <span className="rounded-md bg-yellow-500/15 px-2.5 py-1 font-semibold text-yellow-400 ring-1 ring-yellow-500/25">
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
                {year && <><span className="text-neutral-600">·</span><span>{year}</span></>}
                {movie.runtime > 0 && (
                  <><span className="text-neutral-600">·</span><span>{hours}h {mins}m</span></>
                )}
                {movie.status && (
                  <span className="rounded-full border border-neutral-700 px-2.5 py-0.5 text-xs">
                    {movie.status}
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300 ring-1 ring-white/10"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="max-w-2xl leading-relaxed text-neutral-300">
                {movie.overview}
              </p>

              {/*
                Client boundary — watchlist toggle + Framer Motion.
                All heavy server data stays above; only the interactive
                button is pushed to the client bundle.
              */}
              <MovieDetailClient
                movieId={movie.id}
                movieTitle={title}
                posterPath={movie.poster_path}
              />
            </div>
          </div>

          {/* ── Cast ── */}
          {movie.credits?.cast?.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-5 text-xl font-semibold">Top Cast</h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {movie.credits.cast.slice(0, 6).map((member) => (
                  <div
                    key={member.id}
                    className="group overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition-transform duration-200 hover:scale-105"
                  >
                    <div className="relative aspect-[2/3] w-full bg-neutral-800">
                      {member.profile_path ? (
                        <Image
                          src={`${IMG}/w185${member.profile_path}`}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 33vw, 16vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-600">
                          <UserIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-semibold">{member.name}</p>
                      <p className="truncate text-xs text-neutral-400">{member.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}
