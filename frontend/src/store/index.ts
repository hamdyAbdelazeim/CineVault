import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from './watchlistSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
