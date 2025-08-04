import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem, Category } from "@shared/schema";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Loader2
} from "lucide-react";

export default function AdminMenuManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // Fetch real data from database with enhanced synchronization
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: menuItems = [], isLoading: menuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
    staleTime: 1000 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const isLoading = categoriesLoading || menuItemsLoading;

  // Enhanced mutations with comprehensive synchronization
  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MenuItem> }) => {
      return apiRequest(`/api/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      // Invalidate all related queries for real-time sync across dashboards
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({ title: "Menu item updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update menu item", variant: "destructive" });
    }
  });

  // Delete menu item mutation with enhanced sync
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/menu/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      // Comprehensive cache invalidation for all dashboards
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({ title: "Menu item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete menu item", variant: "destructive" });
    }
  });

  const toggleAvailability = (id: number, available: boolean) => {
    updateMenuItemMutation.mutate({ id, data: { available } });
  };

  const deleteItem = (id: number) => {
    deleteMenuItemMutation.mutate(id);
  };

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
      categories.find(cat => cat.id === item.categoryId)?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>No menu items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {categories.find(cat => cat.id === item.categoryId)?.name || "Unknown Category"}
                    </p>
                  </div>
                  <Badge variant={item.available ? "default" : "secondary"}>
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {item.description || "No description available"}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">₹{item.price}</span>
                  <span className="text-sm text-muted-foreground">
                    Stock: {item.stock}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.available}
                      onCheckedChange={(checked) => toggleAvailability(item.id, checked)}
                    />
                    <Label className="text-sm">
                      {item.available ? "Available" : "Unavailable"}
                    </Label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}