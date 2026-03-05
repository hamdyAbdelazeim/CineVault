'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  youtubeKey: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ youtubeKey, title, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centering wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="w-full max-w-4xl pointer-events-auto"
        >
          {/* Header bar */}
          <div className="mb-3 flex items-center justify-between">
            <p className="truncate text-sm font-medium text-neutral-300">
              {title} — Official Trailer
            </p>
            <button
              onClick={onClose}
              className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close trailer"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* YouTube embed — aspect-video keeps 16:9 at any width */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
