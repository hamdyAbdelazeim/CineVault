'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '@/store';
import { removeFromWatchlist } from '@/store/watchlistSlice';

const IMG = 'https://image.tmdb.org/t/p';

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.watchlist.items);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          {items.length > 0 && (
            <span className="rounded-full bg-red-600/20 px-3 py-1 text-sm font-medium text-red-400 ring-1 ring-red-600/30">
              {items.length} {items.length === 1 ? 'movie' : 'movies'}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="rounded-2xl bg-white/5 p-6">
              <FilmIcon className="h-16 w-16 text-neutral-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">Your watchlist is empty</p>
              <p className="mt-1 text-sm text-neutral-400">
                Browse movies and hit the + button to save them here.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-500"
            >
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  className="group relative overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10"
                >
                  <Link href={`/movie/${item.id}`}>
                    <div className="relative aspect-[2/3] w-full bg-neutral-800">
                      {item.posterPath ? (
                        <Image
                          src={`${IMG}/w342${item.posterPath}`}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-600">
                          <FilmIcon className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={() => dispatch(removeFromWatchlist(item.id))}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-neutral-300 opacity-0 transition-opacity backdrop-blur-sm hover:text-white group-hover:opacity-100"
                    aria-label={`Remove ${item.title} from watchlist`}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>

                  <div className="p-2.5">
                    <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}

function FilmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-6.75A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v6.75m0 0A1.125 1.125 0 0120.625 19.5M21.75 12v-1.5A2.25 2.25 0 0019.5 8.25h-15A2.25 2.25 0 002.25 10.5V12m19.5 0A2.25 2.25 0 0019.5 14.25h-15A2.25 2.25 0 002.25 12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
