import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WatchlistItem } from '@/types';

interface WatchlistState {
  ids: number[];
  items: WatchlistItem[];
}

const initialState: WatchlistState = { ids: [], items: [] };

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist(state, action: PayloadAction<WatchlistItem[]>) {
      state.items = action.payload;
      state.ids = action.payload.map((item) => item.id);
    },
    addToWatchlist(state, action: PayloadAction<WatchlistItem>) {
      if (!state.ids.includes(action.payload.id)) {
        state.ids.push(action.payload.id);
        state.items.push(action.payload);
      }
    },
    removeFromWatchlist(state, action: PayloadAction<number>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setWatchlist, addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
