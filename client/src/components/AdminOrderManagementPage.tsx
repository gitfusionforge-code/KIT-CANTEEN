import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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
  const [orders, setOrders] = useState([
    {
      id: "ORD-8935",
      customer: "John Doe",
      email: "john@example.com",
      items: ["Veg Thali", "Coffee"],
      total: 150,
      status: "pending",
      canteen: "Main Hall",
      orderTime: "2024-01-20 14:30",
      estimatedTime: "15 mins",
      paymentStatus: "paid"
    },
    {
      id: "ORD-8934",
      customer: "Jane Smith",
      email: "jane@example.com",
      items: ["Chicken Curry", "Rice", "Lassi"],
      total: 280,
      status: "preparing",
      canteen: "Food Court",
      orderTime: "2024-01-20 14:25",
      estimatedTime: "20 mins",
      paymentStatus: "paid"
    },
    {
      id: "ORD-8933",
      customer: "Mike Johnson",
      email: "mike@example.com",
      items: ["Masala Dosa", "Sambar"],
      total: 120,
      status: "ready",
      canteen: "South Wing",
      orderTime: "2024-01-20 14:20",
      estimatedTime: "Ready",
      paymentStatus: "paid"
    },
    {
      id: "ORD-8932",
      customer: "Sarah Wilson",
      email: "sarah@example.com",
      items: ["Biryani", "Raita"],
      total: 200,
      status: "completed",
      canteen: "Main Hall",
      orderTime: "2024-01-20 14:15",
      estimatedTime: "Completed",
      paymentStatus: "paid"
    },
    {
      id: "ORD-8931",
      customer: "Tom Brown",
      email: "tom@example.com",
      items: ["Sandwich", "Cold Coffee"],
      total: 95,
      status: "cancelled",
      canteen: "Café Corner",
      orderTime: "2024-01-20 14:10",
      estimatedTime: "Cancelled",
      paymentStatus: "refunded"
    }
  ]);
  const { toast } = useToast();

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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    console.log(`Updating order ${orderId} to ${newStatus}`);
    toast({
      title: "Order Updated",
      description: `Order ${orderId} has been updated to ${newStatus}`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your order data is being exported to CSV",
    });
  };

  const handleRefresh = () => {
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
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
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
                          <h3 className="font-semibold text-foreground">{order.id}</h3>
                          <Badge variant={getStatusColor(order.status) as any} className="flex items-center space-x-1">
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                          <Badge variant="outline">{order.canteen}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleViewOrder(order.id)}
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
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-muted-foreground text-xs">{order.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Items</p>
                          <p className="font-medium">{order.items.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-medium text-success">₹{order.total}</p>
                          <p className="text-muted-foreground text-xs capitalize">{order.paymentStatus}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time</p>
                          <p className="font-medium">{order.orderTime}</p>
                          <p className="text-muted-foreground text-xs">{order.estimatedTime}</p>
                        </div>
                      </div>

                      {/* Order Actions */}
                      {order.status !== "completed" && order.status !== "cancelled" && (
                        <div className="flex items-center space-x-2 pt-2 border-t">
                          {order.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="food"
                                onClick={() => updateOrderStatus(order.id, "preparing")}
                              >
                                Accept Order
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateOrderStatus(order.id, "cancelled")}
                              >
                                Cancel Order
                              </Button>
                            </>
                          )}
                          {order.status === "preparing" && (
                            <Button 
                              size="sm" 
                              variant="food"
                              onClick={() => updateOrderStatus(order.id, "ready")}
                            >
                              Mark as Ready
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button 
                              size="sm" 
                              variant="food"
                              onClick={() => updateOrderStatus(order.id, "completed")}
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