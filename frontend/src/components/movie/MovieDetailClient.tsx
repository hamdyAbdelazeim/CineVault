'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addToWatchlist, removeFromWatchlist } from '@/store/watchlistSlice';
import type { RootState } from '@/store';
import { api } from '@/lib/api';
import TrailerModal from './TrailerModal';

interface Props {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
}

interface VideosResponse {
  success: boolean;
  trailer: { key: string; name: string } | null;
}

export default function MovieDetailClient({ movieId, movieTitle, posterPath }: Props) {
  const dispatch = useDispatch();
  const isInWatchlist = useSelector((state: RootState) =>
    state.watchlist.ids.includes(movieId),
  );

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [noTrailer, setNoTrailer] = useState(false);

  const handleWatchTrailer = async () => {
    if (trailerLoading) return;
    // Re-open if already fetched
    if (trailerKey) { setTrailerKey(trailerKey); return; }

    setTrailerLoading(true);
    setNoTrailer(false);
    try {
      const data = (await api.movies.videos(movieId)) as VideosResponse;
      if (data.trailer?.key) {
        setTrailerKey(data.trailer.key);
      } else {
        setNoTrailer(true);
        setTimeout(() => setNoTrailer(false), 3000);
      }
    } catch {
      setNoTrailer(true);
      setTimeout(() => setNoTrailer(false), 3000);
    } finally {
      setTrailerLoading(false);
    }
  };

  const toggle = () => {
    dispatch(
      isInWatchlist
        ? removeFromWatchlist(movieId)
        : addToWatchlist({ id: movieId, title: movieTitle, posterPath }),
    );
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 pt-2">
        {/* Watch Trailer button */}
        <motion.button
          onClick={handleWatchTrailer}
          disabled={trailerLoading}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {trailerLoading ? (
            <SpinnerIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
          {trailerLoading ? 'Loading…' : noTrailer ? 'No Trailer Found' : 'Watch Trailer'}
        </motion.button>

        {/* Watchlist toggle button */}
        <motion.button
          onClick={toggle}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label={
            isInWatchlist
              ? `Remove ${movieTitle} from watchlist`
              : `Add ${movieTitle} to watchlist`
          }
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
            isInWatchlist
              ? 'bg-neutral-700 text-white hover:bg-neutral-600'
              : 'bg-red-600 text-white hover:bg-red-500'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isInWatchlist ? 'check' : 'plus'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {isInWatchlist ? (
                <><CheckIcon className="h-4 w-4" /> In Watchlist</>
              ) : (
                <><PlusIcon className="h-4 w-4" /> Add to Watchlist</>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Trailer modal */}
      <AnimatePresence>
        {trailerKey && (
          <TrailerModal
            youtubeKey={trailerKey}
            title={movieTitle}
            onClose={() => setTrailerKey(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
