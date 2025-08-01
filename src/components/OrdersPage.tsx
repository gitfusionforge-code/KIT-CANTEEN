import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Package, Star } from "lucide-react";
import BottomNavigation from "./BottomNavigation";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const activeOrders = [
    {
      id: "12345",
      items: ["Veg Thali x2", "Masala Tea x1"],
      total: 194,
      time: "2:30 PM",
      status: "preparing",
      estimatedTime: "5 mins left"
    }
  ];

  const completedOrders = [
    {
      id: "12344",
      items: ["Samosa x2", "Coffee x1"],
      total: 60,
      time: "Yesterday, 1:15 PM",
      status: "completed",
      rating: 4.5
    },
    {
      id: "12343",
      items: ["Chole Bhature x1", "Lassi x1"],
      total: 95,
      time: "2 days ago, 12:45 PM",
      status: "completed",
      rating: 4.2
    },
    {
      id: "12342",
      items: ["Dosa x1", "Filter Coffee x1"],
      total: 75,
      time: "3 days ago, 2:20 PM",
      status: "completed",
      rating: 4.8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-warning";
      case "ready": return "bg-success";
      case "completed": return "bg-muted";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-4">
          {[
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {activeTab === "active" ? (
          <div className="space-y-4">
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="shadow-card cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/order-status/${order.id}`, { state: { from: '/orders' } })}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.time}</p>
                      </div>
                      <p className="font-bold text-lg">₹{order.total}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm">{item}</p>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{order.estimatedTime}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/order-status/${order.id}`, { state: { from: '/orders' } })}
                      >
                        Track Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Active Orders</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any active orders right now
                </p>
                <Button variant="food" onClick={() => navigate("/home")}>
                  Order Now
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <Card 
                key={order.id} 
                className="shadow-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/order-detail/${order.id}`, { state: { from: '/orders' } })}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.time}</p>
                    </div>
                    <p className="font-bold text-lg">₹{order.total}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm">{item}</p>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{order.rating}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Reorder button clicked, navigating to:', `/reorder?orderId=${order.id}`);
                          navigate(`/reorder?orderId=${order.id}`);
                        }}
                      >
                        Reorder
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Rate & Review button clicked, navigating to:', `/rate-review?orderId=${order.id}`);
                          navigate(`/rate-review?orderId=${order.id}`);
                        }}
                      >
                        Rate & Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentPage="orders" />
    </div>
  );
}