import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Minus, Star, Clock } from "lucide-react";

export default function DishDetailPage() {
  const navigate = useNavigate();
  const { dishId } = useParams();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Mock dish data - in real app this would come from API/database
  const allDishes: Record<string, {
    id: number;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    description: string;
    prepTime: string;
    category: string;
    isVeg: boolean;
    calories: number;
    image: string;
  }> = {
    "1": { id: 1, name: "Veg Thali", price: 85, rating: 4.5, reviews: 128, description: "A complete meal with dal, rice, chapati, seasonal vegetable, pickle, and papad. Served with fresh salad and buttermilk.", prepTime: "15-20 mins", category: "Main Course", isVeg: true, calories: 450, image: "🍛" },
    "2": { id: 2, name: "Non-Veg Thali", price: 120, rating: 4.3, reviews: 95, description: "Delicious chicken curry with basmati rice, fresh chapati, dal, and traditional pickles. A hearty non-vegetarian meal.", prepTime: "20-25 mins", category: "Main Course", isVeg: false, calories: 520, image: "🍗" },
    "3": { id: 3, name: "South Indian Thali", price: 95, rating: 4.6, reviews: 156, description: "Authentic South Indian meal with sambar, rasam, coconut rice, curd, and traditional accompaniments.", prepTime: "18-22 mins", category: "South Indian", isVeg: true, calories: 380, image: "🥥" },
    "4": { id: 4, name: "Samosa", price: 20, rating: 4.2, reviews: 89, description: "Crispy golden pastry filled with spiced potatoes, peas, and aromatic herbs. Served with mint and tamarind chutney.", prepTime: "5 mins", category: "Snacks", isVeg: true, calories: 150, image: "🥟" },
    "5": { id: 5, name: "Grilled Sandwich", price: 40, rating: 4.0, reviews: 67, description: "Toasted bread with fresh vegetables, cheese, and special sauce. Grilled to perfection with crispy exterior.", prepTime: "8 mins", category: "Snacks", isVeg: true, calories: 280, image: "🥪" },
    "6": { id: 6, name: "Pakora", price: 30, rating: 4.4, reviews: 112, description: "Mixed vegetable fritters with onions, potatoes, and spices. Crispy outside, soft inside, served hot with chutney.", prepTime: "6 mins", category: "Snacks", isVeg: true, calories: 200, image: "🧅" },
    "7": { id: 7, name: "Masala Tea", price: 15, rating: 4.5, reviews: 203, description: "Traditional Indian spiced tea with cardamom, ginger, and aromatic spices. Brewed fresh and served hot.", prepTime: "3 mins", category: "Beverages", isVeg: true, calories: 50, image: "☕" },
    "8": { id: 8, name: "Filter Coffee", price: 20, rating: 4.2, reviews: 78, description: "South Indian style filter coffee with perfect blend of coffee powder and chicory. Rich, aromatic, and refreshing.", prepTime: "4 mins", category: "Beverages", isVeg: true, calories: 60, image: "☕" },
    "9": { id: 9, name: "Fresh Lime Soda", price: 25, rating: 4.3, reviews: 134, description: "Refreshing lime soda with fresh lime juice, soda water, and a hint of black salt. Perfect thirst quencher.", prepTime: "2 mins", category: "Beverages", isVeg: true, calories: 80, image: "🍋" },
    "10": { id: 10, name: "Thali + Drink Combo", price: 100, rating: 4.4, reviews: 87, description: "Veg Thali with your choice of any beverage from our menu. Complete meal deal with great savings.", prepTime: "18 mins", category: "Combos", isVeg: true, calories: 500, image: "🍽️" },
    "11": { id: 11, name: "Snack Combo", price: 60, rating: 4.1, reviews: 92, description: "Two delicious snacks of your choice paired with masala tea. Perfect for evening cravings.", prepTime: "10 mins", category: "Combos", isVeg: true, calories: 350, image: "🍴" },
    "12": { id: 12, name: "Rajma Chawal", price: 75, rating: 4.4, reviews: 145, description: "Kidney beans curry cooked in rich tomato gravy served with steamed basmati rice. Comfort food at its best.", prepTime: "15 mins", category: "Main Course", isVeg: true, calories: 400, image: "🍚" },
    "13": { id: 13, name: "Pav Bhaji", price: 55, rating: 4.5, reviews: 167, description: "Spiced mixed vegetable curry served with buttered bread rolls. Mumbai street food favorite.", prepTime: "12 mins", category: "Snacks", isVeg: true, calories: 320, image: "🍞" },
    "14": { id: 14, name: "Dosa", price: 50, rating: 4.3, reviews: 198, description: "Crispy South Indian crepe made from fermented rice and lentil batter. Served with sambar and coconut chutney.", prepTime: "10 mins", category: "South Indian", isVeg: true, calories: 250, image: "🥞" },
    "15": { id: 15, name: "Lassi", price: 30, rating: 4.6, reviews: 156, description: "Sweet yogurt drink blended with sugar and cardamom. Creamy, refreshing, and traditionally served chilled.", prepTime: "3 mins", category: "Beverages", isVeg: true, calories: 120, image: "🥛" },
    "16": { id: 16, name: "Cold Coffee", price: 35, rating: 4.4, reviews: 89, description: "Iced coffee with milk, sugar, and ice cream. Blended to perfection for coffee lovers.", prepTime: "5 mins", category: "Beverages", isVeg: true, calories: 140, image: "🥤" },
    "17": { id: 17, name: "South Special", price: 85, rating: 4.5, reviews: 123, description: "Dosa with sambar, coconut chutney, and filter coffee. Complete South Indian experience in one combo.", prepTime: "15 mins", category: "Combos", isVeg: true, calories: 320, image: "🌯" }
  };

  const dish = allDishes[dishId || "1"] || allDishes["1"];

  const addons = [
    { id: "extra-roti", name: "Extra Roti", price: 5 },
    { id: "extra-dal", name: "Extra Dal", price: 10 },
    { id: "pickle", name: "Mixed Pickle", price: 8 },
    { id: "papad", name: "Roasted Papad", price: 5 },
    { id: "buttermilk", name: "Fresh Buttermilk", price: 15 }
  ];

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
    navigate("/cart");
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
                navigate('/home');
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