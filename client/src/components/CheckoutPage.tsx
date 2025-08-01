import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, MapPin, CreditCard, Wallet, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [estimatedTime, setEstimatedTime] = useState("15-20 mins");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes in seconds
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const paymentValidRef = useRef(false);

  const orderItems = [
    { name: "Veg Thali", quantity: 2, price: 170 },
    { name: "Masala Tea", quantity: 1, price: 15 }
  ];

  const subtotal = 185;
  const tax = 9;
  const total = 194;

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // Timer expired
      handleTimerExpiry();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerActive, timeLeft]);

  const handleTimerExpiry = () => {
    setIsTimerActive(false);
    setPaymentInProgress(false);
    paymentValidRef.current = false;
    
    toast({
      title: "Payment Session Expired",
      description: "Please try again to complete your order.",
      variant: "destructive",
    });
    
    setLocation('/retry-payment');
  };

  const startPaymentTimer = () => {
    setIsTimerActive(true);
    setPaymentInProgress(true);
    paymentValidRef.current = true;
    setTimeLeft(420); // Reset to 7 minutes
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlaceOrder = () => {
    // Start the timer
    startPaymentTimer();
    
    const options = {
      key: "rzp_test_uKo2E3dcFizVIW", // Razorpay test key
      amount: total * 100, // Amount in paise
      currency: "INR",
      name: "KIT College Canteen",
      description: "Food Order Payment",
      image: "/favicon.ico",
      order_id: "", // This should come from your backend
      handler: function (response: any) {
        // Payment successful - stop timer immediately
        setIsTimerActive(false);
        setPaymentInProgress(false);
        
        console.log("Payment successful:", response);
        toast({
          title: "Payment Successful",
          description: "Your order has been confirmed!",
        });
        setLocation("/order-status/12345");
      },
      prefill: {
        name: "Student Name",
        email: "student@kit.ac.in",
        contact: "9999999999"
      },
      notes: {
        address: "KIT College Campus"
      },
      theme: {
        color: "#3B82F6"
      },
      modal: {
        ondismiss: function() {
          console.log("Payment cancelled");
          setIsTimerActive(false);
          setPaymentInProgress(false);
          paymentValidRef.current = false;
        }
      }
    };

    // Check if Razorpay is loaded
    if (!(window as any).Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment service is not available. Please try again later.",
        variant: "destructive"
      });
      setIsTimerActive(false);
      setPaymentInProgress(false);
      paymentValidRef.current = false;
      return;
    }

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
      setIsTimerActive(false);
      setPaymentInProgress(false);
      paymentValidRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/cart')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Payment Timer */}
        {isTimerActive && (
          <Card className="shadow-card border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Timer className="w-5 h-5 mr-2 text-destructive" />
                  <span className="font-semibold text-destructive">Payment Timer</span>
                </div>
                <div className="text-2xl font-bold text-destructive">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete your payment within the time limit to confirm your order
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium">₹{item.price}</span>
                </div>
              ))}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Payment Options */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary" />
              Payment Method
            </h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">UPI Payment</p>
                        <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                  </Label>
                  <span className="bg-success text-success-foreground px-2 py-1 rounded text-xs font-medium">
                    Recommended
                  </span>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Order Instructions */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <h4 className="font-medium text-warning-foreground mb-2">📋 Order Instructions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Please bring your student ID for verification</li>
                <li>• Orders are prepared fresh, slight delays may occur during peak hours</li>
                <li>• Check order details carefully before leaving the counter</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Place Order Button */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <Button
          variant="food"
          size="mobile"
          className="w-full"
          onClick={handlePlaceOrder}
        >
          Confirm Order • ₹{total}
        </Button>
      </div>
    </div>
  );
}