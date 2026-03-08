'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState } from '@/store';
import { setUser, clearUser } from '@/store/authSlice';
import { setWatchlist } from '@/store/watchlistSlice';
import { api } from '@/lib/api';
import type { User, WatchlistItem } from '@/types';

interface AuthResponse {
  success: boolean;
  user: User;
}

interface MeResponse {
  success: boolean;
  user: User & { watchlist: WatchlistItem[] };
}

// ---------------------------------------------------------------------------
// localStorage helpers — safe wrappers that never throw
// ---------------------------------------------------------------------------
const STORAGE_USER = 'cv_user';
const STORAGE_WATCHLIST = 'cv_watchlist';

function saveSession(user: User, watchlist: WatchlistItem[]) {
  try {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_WATCHLIST, JSON.stringify(watchlist));
  } catch {}
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_WATCHLIST);
  } catch {}
}

function loadSession(): { user: User | null; watchlist: WatchlistItem[] } {
  try {
    const u = localStorage.getItem(STORAGE_USER);
    const w = localStorage.getItem(STORAGE_WATCHLIST);
    return {
      user: u ? (JSON.parse(u) as User) : null,
      watchlist: w ? (JSON.parse(w) as WatchlistItem[]) : [],
    };
  } catch {
    return { user: null, watchlist: [] };
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  /**
   * Called once on app mount.
   * 1. Instantly restore from localStorage (zero delay, no flash).
   * 2. Verify the session with the backend cookie.
   * 3. If valid  → refresh state + localStorage with fresh DB data.
   *    If invalid → clear everything (session expired).
   */
  const initialize = useCallback(async () => {
    // Step 1 — instant restore from localStorage
    const cached = loadSession();
    if (cached.user) {
      dispatch(setUser(cached.user));
      dispatch(setWatchlist(cached.watchlist));
    }

    // Step 2 — verify with backend and get fresh data
    try {
      const data = (await api.auth.getMe()) as MeResponse;
      if (data?.success && data?.user) {
        dispatch(setUser(data.user));
        dispatch(setWatchlist(data.user.watchlist ?? []));
        saveSession(data.user, data.user.watchlist ?? []);
      } else {
        dispatch(clearUser());
        dispatch(setWatchlist([]));
        clearSession();
      }
    } catch {
      // 401 = not logged in. If no cached user either, ensure clean state.
      if (!cached.user) {
        dispatch(clearUser());
        dispatch(setWatchlist([]));
      }
    }
  }, [dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    const data = (await api.auth.login({ email, password })) as AuthResponse;
    dispatch(setUser(data.user));
    let watchlist: WatchlistItem[] = [];
    try {
      const wl = (await api.watchlist.get()) as { watchlist: WatchlistItem[] };
      watchlist = wl.watchlist ?? [];
    } catch {}
    dispatch(setWatchlist(watchlist));
    saveSession(data.user, watchlist);
  }, [dispatch]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const data = (await api.auth.signup({ name, email, password })) as AuthResponse;
    dispatch(setUser(data.user));
    dispatch(setWatchlist([]));
    saveSession(data.user, []);
  }, [dispatch]);

  const logout = useCallback(async () => {
    await api.auth.logout();
    dispatch(clearUser());
    dispatch(setWatchlist([]));
    clearSession();
  }, [dispatch]);

  return { user, isAuthenticated, initialize, login, signup, logout };
}
