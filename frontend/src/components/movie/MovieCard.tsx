'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Movie } from '@/types';
import { useWatchlist } from '@/hooks/useWatchlist';

const IMG = 'https://image.tmdb.org/t/p';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { ids, add, remove } = useWatchlist();
  const isInWatchlist = ids.includes(movie.id);

  const title = movie.title ?? movie.name ?? 'Unknown';
  const year = (movie.release_date ?? movie.first_air_date ?? '').slice(0, 4);
  const posterUrl = movie.poster_path
    ? `${IMG}/w342${movie.poster_path}`
    : '/poster-placeholder.jpg';

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      remove(movie.id);
    } else {
      add({ id: movie.id, title, posterPath: movie.poster_path });
    }
  };

  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <motion.div
        className="group relative overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 transition-shadow hover:shadow-xl hover:shadow-black/60"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-800">
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 180px"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>

        {/* Rating badge */}
        <div className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-bold text-yellow-400 backdrop-blur-sm">
          ★ {movie.vote_average.toFixed(1)}
        </div>

        {/* Watchlist button — always visible if in watchlist, else shows on hover */}
        <motion.button
          onClick={toggleWatchlist}
          whileTap={{ scale: 0.85 }}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-200 ${
            isInWatchlist
              ? 'bg-red-600'
              : 'bg-black/60 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isInWatchlist ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
        </motion.button>

        {/* Title & year */}
        <div className="p-2.5">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          {year && <p className="text-xs text-neutral-400">{year}</p>}
        </div>
      </motion.div>
    </Link>
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
