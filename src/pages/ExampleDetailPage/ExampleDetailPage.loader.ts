import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export type ExampleDetailPageLoaderData = {
  id: string;
  title: string;
  description: string;
  content: string;
};

/**
 * Loader function for ExampleDetailPage route
 * Returns mock data based on the ID parameter
 */
export const exampleDetailPageLoader = (queryClient: QueryClient) => {
  return async ({ request, params }: LoaderFunctionArgs): Promise<ExampleDetailPageLoaderData> => {
    const id = params.id || '1';
    
    // Mock data based on ID
    return {
      id,
      title: `Example Item ${id}`,
      description: `This is a detailed view of example item ${id}`,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is the full content for item ${id}. 
      You can navigate back to the example list or explore other items. This demonstrates the routing capabilities 
      of the application with dynamic parameters.`,
    };
  };
};

