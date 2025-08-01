import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Minus, Star, Clock } from "lucide-react";

export default function DishDetailPage() {
  const [, setLocation] = useLocation();
  const { dishId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // This component will be populated with real dish data from the database
  const allDishes: Record<string, any> = {}; // Will be fetched from actual menu items when menu system is implemented

  const dish = allDishes[dishId || "1"] || { 
    id: 0, 
    name: "Dish Not Found", 
    price: 0, 
    rating: 0, 
    reviews: 0, 
    description: "This dish is not available in our menu.", 
    prepTime: "N/A", 
    category: "N/A", 
    isVeg: true, 
    calories: 0, 
    image: "🍽️" 
  };

  const addons: any[] = []; // Will be populated from actual addon data when menu addon system is implemented

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getAddonPrice = () => {
    return selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
  };

  const totalPrice = (dish.price + getAddonPrice()) * quantity;

  const handleAddToCart = () => {
    // In real app, this would update cart state/context
    setLocation("/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              // Use browser's back functionality, but with fallback
              if (window.history.length > 1) {
                window.history.back();
              } else {
                setLocation('/home');
              }
            }}
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Dish Image */}
        <div className="w-full h-80 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          <span className="text-8xl">{dish.image}</span>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Dish Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold">{dish.name}</h1>
                <div className={`w-4 h-4 rounded border-2 ${dish.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'} m-0.5`}></div>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">{dish.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">₹{dish.price}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{dish.rating}</span>
              <span className="text-muted-foreground">({dish.reviews} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{dish.prepTime}</span>
            </div>
            <Badge variant="outline">{dish.calories} cal</Badge>
          </div>
        </div>

        {/* Add-ons */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Add-ons</h3>
            <div className="space-y-3">
              {addons.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="rounded border-gray-300"
                    />
                    <span>{addon.name}</span>
                  </div>
                  <span className="font-medium">+₹{addon.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quantity and Add to Cart */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">Quantity</p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold text-lg min-w-[30px] text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">₹{totalPrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          variant="food"
          size="mobile"
          className="w-full"
          onClick={handleAddToCart}
        >
          Add to Cart • ₹{totalPrice}
        </Button>
      </div>
    </div>
  );
}