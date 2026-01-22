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
 */
export const useHomePageMutation = () => {
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  return useMutation({
    mutationFn: async (data: FormData): Promise<SubmitResponse> => {
      // Make API call
      // Replace with your actual endpoint
      // mock response for now
      return {
        message: 'Form submitted successfully',
        data: data,
      };
    },
    onSuccess: async (data) => {
      // Invalidate related queries if needed
      await queryClient.invalidateQueries({ queryKey: homePageQueryKey });
      // Revalidate the route loader to get the latest data
      revalidator.revalidate();
    }
  });
};

