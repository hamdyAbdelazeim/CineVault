'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState } from '@/store';
import { setUser, clearUser } from '@/store/authSlice';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthResponse {
  success: boolean;
  user: User;
}

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (email: string, password: string) => {
    const data = (await api.auth.login({ email, password })) as AuthResponse;
    dispatch(setUser(data.user));
  }, [dispatch]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const data = (await api.auth.signup({ name, email, password })) as AuthResponse;
    dispatch(setUser(data.user));
  }, [dispatch]);

  const logout = useCallback(async () => {
    await api.auth.logout();
    dispatch(clearUser());
  }, [dispatch]);

  return { user, isAuthenticated, login, signup, logout };
}
