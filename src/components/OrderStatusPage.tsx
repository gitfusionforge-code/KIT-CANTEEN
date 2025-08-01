import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ChefHat, Package, Phone, ArrowLeft } from "lucide-react";

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [orderStatus, setOrderStatus] = useState<"placed" | "preparing" | "ready">("placed");
  const [progress, setProgress] = useState(25);

  const orderDetails = {
    id: orderId || "12345",
    items: [
      { name: "Veg Thali", quantity: 2, price: 170 },
      { name: "Masala Tea", quantity: 1, price: 15 }
    ],
    total: 194,
    estimatedTime: "15-20 mins",
    actualTime: orderStatus === "ready" ? "18 mins" : "15-20 mins",
    pickupLocation: "KIT College Main Canteen, Ground Floor"
  };

  useEffect(() => {
    // Simulate order progress
    const timer1 = setTimeout(() => {
      setOrderStatus("preparing");
      setProgress(60);
    }, 3000);

    const timer2 = setTimeout(() => {
      setOrderStatus("ready");
      setProgress(100);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);


  const statusSteps = [
    {
      status: "placed",
      label: "Order Placed",
      icon: CheckCircle,
      completed: true,
      time: "2:30 PM"
    },
    {
      status: "preparing",
      label: "Preparing",
      icon: ChefHat,
      completed: orderStatus === "preparing" || orderStatus === "ready",
      time: orderStatus === "preparing" || orderStatus === "ready" ? "2:33 PM" : ""
    },
    {
      status: "ready",
      label: "Ready for Pickup",
      icon: Package,
      completed: orderStatus === "ready",
      time: orderStatus === "ready" ? "2:48 PM" : ""
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={() => {
              // Use browser's back functionality, but with fallback
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate('/orders');
              }
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Order Status</h1>
          <p className="text-white/80">Order #{orderDetails.id}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Current Status */}
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {orderStatus === "placed" && <Clock className="w-10 h-10 text-primary" />}
              {orderStatus === "preparing" && <ChefHat className="w-10 h-10 text-warning" />}
              {orderStatus === "ready" && <Package className="w-10 h-10 text-success" />}
            </div>
            
            <h2 className="text-xl font-bold mb-2">
              {orderStatus === "placed" && "Order Received!"}
              {orderStatus === "preparing" && "Preparing Your Order"}
              {orderStatus === "ready" && "Ready for Pickup!"}
            </h2>
            
            <p className="text-muted-foreground mb-4">
              {orderStatus === "placed" && "Your order has been received and will be prepared shortly"}
              {orderStatus === "preparing" && "Our chef is preparing your delicious meal"}
              {orderStatus === "ready" && "Your order is ready! Please collect from the canteen counter"}
            </p>

            <div className="bg-accent/50 rounded-lg p-3 mb-4">
              <p className="font-medium">Estimated Time: {orderDetails.actualTime}</p>
            </div>

            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>


        {/* Status Timeline */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? "bg-success text-success-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-sm text-muted-foreground">{step.time}</p>
                    )}
                  </div>
                  {step.completed && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Order Details</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{orderDetails.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Location */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary" />
              Pickup Location
            </h3>
            <div className="bg-accent/50 rounded-lg p-3">
              <p className="font-medium">{orderDetails.pickupLocation}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Show this order status to the canteen staff
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Contact canteen staff</p>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
        {orderStatus === "ready" ? (
          <Button
            variant="food"
            size="mobile"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Order Complete - Browse Menu
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="mobile"
              className="flex-1"
              onClick={() => navigate("/home")}
            >
              Browse Menu
            </Button>
            <Button
              variant="food"
              size="mobile"
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              Refresh Status
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}