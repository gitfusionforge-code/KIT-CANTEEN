import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Receipt, 
  Star,
  User,
  Phone,
  CreditCard
} from "lucide-react";

export default function OrderDetailPage() {
  const [, setLocation] = useLocation();
  const { orderId } = useParams();

  // Mock order data - in real app, fetch based on orderId
  const orderDetails = {
    id: orderId || "12344",
    status: "completed",
    placedAt: "Yesterday, 1:15 PM",
    deliveredAt: "Yesterday, 1:35 PM",
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
        isVeg: true
      },
      {
        id: 2,
        name: "Filter Coffee",
        quantity: 1,
        price: 20,
        total: 20,
        image: "☕",
        isVeg: true
      }
    ],
    restaurant: {
      name: "Main Canteen",
      address: "Ground Floor, Academic Block"
    },
    customer: {
      name: "Rahul Kumar",
      phone: "+91 98765 43210"
    },
    payment: {
      method: "UPI",
      transactionId: "TXN123456789"
    },
    rating: 4.5,
    feedback: "Great food and quick service!"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-warning text-warning-foreground";
      case "ready": return "bg-success text-success-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      case "delivered": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => {
            // Use browser's back functionality, but with fallback
            if (window.history.length > 1) {
              window.history.back();
            } else {
              setLocation('/orders');
            }
          }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Order Details</h1>
            <p className="text-sm text-muted-foreground">Order #{orderDetails.id}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Status */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(orderDetails.status)}>
                  {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">₹{orderDetails.total}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Placed: {orderDetails.placedAt}</span>
              </div>
              {orderDetails.deliveredAt && (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-success" />
                  <span>Delivered: {orderDetails.deliveredAt}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Order Items
            </h2>
            
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-lg">
                    {item.image}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className={`w-3 h-3 rounded border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'} m-0.5`}></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">₹{item.price} x {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">₹{item.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bill Details */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Bill Details</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{orderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges</span>
                <span>₹{orderDetails.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{orderDetails.deliveryFee}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{orderDetails.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Details */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Restaurant Details
            </h2>
            
            <div>
              <h3 className="font-medium">{orderDetails.restaurant.name}</h3>
              <p className="text-sm text-muted-foreground">{orderDetails.restaurant.address}</p>
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
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{orderDetails.customer.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{orderDetails.customer.phone}</span>
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
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium">{orderDetails.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="text-sm text-muted-foreground">{orderDetails.payment.transactionId}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating & Feedback */}
        {orderDetails.status === "completed" && orderDetails.rating && (
          <Card className="shadow-card">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Your Rating & Feedback
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= orderDetails.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{orderDetails.rating}/5</span>
                </div>
                {orderDetails.feedback && (
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    "{orderDetails.feedback}"
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button 
            variant="food"
            size="mobile"
            className="w-full"
            onClick={() => setLocation(`/reorder?orderId=${orderDetails.id}`)}
          >
            Reorder
          </Button>
          
          {orderDetails.status === "completed" && !orderDetails.rating && (
            <Button 
              variant="outline"
              size="mobile"
              className="w-full"
              onClick={() => setLocation(`/rate-review?orderId=${orderDetails.id}`)}
            >
              Rate & Review
            </Button>
          )}
          
          <Button 
            variant="outline"
            size="mobile"
            className="w-full"
            onClick={() => setLocation('/help-support')}
          >
            Get Help
          </Button>
        </div>
      </div>
    </div>
  );
}