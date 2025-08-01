import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, Filter, Utensils, Coffee, Cookie, Pizza, Star, Clock, Flame, ThumbsUp, Users, Zap, ChefHat, Heart } from "lucide-react";
import BottomNavigation from "./BottomNavigation";
export default function HomeScreen() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState("delivery");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{
    [key: string]: number;
  }>({});
  const categories = [{
    name: "Meals",
    icon: Utensils,
    color: "bg-orange-500",
    route: "/menu/meals"
  }, {
    name: "Snacks",
    icon: Cookie,
    color: "bg-yellow-500",
    route: "/menu/snacks"
  }, {
    name: "Beverages",
    icon: Coffee,
    color: "bg-blue-500",
    route: "/menu/beverages"
  }, {
    name: "Combos",
    icon: Pizza,
    color: "bg-purple-500",
    route: "/menu/combos"
  }];
  const trendingItems = [{
    id: "t1",
    name: "Butter Chicken",
    price: 180,
    rating: 4.8,
    orders: "500+ orders",
    trend: "+15%"
  }, {
    id: "t2",
    name: "Paneer Tikka",
    price: 150,
    rating: 4.7,
    orders: "300+ orders",
    trend: "+23%"
  }, {
    id: "t3",
    name: "Chicken Biryani",
    price: 220,
    rating: 4.9,
    orders: "800+ orders",
    trend: "+8%"
  }];
  const reviews = [{
    name: "Priya S.",
    rating: 5,
    comment: "Amazing food quality! Always fresh and delicious.",
    avatar: "👩"
  }, {
    name: "Rahul K.",
    rating: 5,
    comment: "Fast delivery and great taste. Highly recommended!",
    avatar: "👨"
  }, {
    name: "Anita M.",
    rating: 4,
    comment: "Good variety and reasonable prices.",
    avatar: "👩‍🦱"
  }];
  const quickStats = [{
    icon: Clock,
    label: "15 min",
    sublabel: "Avg delivery"
  }, {
    icon: Users,
    label: "10K+",
    sublabel: "Happy customers"
  }, {
    icon: ChefHat,
    label: "50+",
    sublabel: "Menu items"
  }, {
    icon: Star,
    label: "4.8",
    sublabel: "Average rating"
  }];
  return <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-white" />
            <div>
              <p className="text-white font-medium">KIT College</p>
              <p className="text-white/80 text-sm">Main Canteen</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search food or snacks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => navigate('/search')} className="pl-10 bg-white border-0 h-11 text-base cursor-pointer" readOnly />
        </div>
      </div>

      {/* Section tabs */}
      

      <div className="px-4 py-6 space-y-8">

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl gradient-hero shadow-hero animate-fade-in">
          <div className="p-6 text-white relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome to KIT Canteen!</h1>
                <p className="text-white/90 mb-4">Delicious meals, quick delivery</p>
                <Button variant="ghost" size="hero" className="glass-effect text-white border-white/30 hover:bg-white/20" onClick={() => navigate("/menu")}>
                  <Utensils className="w-5 h-5 mr-2" />
                  Explore Menu
                </Button>
              </div>
              <div className="text-6xl opacity-20">🍽️</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 animate-fade-in">
          {quickStats.map((stat, index) => <div key={index} className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-sm">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
            </div>)}
        </div>

        {/* Food Categories */}
        <div className="animate-slide-up">
          <h2 className="text-lg font-bold mb-3">What would you like to have?</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category, index) => <div key={category.name} className="flex flex-col items-center p-3 rounded-xl hover-scale transition-all duration-300 cursor-pointer animate-fade-in hover:bg-accent/50" style={{
            animationDelay: `${index * 0.1}s`
          }} onClick={() => navigate(category.route)}>
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mb-2 shadow-md`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-sm text-center leading-tight">{category.name}</h3>
              </div>)}
          </div>
        </div>

        {/* Trending Now */}
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Flame className="w-5 h-5 mr-2 text-orange-500" />
              Trending Now
            </h2>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/trending")}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {trendingItems.map((item, index) => <Card key={item.id} className="shadow-card hover-scale transition-all duration-300">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        🔥 {item.trend}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{item.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">• {item.orders}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">₹{item.price}</p>
                    <Button size="sm" variant="food" className="mt-1 hover-scale animate-fade-in transition-all duration-300" onClick={() => {
                  setCart(prev => ({
                    ...prev,
                    [item.id]: (prev[item.id] || 0) + 1
                  }));
                  toast({
                    title: "Added to Cart",
                    description: `${item.name} added to your cart`
                  });
                }}>
                      ADD
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Quick picks */}
        <div className="animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Quick Picks</h2>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/quick-picks")}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {[{
            id: "1",
            name: "Veg Thali",
            price: 85,
            rating: 4.5,
            time: "15 min"
          }, {
            id: "2",
            name: "Masala Dosa",
            price: 60,
            rating: 4.3,
            time: "12 min"
          }, {
            id: "3",
            name: "Chole Bhature",
            price: 70,
            rating: 4.6,
            time: "18 min"
          }].map((item, index) => {
            const addToCart = () => {
              setCart(prev => ({
                ...prev,
                [item.id]: (prev[item.id] || 0) + 1
              }));
              toast({
                title: "Added to Cart",
                description: `${item.name} added to your cart`
              });
            };
            return <Card key={index} className="shadow-card hover-scale transition-all duration-300">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{item.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">• {item.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{item.price}</p>
                    <Button size="sm" variant="food" className="mt-1 hover-scale animate-fade-in transition-all duration-300 hover:shadow-lg active:scale-95" onClick={addToCart}>
                      ADD
                    </Button>
                  </div>
                </CardContent>
              </Card>;
          })}
          </div>
        </div>

        {/* Customer Reviews */}
        

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-white text-center animate-pulse-glow">
          <Heart className="w-12 h-12 mx-auto mb-3 animate-bounce-in" />
          <h3 className="text-xl font-bold mb-2">Love What You See?</h3>
          <p className="text-white/90 mb-4">Join thousands of happy customers at KIT Canteen</p>
          <Button variant="ghost" size="hero" className="glass-effect text-white border-white/30 hover:bg-white/20" onClick={() => navigate("/favorites")}>
            <Heart className="w-5 h-5 mr-2" />
            Add to Favorites
          </Button>
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>;
}