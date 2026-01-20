'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, login, register, logout, loadCurrentUser, clearError } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      loadCurrentUser();
    }
  }, [token, user, loadCurrentUser]);

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
  };
};
