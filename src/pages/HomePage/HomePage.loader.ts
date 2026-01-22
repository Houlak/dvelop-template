import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { homePageQueryOptions, type HomePageData } from './HomePage.queries';

export type HomePageLoaderData = {
  message?: string;
};

/**
 * Loader function for HomePage route
 * Prefetches data needed for the page
 */
export const homePageLoader = (queryClient: QueryClient) => {
  return async ({ request, params }: LoaderFunctionArgs): Promise<HomePageData> => {
    const response = await queryClient.ensureQueryData(homePageQueryOptions);

    return response;
  };
};

