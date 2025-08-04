import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function AdminOrderManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();

  // Fetch real orders from database using React Query
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders, error: ordersError } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "warning";
      case "preparing": return "primary";
      case "ready": return "success";
      case "completed": return "success";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock;
      case "preparing": return RefreshCw;
      case "ready": return CheckCircle;
      case "completed": return CheckCircle;
      case "cancelled": return XCircle;
      default: return AlertTriangle;
    }
  };

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: number, newStatus: string }) => {
      return apiRequest(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: { status: newStatus }
      });
    },
    onSuccess: (_, { orderId, newStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order Updated",
        description: `Order ${orderId} has been updated to ${newStatus}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  });

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your order data is being exported to CSV",
    });
  };

  const handleRefresh = () => {
    refetchOrders();
    toast({
      title: "Refreshed",
      description: "Order data has been refreshed",
    });
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "View Order",
      description: `Opening details for order ${orderId}`,
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filters",
      description: "Advanced filter options coming soon",
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">Monitor and manage all customer orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
          <Button variant="food" className="flex items-center space-x-2" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2" onClick={handleFilter}>
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({statusCounts.preparing})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({statusCounts.ready})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({statusCounts.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div key={order.id} className="p-4 border rounded-lg space-y-3">
                      {/* Order Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                          <Badge variant={getStatusColor(order.status) as any} className="flex items-center space-x-1">
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                          <Badge variant="outline">Canteen</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleViewOrder(order.orderNumber)}
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Button>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-muted-foreground text-xs">ID: {order.customerId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Items</p>
                          <p className="font-medium">{order.items}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-medium text-success">₹{order.amount}</p>
                          <p className="text-muted-foreground text-xs">Paid</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time</p>
                          <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                          <p className="text-muted-foreground text-xs">{order.estimatedTime} mins</p>
                        </div>
                      </div>

                      {/* Order Actions */}
                      {order.status !== "completed" && order.status !== "cancelled" && (
                        <div className="flex items-center space-x-2 pt-2 border-t">
                          {order.status === "preparing" && (
                            <Button 
                              size="sm" 
                              variant="food"
                              onClick={() => updateOrderStatus.mutate({ orderId: order.id, newStatus: "ready" })}
                            >
                              Mark as Ready
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button 
                              size="sm" 
                              variant="food"
                              onClick={() => updateOrderStatus.mutate({ orderId: order.id, newStatus: "completed" })}
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}