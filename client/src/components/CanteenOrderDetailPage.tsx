import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Clock, 
  Receipt, 
  User,
  Phone,
  CreditCard,
  CheckCircle,
  XCircle,
  ChefHat,
  Loader2
} from "lucide-react";
import type { Order } from "@shared/schema";

export default function CanteenOrderDetailPage() {
  const [, setLocation] = useLocation();
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  // Fetch real order data from database
  const { data: orderDetails, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!orderId,
  });

  // Parse order items from JSON string
  const parsedItems = orderDetails?.items ? (() => {
    try {
      return JSON.parse(orderDetails.items);
    } catch {
      return [];
    }
  })() : [];

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId] });
      toast.success('Order status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order status');
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-warning-foreground";
      case "preparing": return "bg-blue-500 text-white";
      case "ready": return "bg-success text-success-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    updateOrderStatusMutation.mutate(newStatus);
  };

  const handleMarkReady = () => {
    handleStatusUpdate("ready");
  };

  const handleCompleteOrder = () => {
    handleStatusUpdate("completed");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/canteen-owner')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                setLocation('/canteen-owner');
              }
            }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Order Details</h1>
              <p className="text-sm text-muted-foreground">Order #{orderDetails.orderNumber || orderDetails.id}</p>
            </div>
          </div>
          <Badge className={getStatusColor(orderDetails.status)}>
            {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Status & Actions */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order placed at</p>
                <p className="font-semibold">{new Date(orderDetails.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated time</p>
                <p className="font-semibold">{orderDetails.estimatedTime || 15} mins</p>
              </div>
            </div>

            {/* Action Buttons based on status */}
            <div className="flex gap-2">
              {orderDetails.status === "preparing" && (
                <Button 
                  onClick={handleMarkReady}
                  className="w-full bg-success text-success-foreground hover:bg-success/90"
                  disabled={updateOrderStatusMutation.isPending}
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Mark as Ready
                </Button>
              )}

              {orderDetails.status === "ready" && (
                <Button 
                  onClick={handleCompleteOrder}
                  className="w-full bg-success text-success-foreground hover:bg-success/90"
                  disabled={updateOrderStatusMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg mb-4">
              <span className="font-medium">Order Items ({parsedItems.length})</span>
              <Receipt className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              {parsedItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-accent/50 flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{item.name || 'Unknown Item'}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">VEG</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">₹{item.price || 0} each</p>
                    {item.specialInstructions && (
                      <p className="text-sm text-primary mt-1">Special Instructions: {item.specialInstructions}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">x{item.quantity || 1}</p>
                    <p className="text-sm font-bold">₹{(item.price || 0) * (item.quantity || 1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{orderDetails.customerName || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>N/A</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-bold text-lg">₹{orderDetails.amount}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span>Payment Status</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Paid
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}