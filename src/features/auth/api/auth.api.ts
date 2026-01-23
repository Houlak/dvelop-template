import type { ApiResponse } from '../../../shared/types/api.types';
import type { LoginRequest, LoginResponse } from './auth.types';

/**
 * Auth API service
 * Handles authentication-related API calls
 */
export const authApi = {
  /**
   * Login user with email and password
   * Returns mocked logged in data for now
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // Mock implementation - replace with actual API call when backend is ready
    // const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    // return response.data;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful response
    return {
      data: {
        user: {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
        },
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600,
      },
      result: true,
      errorCode: 0,
      message: 'Login successful',
      showMessage: null,
      needUpdate: false,
    };
  },
};

