import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ChefHat, Package, Phone, ArrowLeft } from "lucide-react";
import JsBarcode from 'jsbarcode';
import { formatOrderIdDisplay } from "@shared/utils";
import type { Order } from '@shared/schema';

// Real Barcode Generator Component using JsBarcode library
const BarcodeGenerator = ({ orderId }: { orderId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        // Generate a proper Code 128 barcode
        JsBarcode(canvasRef.current, orderId, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: true,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 10,
          fontSize: 14,
          textAlign: "center",
          textPosition: "bottom"
        });
      } catch (error) {
        // Barcode generation failed - fallback to text display
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
          canvas.width = 250;
          canvas.height = 80;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#000000';
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`Order: ${orderId}`, canvas.width/2, canvas.height/2);
        }
      }
    }
  }, [orderId]);

  return (
    <canvas 
      ref={canvasRef}
      className="mx-auto"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default function OrderStatusPage() {
  const [, setLocation] = useLocation();
  const { orderId } = useParams();

  // Fetch real order data from API with short cache time for real-time updates
  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    staleTime: 0, // Always fetch fresh data
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Find the specific order by ID, order number, or barcode (supporting both old and new formats)
  const order = orders.find(o => 
    o.id.toString() === orderId || 
    o.orderNumber === orderId ||
    o.barcode === orderId
  );

  const orderStatus = order?.status as "preparing" | "ready" | "completed" | "delivered" || "preparing";
  
  // Calculate progress based on order status - memoized to prevent infinite loops
  const progress = useMemo(() => {
    switch (orderStatus) {
      case "preparing": return 33;
      case "ready": return 66;
      case "completed": return 100;
      case "delivered": return 100;
      default: return 33;
    }
  }, [orderStatus]);

  const orderDetails = order ? {
    id: order.barcode, // Use barcode as the primary ID for consistency
    orderNumber: order.orderNumber, // Keep order number for reference
    items: JSON.parse(order.items || '[]') as Array<{id: number, name: string, price: number, quantity: number}>,
    total: order.amount,
    estimatedTime: `${order.estimatedTime || 15} mins`,
    actualTime: orderStatus === "ready" ? `${order.estimatedTime || 15} mins` : `${order.estimatedTime || 15} mins`,
    pickupLocation: "KIT College Main Canteen, Ground Floor"
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order || !orderDetails) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">Order not found</div>
          <Button onClick={() => setLocation("/orders")} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }


  const statusSteps = [
    {
      status: "placed",
      label: "Order Placed",
      icon: CheckCircle,
      completed: true,
      time: order ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""
    },
    {
      status: "preparing",
      label: "Preparing",
      icon: ChefHat,
      completed: orderStatus === "preparing" || orderStatus === "ready" || orderStatus === "completed" || orderStatus === "delivered",
      time: orderStatus === "preparing" || orderStatus === "ready" || orderStatus === "completed" || orderStatus === "delivered" ? 
        order ? new Date(new Date(order.createdAt).getTime() + 3 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "" : ""
    },
    {
      status: "ready",
      label: "Ready for Pickup",
      icon: Package,
      completed: orderStatus === "ready" || orderStatus === "completed" || orderStatus === "delivered",
      time: orderStatus === "ready" || orderStatus === "completed" || orderStatus === "delivered" ? 
        order ? new Date(new Date(order.createdAt).getTime() + (order.estimatedTime || 15) * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "" : ""
    },
    {
      status: "delivered",
      label: "Order Delivered",
      icon: CheckCircle,
      completed: orderStatus === "delivered",
      time: orderStatus === "delivered" && order?.deliveredAt ? 
        new Date(order.deliveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""
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
                setLocation('/orders');
              }
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Order Status</h1>
          <p className="text-white/80">
            Order #{(() => {
              const formatted = formatOrderIdDisplay(orderDetails.orderNumber);
              return (
                <>
                  {formatted.prefix}
                  <span className="bg-white/20 text-white font-bold px-1 rounded">
                    {formatted.suffix}
                  </span>
                </>
              );
            })()}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Order Barcode */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary" />
              Order Barcode
            </h3>
            <div className="bg-accent/50 rounded-lg p-4 text-center">
              {/* Real Code 128 Barcode using JsBarcode library */}
              <div className="bg-white p-4 rounded-lg inline-block mb-3 border-2 border-gray-200">
                <BarcodeGenerator orderId={orderDetails.id} />
              </div>
              <p className="font-bold text-lg mb-1">Order ID: {orderDetails.id}</p>
              <p className="text-sm text-muted-foreground">
                Scannable Code 128 barcode for quick order verification
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {orderStatus === "preparing" && <ChefHat className="w-10 h-10 text-warning" />}
              {orderStatus === "ready" && <Package className="w-10 h-10 text-success" />}
              {orderStatus === "completed" && <CheckCircle className="w-10 h-10 text-success" />}
            </div>
            
            <h2 className="text-xl font-bold mb-2">
              {orderStatus === "preparing" && "Preparing Your Order"}
              {orderStatus === "ready" && "Ready for Pickup!"}
              {orderStatus === "completed" && "Order Completed!"}
            </h2>
            
            <p className="text-muted-foreground mb-4">
              {orderStatus === "preparing" && "Our chef is preparing your delicious meal"}
              {orderStatus === "ready" && "Your order is ready! Please collect from the canteen counter"}
              {orderStatus === "completed" && "Your order has been completed. Thank you for your visit!"}
            </p>



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
                Present the barcode above for quick order verification
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
        {orderStatus === "delivered" ? (
          <Button
            variant="food"
            size="mobile"
            className="w-full"
            onClick={() => setLocation("/home")}
          >
            Order Delivered - Browse Menu
          </Button>
        ) : orderStatus === "ready" ? (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="mobile"
              className="flex-1"
              onClick={() => setLocation("/home")}
            >
              Browse Menu
            </Button>
            <Button
              variant="food"
              size="mobile"
              className="flex-1"
              disabled
            >
              Ready for Pickup
            </Button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="mobile"
              className="flex-1"
              onClick={() => setLocation("/home")}
            >
              Browse Menu
            </Button>
            <Button
              variant="food"
              size="mobile"
              className="flex-1"
              onClick={() => refetch()}
            >
              Refresh Status
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}