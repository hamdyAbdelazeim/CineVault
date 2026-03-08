'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState } from '@/store';
import { addToWatchlist, removeFromWatchlist } from '@/store/watchlistSlice';
import { api } from '@/lib/api';
import type { WatchlistItem } from '@/types';

const STORAGE_WATCHLIST = 'cv_watchlist';

function saveWatchlist(items: WatchlistItem[]) {
  try { localStorage.setItem(STORAGE_WATCHLIST, JSON.stringify(items)); } catch {}
}

export function useWatchlist() {
  const dispatch = useDispatch();
  const { ids, items } = useSelector((state: RootState) => state.watchlist);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const add = useCallback(
    (item: WatchlistItem) => {
      dispatch(addToWatchlist(item));
      // Persist to localStorage immediately
      const stored = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_WATCHLIST) ?? '[]') as WatchlistItem[]; } catch { return []; } })();
      if (!stored.find(i => i.id === item.id)) saveWatchlist([...stored, item]);
      // Sync to backend if logged in
      if (isAuthenticated) api.watchlist.add(item).catch(() => {});
    },
    [dispatch, isAuthenticated],
  );

  const remove = useCallback(
    (id: number) => {
      dispatch(removeFromWatchlist(id));
      // Persist to localStorage immediately
      const stored = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_WATCHLIST) ?? '[]') as WatchlistItem[]; } catch { return []; } })();
      saveWatchlist(stored.filter(i => i.id !== id));
      // Sync to backend if logged in
      if (isAuthenticated) api.watchlist.remove(id).catch(() => {});
    },
    [dispatch, isAuthenticated],
  );

  return { ids, items, add, remove };
}
