import { useLocation, useParams } from "wouter";
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
  ChefHat
} from "lucide-react";

export default function CanteenOrderDetailPage() {
  const [, setLocation] = useLocation();
  const { orderId } = useParams();

  // Mock order data - in real app, fetch based on orderId
  const orderDetails = {
    id: orderId || "1233",
    status: "pending",
    placedAt: "2:30 PM",
    estimatedTime: "15 mins",
    total: 60,
    subtotal: 55,
    tax: 3,
    deliveryFee: 2,
    items: [
      {
        id: 1,
        name: "Samosa",
        quantity: 2,
        price: 20,
        total: 40,
        image: "🥟",
        isVeg: true,
        specialInstructions: "Extra spicy"
      },
      {
        id: 2,
        name: "Filter Coffee",
        quantity: 1,
        price: 20,
        total: 20,
        image: "☕",
        isVeg: true,
        specialInstructions: "Less sugar"
      }
    ],
    customer: {
      name: "Rahul Kumar",
      phone: "+91 98765 43210",
      location: "Table 5, Ground Floor"
    },
    payment: {
      method: "UPI",
      transactionId: "TXN123456789",
      status: "completed"
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-warning-foreground";
      case "preparing": return "bg-info text-info-foreground";
      case "ready": return "bg-success text-success-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    toast.success(`Order marked as ${newStatus}`);
    // In real app, update order status in database
  };

  const handleAcceptOrder = () => {
    handleStatusUpdate("preparing");
  };

  const handleRejectOrder = () => {
    toast.error("Order rejected");
    window.history.back();
  };

  const handleMarkReady = () => {
    handleStatusUpdate("ready");
  };

  const handleCompleteOrder = () => {
    handleStatusUpdate("completed");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => {
              // Use browser's back functionality, but with fallback
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
              <p className="text-sm text-muted-foreground">Order #{orderDetails.id}</p>
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
                <p className="font-semibold">{orderDetails.placedAt}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated time</p>
                <p className="font-semibold">{orderDetails.estimatedTime}</p>
              </div>
            </div>

            {/* Action Buttons based on status */}
            <div className="flex gap-2">
              {orderDetails.status === "pending" && (
                <>
                  <Button 
                    onClick={handleAcceptOrder}
                    className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Order
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleRejectOrder}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Order
                  </Button>
                </>
              )}

              {orderDetails.status === "preparing" && (
                <Button 
                  onClick={handleMarkReady}
                  className="w-full bg-success text-success-foreground hover:bg-success/90"
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Mark as Ready
                </Button>
              )}

              {orderDetails.status === "ready" && (
                <Button 
                  onClick={handleCompleteOrder}
                  className="w-full bg-success text-success-foreground hover:bg-success/90"
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
            <h2 className="font-semibold mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Order Items ({orderDetails.items.length})
            </h2>
            
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-lg">
                      {item.image}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className={`w-3 h-3 rounded border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'} m-0.5`}></div>
                        </div>
                        <span className="text-sm font-bold text-primary">x{item.quantity}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">₹{item.total}</p>
                    </div>
                  </div>
                  
                  {item.specialInstructions && (
                    <div className="ml-16 p-2 bg-warning/10 border border-warning/20 rounded">
                      <p className="text-sm text-warning-foreground">
                        <strong>Special Instructions:</strong> {item.specialInstructions}
                      </p>
                    </div>
                  )}
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
                <span className="font-medium">{orderDetails.customer.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{orderDetails.customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{orderDetails.customer.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{orderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges</span>
                <span>₹{orderDetails.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>₹{orderDetails.deliveryFee}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{orderDetails.total}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span>Payment Method</span>
                <div className="text-right">
                  <p className="font-medium">{orderDetails.payment.method}</p>
                  <p className="text-xs text-muted-foreground">{orderDetails.payment.transactionId}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <Badge className="bg-success text-success-foreground">
                  {orderDetails.payment.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}