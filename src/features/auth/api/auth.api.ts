import apiClient from '../../../shared/services/api/client';
import type { ApiResponse } from '../../../shared/types/api.types';
import type { LoginRequest, LoginResponse } from './auth.types';

/**
 * Auth API service
 * Handles authentication-related API calls
 */
export const authApi = {
  /**
   * Login user with email and password
   * Uses shared API client so backend and MSW mocks behave consistently
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials, {
      headers: {
        'x-skip-auth-redirect': 'true',
      },
    });

    return response.data;
  },
};
