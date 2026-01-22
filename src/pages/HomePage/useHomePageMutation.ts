import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRevalidator } from 'react-router-dom';
import { homePageQueryKey } from './HomePage.queries';

export type FormData = {
  name: string;
};

export type SubmitResponse = {
  message: string;
  data?: unknown;
};

/**
 * Mutation hook for HomePage form submission
 * 
 * Default behaviors:
 * - onSuccess: Invalidates homePageData query and revalidates the route
 * - onError: Logs error to console
 * 
 * Component usage: Override onSuccess/onError for specific behaviors
 * @example
 * const mutation = useHomePageMutation();
 * mutation.mutate(data, {
 *   onSuccess: () => toast.success('Saved!'),
 *   onError: (error) => setError(error.message)
 * });
 */
export const useHomePageMutation = () => {
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  return useMutation({
    mutationFn: async (data: FormData): Promise<SubmitResponse> => {
      // Make API call
      // Replace with your actual endpoint
      // Example: return await apiClient.post('/submit', data);
      
      // Mock response for now
      return {
        message: 'Form submitted successfully',
        data: data,
      };
    },
    onSuccess: async (data) => {
      // Default: Invalidate the query cache and revalidate the route
      await queryClient.invalidateQueries({ queryKey: homePageQueryKey });
      revalidator.revalidate();
    },
    onError: (error) => {
      // Default: Log error (override in component for user-facing error handling)
      console.error('Form submission error:', error);
    },
  });
};

