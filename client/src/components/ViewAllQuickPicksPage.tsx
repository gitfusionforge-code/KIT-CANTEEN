import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Star, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "./BottomNavigation";

export default function ViewAllQuickPicksPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const quickPickItems = [
    { id: "1", name: "Veg Thali", price: 85, rating: 4.5, time: "15 min", category: "Meals" },
    { id: "2", name: "Masala Dosa", price: 60, rating: 4.3, time: "12 min", category: "South Indian" },
    { id: "3", name: "Chole Bhature", price: 70, rating: 4.6, time: "18 min", category: "North Indian" },
    { id: "4", name: "Pav Bhaji", price: 55, rating: 4.4, time: "10 min", category: "Street Food" },
    { id: "5", name: "Biryani", price: 120, rating: 4.7, time: "25 min", category: "Rice" },
    { id: "6", name: "Paneer Butter Masala", price: 95, rating: 4.5, time: "20 min", category: "Curry" },
    { id: "7", name: "Samosa (2 pcs)", price: 30, rating: 4.2, time: "5 min", category: "Snacks" },
    { id: "8", name: "Rajma Chawal", price: 75, rating: 4.3, time: "15 min", category: "Combo" },
    { id: "9", name: "Butter Chicken", price: 110, rating: 4.6, time: "22 min", category: "Non-Veg" },
    { id: "10", name: "Aloo Paratha", price: 50, rating: 4.4, time: "12 min", category: "Breakfast" }
  ];

  const filteredItems = quickPickItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: typeof quickPickItems[0]) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    toast({
      title: "Added to Cart",
      description: `${item.name} added to your cart`,
    });
  };

  const getCartQuantity = (itemId: string) => cart[itemId] || 0;

  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/home")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Quick Picks</h1>
              <p className="text-white/80 text-sm">Fast & delicious options</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search quick picks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-0 h-11 text-base"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Quick Picks ({filteredItems.length})</h2>
          {getTotalItems() > 0 && (
            <Button 
              variant="cart" 
              size="sm"
              onClick={() => navigate("/cart")}
              className="animate-fade-in"
            >
              Cart ({getTotalItems()})
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 hover-scale transition-transform duration-200"></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1 font-medium">{item.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">• {item.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-primary">₹{item.price}</p>
                      {getCartQuantity(item.id) > 0 ? (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setCart(prev => ({
                              ...prev,
                              [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                            }))}
                            className="w-8 h-8 p-0"
                          >
                            -
                          </Button>
                          <span className="font-semibold w-8 text-center">{getCartQuantity(item.id)}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="food" 
                          onClick={() => addToCart(item)}
                          className="mt-2 hover-scale animate-fade-in transition-all duration-300 hover:shadow-lg active:scale-95"
                        >
                          ADD
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found matching your search</p>
          </div>
        )}
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
}