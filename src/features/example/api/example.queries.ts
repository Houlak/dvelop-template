import { queryOptions } from '@tanstack/react-query';

export type ExampleData = {
  message: string;
};

export const exampleQueryKey = ['exampleData'] as const;

/**
 * Query options factory for example page data
 * This allows reusing the same query definition in loaders and components
 */
export const exampleQueryOptions = queryOptions<ExampleData>({
  queryKey: exampleQueryKey,
  queryFn: async () => {
    const date = new Date().toISOString();
    console.log('Fetching example data at:', date);
    
    // Mock response - replace with actual API call
    // Example: return apiClient.get('/example-data');
    return {
      message: 'Welcome to Example Page: ' + date,
    };
  },
});

