import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Star, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "./BottomNavigation";
import type { MenuItem, Category } from "@shared/schema";

export default function MenuListingPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/menu/:category");
  const category = params?.category;
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [cart, setCart] = useState<{[key: string]: number}>({});

  // Fetch categories and menu items from database
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      return response.json();
    },
  });

  const { data: menuItems = [], isLoading: menuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
    queryFn: async () => {
      const response = await fetch('/api/menu');
      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.status}`);
      }
      return response.json();
    },
  });

  const isLoading = categoriesLoading || menuItemsLoading;

  // Filter items by category if specified
  const getCategoryItems = () => {
    if (category === "all") return menuItems;
    
    const categoryData = categories.find(cat => 
      cat.name.toLowerCase() === category?.toLowerCase()
    );
    
    if (!categoryData) return [];
    
    return menuItems.filter(item => item.categoryId === categoryData.id);
  };

  const items = getCategoryItems();
  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    // Note: For now treating all items as veg since we don't have isVeg field in schema
    // This can be extended when the schema includes vegetarian/non-vegetarian classification
    return true;
  });

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Menu Items */}
      {!isLoading && (
        <div className="p-4 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items found in this category</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="shadow-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation(`/dish/${item.id}`, { state: { from: `/menu/${category}` } })}>
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0 rounded-l-lg flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            <div className="w-3 h-3 rounded border-2 border-green-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-600 m-0.5"></div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description || "Delicious item from our menu"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{item.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm ml-1">4.5</span>
                          </div>
                          {!item.available && (
                            <Badge variant="destructive">Not Available</Badge>
                          )}
                          {item.stock <= 5 && item.stock > 0 && (
                            <Badge variant="outline">Limited Stock</Badge>
                          )}
                          {item.stock === 0 && (
                            <Badge variant="destructive">Out of Stock</Badge>
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
                            disabled={!item.available || item.stock === 0}
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
            ))
          )}
        </div>
      )}

      <BottomNavigation currentPage="menu" />
    </div>
  );
}