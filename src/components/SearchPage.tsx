import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star } from "lucide-react";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const allItems = [
    { id: 1, name: "Veg Thali", price: 85, rating: 4.5, category: "Main Course", isVeg: true },
    { id: 2, name: "Masala Dosa", price: 60, rating: 4.3, category: "South Indian", isVeg: true },
    { id: 3, name: "Chole Bhature", price: 70, rating: 4.6, category: "North Indian", isVeg: true },
    { id: 4, name: "Samosa", price: 20, rating: 4.2, category: "Snacks", isVeg: true },
    { id: 5, name: "Masala Tea", price: 15, rating: 4.5, category: "Beverages", isVeg: true },
    { id: 6, name: "Sandwich", price: 40, rating: 4.0, category: "Snacks", isVeg: true },
    { id: 7, name: "Coffee", price: 20, rating: 4.2, category: "Beverages", isVeg: true },
    { id: 8, name: "Pakora", price: 30, rating: 4.4, category: "Snacks", isVeg: true }
  ];

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularSearches = ["Thali", "Dosa", "Tea", "Snacks", "South Indian"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="w-full pl-10 bg-white text-foreground"
              placeholder="Search for food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Popular Searches */}
        {!searchQuery && (
          <div>
            <h3 className="font-semibold mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Badge
                  key={term}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div>
            <h3 className="font-semibold mb-3">
              {filteredItems.length} results for "{searchQuery}"
            </h3>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/dish/${item.id}`, { state: { from: '/search' } })}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.isVeg && (
                            <div className="w-4 h-4 border-2 border-green-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{item.price}</p>
                        <Button size="sm" className="mt-2">
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && filteredItems.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try searching for something else or browse our menu
            </p>
            <Button className="mt-4" onClick={() => navigate("/home")}>
              Browse Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}