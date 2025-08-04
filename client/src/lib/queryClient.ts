import { QueryClient } from "@tanstack/react-query";

// Configure the default query client for real-time synchronization
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds - more frequent updates for real-time sync
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: true, // Refetch when switching between dashboards
      refetchOnMount: true, // Always refetch on component mount
      refetchInterval: 1000 * 60, // Automatic refetch every minute
      queryFn: async ({ queryKey }) => {
        const [url] = queryKey as [string];
        console.log('Fetching from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

// Default fetcher function for API requests
const apiRequest = async (url: string, options?: RequestInit): Promise<any> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Enhanced mutation helper with automatic cache invalidation
export const createMutationWithSync = (
  url: string, 
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  invalidateKeys: string[] = []
) => {
  return {
    mutationFn: async (data?: any) => {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      
      if (data && method !== 'DELETE') {
        options.body = JSON.stringify(data);
      }
      
      return apiRequest(url, options);
    },
    onSuccess: () => {
      // Invalidate related queries for real-time sync across dashboards
      const keysToInvalidate = invalidateKeys.length > 0 ? invalidateKeys : [url.split('/').slice(0, -1).join('/')];
      
      keysToInvalidate.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      
      // Invalidate common data that all dashboards use
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    }
  };
};

export { apiRequest };