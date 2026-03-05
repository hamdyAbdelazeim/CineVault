'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { addToWatchlist, removeFromWatchlist } from '@/store/watchlistSlice';
import type { Movie } from '@/types';

const IMG = 'https://image.tmdb.org/t/p';

export default function HeroSection({ movie }: { movie: Movie }) {
  const dispatch = useDispatch();
  const isInWatchlist = useSelector((state: RootState) =>
    state.watchlist.ids.includes(movie.id),
  );

  const title = movie.title ?? movie.name ?? '';
  const year = (movie.release_date ?? movie.first_air_date ?? '').slice(0, 4);
  const backdropUrl = movie.backdrop_path
    ? `${IMG}/original${movie.backdrop_path}`
    : null;

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist({ id: movie.id, title, posterPath: movie.poster_path }));
    }
  };

  return (
    <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">
      {/* Backdrop */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-500">
            Trending Now
          </p>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>

          {year && (
            <p className="mt-1 text-sm font-medium text-neutral-400">{year}</p>
          )}

          <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            {movie.overview}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/movie/${movie.id}`}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 font-semibold text-black transition-opacity hover:opacity-85"
            >
              <InfoIcon className="h-4 w-4" />
              More Info
            </Link>

            <motion.button
              onClick={toggleWatchlist}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 font-semibold backdrop-blur-sm transition-colors ${
                isInWatchlist
                  ? 'bg-white/25 text-white hover:bg-white/35'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isInWatchlist ? (
                <><CheckIcon className="h-4 w-4" /> In Watchlist</>
              ) : (
                <><PlusIcon className="h-4 w-4" /> Add to Watchlist</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Rating chip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute right-6 top-24 flex flex-col items-center rounded-2xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-sm sm:top-28"
      >
        <span className="text-2xl font-black text-yellow-400">
          {movie.vote_average.toFixed(1)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-neutral-400">/ 10</span>
      </motion.div>
    </section>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
