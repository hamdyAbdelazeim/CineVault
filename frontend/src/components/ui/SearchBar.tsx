'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api';
import type { Movie } from '@/types';

const IMG = 'https://image.tmdb.org/t/p';

interface Props {
  onSelect?: () => void;
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch search results whenever the debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    api.movies
      .search(debouncedQuery)
      .then((data: unknown) => {
        const d = data as { results?: Movie[] };
        setResults((d.results ?? []).slice(0, 6));
        setOpen(true);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    onSelect?.();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/10 focus-within:ring-red-500/60 transition-all">
        <SearchIcon className="h-4 w-4 flex-shrink-0 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies & series..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
        />
        {loading && <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-neutral-400 flex-shrink-0" />}
        {query && !loading && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="text-neutral-400 hover:text-white flex-shrink-0"
            aria-label="Clear search"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 shadow-2xl backdrop-blur-xl"
          >
            {results.map((movie) => {
              const title = movie.title ?? movie.name ?? '';
              const year = (movie.release_date ?? movie.first_air_date ?? '').slice(0, 4);
              return (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  onClick={handleSelect}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-white/10 transition-colors"
                >
                  <div className="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded bg-neutral-800">
                    {movie.poster_path ? (
                      <Image
                        src={`${IMG}/w92${movie.poster_path}`}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-600 text-xs">?</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{title}</p>
                    <p className="text-xs text-neutral-400">
                      {year && `${year} · `}★ {movie.vote_average.toFixed(1)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
