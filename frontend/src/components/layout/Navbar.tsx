'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import SearchBar from '@/components/ui/SearchBar';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const watchlistCount = useSelector((state: RootState) => state.watchlist.ids.length);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/5 bg-neutral-950/90 backdrop-blur-xl'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 text-xl font-black tracking-tighter text-red-500 sm:text-2xl"
          >
            CINE<span className="text-white">VAULT</span>
          </Link>

          {/* Desktop search */}
          <div className="mx-4 hidden flex-1 max-w-sm md:block">
            <SearchBar />
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Watchlist link */}
            <Link
              href="/watchlist"
              className="relative hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:text-white sm:flex"
            >
              <BookmarkIcon className="h-4 w-4" />
              <span className="hidden lg:block">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {watchlistCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-neutral-400 sm:block">
                  Hi, {user?.name.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModal('login')}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-neutral-950/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-3 px-4 py-4">
                <SearchBar onSelect={() => setMenuOpen(false)} />
                <Link
                  href="/watchlist"
                  className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <BookmarkIcon className="h-4 w-4" />
                  Watchlist
                  {watchlistCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {watchlistCount}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AnimatePresence>
        {authModal && (
          <AuthModal
            mode={authModal}
            onClose={() => setAuthModal(null)}
            onToggleMode={() => setAuthModal((m) => (m === 'login' ? 'signup' : 'login'))}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
