import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

/**
 * Hook that performs a logout flow:
 * - Clears auth state
 * - Invalidates React Query cache
 * - Redirects to the login page
 */
export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear authentication state
      clearAuth();
      
      // Invalidate all queries
      await queryClient.invalidateQueries();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Still navigate even if there's an error
      navigate('/login');
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};

