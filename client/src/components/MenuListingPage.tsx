import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Star, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "./BottomNavigation";

export default function MenuListingPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/menu/:category");
  const category = params?.category;
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const menuItems = {
    meals: [
      { id: 1, name: "Veg Thali", price: 85, rating: 4.5, description: "Dal, Rice, Chapati, Sabzi, Pickle", isVeg: true, available: true, image: "🍛", prepTime: "15-20 mins", calories: 450 },
      { id: 2, name: "Non-Veg Thali", price: 120, rating: 4.3, description: "Chicken Curry, Rice, Chapati, Dal", isVeg: false, available: true, image: "🍗", prepTime: "20-25 mins", calories: 520 },
      { id: 3, name: "South Indian Thali", price: 95, rating: 4.6, description: "Sambar, Rice, Rasam, Curd", isVeg: true, available: true, image: "🥥", prepTime: "18-22 mins", calories: 380 },
      { id: 12, name: "Rajma Chawal", price: 75, rating: 4.4, description: "Kidney beans curry with steamed rice", isVeg: true, available: true, image: "🍚", prepTime: "15 mins", calories: 400 },
    ],
    snacks: [
      { id: 4, name: "Samosa", price: 20, rating: 4.2, description: "Crispy fried pastry with spiced filling", isVeg: true, available: true, image: "🥟", prepTime: "5 mins", calories: 150 },
      { id: 5, name: "Grilled Sandwich", price: 40, rating: 4.0, description: "Grilled vegetable sandwich", isVeg: true, available: true, image: "🥪", prepTime: "8 mins", calories: 280 },
      { id: 6, name: "Pakora", price: 30, rating: 4.4, description: "Mixed vegetable fritters", isVeg: true, available: true, image: "🧅", prepTime: "6 mins", calories: 200 },
      { id: 13, name: "Pav Bhaji", price: 55, rating: 4.5, description: "Spiced vegetable curry with bread", isVeg: true, available: true, image: "🍞", prepTime: "12 mins", calories: 320 },
      { id: 14, name: "Dosa", price: 50, rating: 4.3, description: "Crispy South Indian crepe", isVeg: true, available: true, image: "🥞", prepTime: "10 mins", calories: 250 },
    ],
    beverages: [
      { id: 7, name: "Masala Tea", price: 15, rating: 4.5, description: "Traditional spiced tea", isVeg: true, available: true, image: "☕", prepTime: "3 mins", calories: 50 },
      { id: 8, name: "Filter Coffee", price: 20, rating: 4.2, description: "Fresh brewed filter coffee", isVeg: true, available: true, image: "☕", prepTime: "4 mins", calories: 60 },
      { id: 9, name: "Fresh Lime Soda", price: 25, rating: 4.3, description: "Refreshing lime soda", isVeg: true, available: true, image: "🍋", prepTime: "2 mins", calories: 80 },
      { id: 15, name: "Lassi", price: 30, rating: 4.6, description: "Sweet yogurt drink", isVeg: true, available: true, image: "🥛", prepTime: "3 mins", calories: 120 },
      { id: 16, name: "Cold Coffee", price: 35, rating: 4.4, description: "Iced coffee with milk", isVeg: true, available: true, image: "🥤", prepTime: "5 mins", calories: 140 },
    ],
    combos: [
      { id: 10, name: "Thali + Drink Combo", price: 100, rating: 4.4, description: "Veg Thali with any beverage", isVeg: true, available: true, image: "🍽️", prepTime: "18 mins", calories: 500 },
      { id: 11, name: "Snack Combo", price: 60, rating: 4.1, description: "2 snacks + masala tea", isVeg: true, available: true, image: "🍴", prepTime: "10 mins", calories: 350 },
      { id: 17, name: "South Special", price: 85, rating: 4.5, description: "Dosa + Sambar + Coffee", isVeg: true, available: true, image: "🌯", prepTime: "15 mins", calories: 320 },
    ]
  };

  const getAllItems = () => {
    return Object.values(menuItems).flat();
  };

  const items = category === "all" ? getAllItems() : menuItems[category as keyof typeof menuItems] || [];
  const filteredItems = items.filter(item => 
    filter === "all" || (filter === "veg" && item.isVeg) || (filter === "non-veg" && !item.isVeg)
  );

  const addToCart = (item: typeof items[0]) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    toast({
      title: "Added to Cart",
      description: `${item.name} added to your cart`,
    });
  };

  const getCartQuantity = (itemId: number) => cart[itemId] || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold capitalize">{category}</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mt-4">
          {[
            { id: "all", label: "All" },
            { id: "veg", label: "Veg" },
            { id: "non-veg", label: "Non-Veg" }
          ].map((filterOption) => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.id as any)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="shadow-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dish/${item.id}`, { state: { from: `/menu/${category}` } })}>
            <CardContent className="p-0">
              <div className="flex">
                {/* Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0 rounded-l-lg flex items-center justify-center text-3xl">
                  {item.image}
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className={`w-3 h-3 rounded border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'} m-0.5`}></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{item.rating}</span>
                      </div>
                      {!item.available && (
                        <Badge variant="destructive">Not Available</Badge>
                      )}
                    </div>
                    
                    {getCartQuantity(item.id) > 0 ? (
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCart(prev => ({
                              ...prev,
                              [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                            }));
                          }}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <span className="font-semibold w-8 text-center">{getCartQuantity(item.id)}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="w-8 h-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="food"
                        size="sm"
                        disabled={!item.available}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
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

      <BottomNavigation currentPage="menu" />
    </div>
  );
}