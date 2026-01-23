import { useAuthStore } from '../store/auth.store';

/**
 * Hook to access authentication state
 * Returns user, token, and authentication status
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return {
    user,
    token,
    isAuthenticated,
    logout: clearAuth,
  };
};

