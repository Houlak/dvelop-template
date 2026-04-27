import axios, { AxiosError, AxiosInstance } from 'axios';
import { config } from '../../../app/config/env';
import { useAuthStore } from '../../../features/auth/store/auth.store';
import { ApiResponse } from '../../types/api.types';

const instance: AxiosInstance = axios.create({
  baseURL: config.backendUrl,
  withCredentials: true,
});

const getApiResponseMessage = (response: ApiResponse) => {
  if (!response.showMessage) return null;
  if (typeof response.showMessage === 'string') return response.showMessage;

  return response.showMessage.ES;
};

const onRejectedApiResponse = (error: AxiosError<ApiResponse>) => {
  if (error.response) {
    // Request was made, server responded with status code > 2xx

    if (error.response.status === 401) {
      const shouldSkipRedirect = error.config?.headers?.['x-skip-auth-redirect'] === 'true';

      if (!shouldSkipRedirect) {
        useAuthStore.getState().clearAuth();

        if (typeof window !== 'undefined') {
          const currentPath = `${window.location.pathname}${window.location.search}`;
          const redirectParam = encodeURIComponent(currentPath);
          const targetLoginPath = `/login?redirect=${redirectParam}`;

          if (!window.location.pathname.startsWith('/login')) {
            window.location.assign(targetLoginPath);
          }
        }
      }
    }

    return Promise.reject(getApiResponseMessage(error.response.data) || error.message);
  }

  if (error.request) {
    // Request was made but no response was received
    return Promise.reject(error.message);
  }

  // Something happened in setting up the request that triggered an Error
  return Promise.reject(error.message);
};

instance.interceptors.response.use((response) => response, onRejectedApiResponse);

export default instance;
