import { useQuery } from "@tanstack/react-query";
import type { MenuItem, Category, Order, User } from "@shared/schema";

/**
 * Custom hook for synchronized data fetching across all dashboards
 * Ensures real-time data consistency between admin, canteen owner, and student views
 */
export function useDataSync() {
  // Categories query with aggressive refresh for real-time sync
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 30, // 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60, // Auto-refresh every minute
  });

  // Menu items query with real-time sync
  const menuItemsQuery = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
    staleTime: 1000 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  // Orders query for dashboard sync
  const ordersQuery = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    staleTime: 1000 * 15, // More frequent for orders
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds
  });

  // Analytics query for admin dashboards (optional, don't fail sync if not available)
  const analyticsQuery = useQuery({
    queryKey: ['/api/admin/analytics'],
    staleTime: 1000 * 60, // 1 minute for analytics
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 120, // Auto-refresh every 2 minutes
    retry: false, // Don't retry analytics failures
    retryOnMount: false,
  });

  // Computed values for dashboard consistency
  const stats = {
    totalCategories: categoriesQuery.data?.length || 0,
    totalMenuItems: menuItemsQuery.data?.length || 0,
    availableItems: menuItemsQuery.data?.filter(item => item.available).length || 0,
    totalOrders: ordersQuery.data?.length || 0,
    pendingOrders: ordersQuery.data?.filter(order => order.status === 'preparing').length || 0,
    completedOrders: ordersQuery.data?.filter(order => order.status === 'completed').length || 0,
    totalRevenue: ordersQuery.data?.reduce((sum, order) => sum + order.amount, 0) || 0,
  };

  // Combined loading state
  const isLoading = categoriesQuery.isLoading || menuItemsQuery.isLoading || ordersQuery.isLoading;

  // Combined error state (excluding analytics errors as they're optional)
  const hasError = categoriesQuery.error || menuItemsQuery.error || ordersQuery.error;

  return {
    // Raw data
    categories: categoriesQuery.data || [],
    menuItems: menuItemsQuery.data || [],
    orders: ordersQuery.data || [],
    analytics: analyticsQuery.data,
    
    // Computed stats
    stats,
    
    // Loading and error states
    isLoading,
    hasError,
    
    // Refetch functions for manual sync
    refetch: {
      categories: categoriesQuery.refetch,
      menuItems: menuItemsQuery.refetch,
      orders: ordersQuery.refetch,
      analytics: analyticsQuery.refetch,
      all: () => {
        categoriesQuery.refetch();
        menuItemsQuery.refetch();
        ordersQuery.refetch();
        analyticsQuery.refetch();
      }
    },
    
    // Individual query states for granular control
    queries: {
      categories: categoriesQuery,
      menuItems: menuItemsQuery,
      orders: ordersQuery,
      analytics: analyticsQuery,
    }
  };
}

/**
 * Hook specifically for authentication state synchronization
 */
export function useAuthSync() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
    isCanteenOwner: user?.role === 'canteen_owner',
    isStudent: user?.role === 'student' || !user?.role,
    hasRole: (role: string) => user?.role === role,
  };
}