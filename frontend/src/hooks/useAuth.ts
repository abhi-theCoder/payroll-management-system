'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, login, register, logout, loadCurrentUser, clearError, isHydrated, hydrate } = useAuthStore();

  // Hydrate store from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Load user from token if needed (for hard refresh persistence)
  useEffect(() => {
    if (isHydrated && token && !user && !isLoading) {
      loadCurrentUser();
    }
  }, [isHydrated, token, user, isLoading, loadCurrentUser]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isHydrated,
  };
};
