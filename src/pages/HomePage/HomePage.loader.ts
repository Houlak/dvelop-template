import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export type HomePageLoaderData = {
  message?: string;
};

/**
 * Loader function for HomePage route
 * Prefetches data needed for the page
 */
export const homePageLoader = (queryClient: QueryClient) => {
  return async ({ request, params }: LoaderFunctionArgs): Promise<HomePageLoaderData> => {
    // Example: Prefetch data with TanStack Query
     const response = await queryClient.ensureQueryData({
       queryKey: ['homePageData'],
       queryFn: async () => {
        // mock response for now
        return {
          message: 'Welcome to HomePage: ' + new Date().toISOString(),
        };
       },
     });

    return response;
  };
};

