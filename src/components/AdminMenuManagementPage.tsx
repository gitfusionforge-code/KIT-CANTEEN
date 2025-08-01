import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Image,
  Save,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function AdminMenuManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock menu items data
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Veg Thali",
      category: "Lunch",
      price: 50,
      description: "Complete vegetarian meal with rice, dal, vegetables, chapati",
      available: true,
      canteen: "Main Hall",
      image: "/placeholder.svg",
      popularity: 85,
      rating: 4.5,
      orders: 234,
      ingredients: ["Rice", "Dal", "Vegetables", "Chapati"],
      nutritionInfo: { calories: 450, protein: 15, carbs: 65, fat: 12 }
    },
    {
      id: 2,
      name: "Chicken Curry",
      category: "Lunch",
      price: 80,
      description: "Spicy chicken curry with rice",
      available: true,
      canteen: "Food Court",
      image: "/placeholder.svg",
      popularity: 92,
      rating: 4.7,
      orders: 189,
      ingredients: ["Chicken", "Rice", "Spices", "Onions"],
      nutritionInfo: { calories: 520, protein: 28, carbs: 45, fat: 18 }
    },
    {
      id: 3,
      name: "Masala Dosa",
      category: "Breakfast",
      price: 60,
      description: "Crispy dosa with spiced potato filling",
      available: false,
      canteen: "South Wing",
      image: "/placeholder.svg",
      popularity: 78,
      rating: 4.3,
      orders: 156,
      ingredients: ["Rice Batter", "Potatoes", "Spices", "Coconut Chutney"],
      nutritionInfo: { calories: 350, protein: 8, carbs: 55, fat: 10 }
    },
    {
      id: 4,
      name: "Coffee",
      category: "Beverages",
      price: 20,
      description: "Hot freshly brewed coffee",
      available: true,
      canteen: "Café Corner",
      image: "/placeholder.svg",
      popularity: 95,
      rating: 4.6,
      orders: 445,
      ingredients: ["Coffee Beans", "Milk", "Sugar"],
      nutritionInfo: { calories: 80, protein: 3, carbs: 12, fat: 2 }
    },
    {
      id: 5,
      name: "Biryani",
      category: "Lunch",
      price: 150,
      description: "Aromatic basmati rice with tender meat",
      available: true,
      canteen: "Premium Section",
      image: "/placeholder.svg",
      popularity: 88,
      rating: 4.8,
      orders: 123,
      ingredients: ["Basmati Rice", "Meat", "Saffron", "Spices"],
      nutritionInfo: { calories: 650, protein: 32, carbs: 78, fat: 22 }
    }
  ]);

  const categories = ["all", "Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Desserts"];

  const toggleAvailability = (id: number) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const updatePrice = (id: number, newPrice: number) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, price: newPrice } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setMenuItems(items => items.filter(item => item.id !== id));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPopularityTrend = (popularity: number) => {
    if (popularity >= 85) return { icon: TrendingUp, color: "text-success" };
    if (popularity <= 60) return { icon: TrendingDown, color: "text-destructive" };
    return { icon: TrendingUp, color: "text-warning" };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Manage menu items across all canteens</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Bulk Actions</span>
          </Button>
          <Button variant="food" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="p-2 border rounded-md bg-background"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const trendInfo = getPopularityTrend(item.popularity);
          const TrendIcon = trendInfo.icon;
          
          return (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    {item.available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.available ? "Available" : "Unavailable"}</span>
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.canteen}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-success">₹{item.price}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-semibold">{item.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{item.orders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <TrendIcon className={`w-4 h-4 ${trendInfo.color}`} />
                    <span className="text-lg font-semibold">{item.popularity}%</span>
                  </div>
                </div>

                {/* Quick Price Edit */}
                <div className="space-y-2">
                  <Label htmlFor={`price-${item.id}`}>Price (₹)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      value={item.price}
                      onChange={(e) => updatePrice(item.id, parseInt(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <Button size="sm" variant="outline">
                      <Save className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor={`available-${item.id}`}>Available</Label>
                  <Switch
                    id={`available-${item.id}`}
                    checked={item.available}
                    onCheckedChange={() => toggleAvailability(item.id)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Image className="w-3 h-3 mr-1" />
                    Image
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No menu items found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}