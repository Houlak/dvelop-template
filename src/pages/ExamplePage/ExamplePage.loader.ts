import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { exampleQueryOptions, type ExampleData } from '../../features/example/api/example.queries';

export type ExamplePageLoaderData = {
  message?: string;
};

/**
 * Loader function for ExamplePage route
 * Prefetches data needed for the page
 */
export const examplePageLoader = (queryClient: QueryClient) => {
  return async ({ request, params }: LoaderFunctionArgs): Promise<ExampleData> => {
    const response = await queryClient.ensureQueryData(exampleQueryOptions);

    return response;
  };
};

