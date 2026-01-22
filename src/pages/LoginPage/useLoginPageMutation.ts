import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../features/auth/api/auth.api';
import type { LoginFormData } from '../../features/auth/components/LoginForm/LoginForm';
import type { LoginResponse } from '../../features/auth/api/auth.types';

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
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      // You can also set user data in cache or context here
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

