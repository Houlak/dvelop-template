import { queryOptions } from '@tanstack/react-query';

export type HomePageData = {
  message: string;
};

export const homePageQueryKey = ['homePageData'] as const;

/**
 * Query options factory for home page data
 * This allows reusing the same query definition in loaders and components
 */
export const homePageQueryOptions = queryOptions<HomePageData>({
  queryKey: homePageQueryKey,
  queryFn: async () => {
    const date = new Date().toISOString();
    console.log('Fetching home page data at:', date);
    
    // Mock response - replace with actual API call
    // Example: return apiClient.get('/home-data');
    return {
      message: 'Welcome to HomePage: ' + date,
    };
  },
});

