'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

/**
 * Wraps the app in the Redux Provider.
 * Must be a Client Component because it uses React context internally.
 */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
