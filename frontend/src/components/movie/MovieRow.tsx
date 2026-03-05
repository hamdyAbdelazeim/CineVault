'use client';

import { useRef } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '@/types';

interface Props {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({ left: dir === 'right' ? 420 : -420, behavior: 'smooth' });
  };

  if (!movies.length) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-lg font-semibold text-white sm:text-xl">{title}</h2>

      <div className="group relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute -left-3 top-[38%] z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-2.5 text-white opacity-0 shadow-xl backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:flex"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {/* Scrollable row */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-36 flex-shrink-0 sm:w-44">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute -right-3 top-[38%] z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-2.5 text-white opacity-0 shadow-xl backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:flex"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
