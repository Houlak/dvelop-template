import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../features/auth/api/auth.api';
import type { LoginResponse } from '../../features/auth/api/auth.types';
import type { LoginFormData } from '../../features/auth/components/LoginForm/LoginForm';
import { useAuthStore } from '../../features/auth/store/auth.store';

export type LoginMutationResponse = {
  message: string;
  data: LoginResponse;
};

/**
 * Mutation hook for LoginPage form submission
 * Handles authentication via auth service
 */
export const useLoginPageMutation = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginMutationResponse> => {
      const response = await authApi.login(data);
      
      if (!response.result) {
        throw new Error(response.message || 'Login failed');
      }

      return {
        message: 'Login successful',
        data: response.data,
      };
    },
    onSuccess: (data) => {
      // Store auth data in Zustand store (with persistence)
      setAuth(data.data.user, data.data.token);
      
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

