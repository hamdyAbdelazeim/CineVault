'use client';

import { useEffect } from 'react';
import { store } from '@/store';
import { setUser } from '@/store/authSlice';
import { setWatchlist } from '@/store/watchlistSlice';
import { api } from '@/lib/api';

/**
 * Runs once on app mount and restores the user session + watchlist
 * from the backend using the persisted HttpOnly cookie.
 * Uses store.dispatch directly to avoid hook dependency issues.
 */
export default function AppInitializer() {
  useEffect(() => {
    api.auth.getMe()
      .then((data: any) => {
        if (data?.success && data?.user) {
          store.dispatch(setUser(data.user));
          store.dispatch(setWatchlist(data.user.watchlist ?? []));
        }
      })
      .catch(() => {
        // No active session — expected when not logged in
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
