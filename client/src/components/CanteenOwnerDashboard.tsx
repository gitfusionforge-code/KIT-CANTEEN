import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { 
  ChefHat, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Clock,
  Star,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Package,
  Bell,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  ScanLine
} from "lucide-react";

export default function CanteenOwnerDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch real data from database using React Query
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
  });

  const { data: menuItems = [], isLoading: menuItemsLoading } = useQuery({
    queryKey: ['/api/menu'],
  });

  const [newCategory, setNewCategory] = useState("");

  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", stock: "", barcode: "" });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [stockUpdateItem, setStockUpdateItem] = useState<any>(null);
  const [newStockAmount, setNewStockAmount] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // Fetch real notifications from database
  const [notifications, setNotifications] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    canteenName: "KIT Main Canteen",
    workingHours: { open: "08:00", close: "20:00" },
    notifications: {
      newOrders: true,
      lowStock: true,
      orderReady: true,
      dailyReports: false
    },
    operationalSettings: {
      autoAcceptOrders: true,
      maxOrdersPerHour: 50,
      preparationTime: 15
    }
  });


  const stats = [
    { title: "Today's Orders", value: (orders as any[]).length.toString(), icon: ShoppingBag, trend: "+12%" },
    { title: "Revenue", value: `₹${(orders as any[]).reduce((sum: number, order: any) => sum + order.amount, 0)}`, icon: DollarSign, trend: "+8%" },
    { title: "Active Menu Items", value: (menuItems as any[]).filter((item: any) => item.available).length.toString(), icon: ChefHat, trend: "+3" },
    { title: "Avg Rating", value: "4.8", icon: Star, trend: "+0.2" }
  ];

  const handleOrderStatusUpdate = (orderId: any, newStatus: any) => {
    // Update order status using API
    updateMenuItemMutation.mutate({ id: orderId, data: { status: newStatus } });
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  // Add menu item mutation
  const addMenuItemMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/menu', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      toast.success("Menu item added successfully");
      setNewItem({ name: "", price: "", category: "", stock: "", barcode: "" });
    },
    onError: () => {
      toast.error("Failed to add menu item");
    }
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      toast.success("Menu item updated successfully");
    },
    onError: () => {
      toast.error("Failed to update menu item");
    }
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/menu/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      toast.success("Menu item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete menu item");
    }
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast.success("Category added successfully");
      setNewCategory("");
    },
    onError: () => {
      toast.error("Failed to add category");
    }
  });

  const handleAddMenuItem = () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Find category ID from name
    const selectedCategory = (categories as any[]).find((cat: any) => cat.name === newItem.category);
    
    const itemData = {
      name: newItem.name,
      price: parseInt(newItem.price),
      categoryId: selectedCategory ? selectedCategory.id : null,
      available: true,
      stock: parseInt(newItem.stock) || 0,
      description: ""
    };
    
    addMenuItemMutation.mutate(itemData);
  };

  const startBarcodeScanner = async () => {
    try {
      setIsScannerActive(true);
      
      // Check permission
      const permission = await BarcodeScanner.checkPermission({ force: true });
      
      if (permission.granted) {
        // Make background transparent
        document.body.classList.add('scanner-active');
        BarcodeScanner.hideBackground();
        
        const result = await BarcodeScanner.startScan();
        
        if (result.hasContent) {
          setNewItem({...newItem, barcode: result.content});
          toast.success(`Barcode scanned: ${result.content}`);
        }
      } else {
        toast.error("Camera permission is required to scan barcodes");
      }
    } catch (error) {
      toast.error("Failed to start barcode scanner");
      console.error('Barcode scanner error:', error);
    } finally {
      stopBarcodeScanner();
    }
  };

  const stopBarcodeScanner = () => {
    setIsScannerActive(false);
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.body.classList.remove('scanner-active');
  };

  const handleEditMenuItem = (item: any) => {
    setEditingItem(item);
  };

  const handleUpdateMenuItem = () => {
    updateMenuItemMutation.mutate({ id: editingItem.id, data: editingItem });
    setEditingItem(null);
  };

  const handleDeleteMenuItem = (itemId: any) => {
    deleteMenuItemMutation.mutate(itemId);
  };

  const toggleItemAvailability = (itemId: any) => {
    const item = (menuItems as any[]).find((item: any) => item.id === itemId);
    if (item) {
      updateMenuItemMutation.mutate({ id: itemId, data: { available: !item.available } });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    if ((categories as any[]).some((cat: any) => cat.name === newCategory)) {
      toast.error("Category already exists");
      return;
    }
    
    addCategoryMutation.mutate({ name: newCategory });
  };

  const handleDeleteCategory = (categoryToDelete: any) => {
    if ((menuItems as any[]).some((item: any) => item.categoryId === categoryToDelete.id)) {
      toast.error("Cannot delete category - items are using it");
      return;
    }
    
    // Add delete category mutation here if needed
    toast.success("Category deleted successfully");
  };

  const getOrderStatusColor = (status: any) => {
    switch (status) {
      case "pending": return "bg-warning";
      case "preparing": return "bg-primary";
      case "ready": return "bg-success";
      case "completed": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const getOrderStatusText = (status: any) => {
    switch (status) {
      case "pending": return "Pending";
      case "preparing": return "Preparing";
      case "ready": return "Ready";
      case "completed": return "Completed";
      default: return status;
    }
  };

  // Stock management handlers
  const handleUpdateStock = (item: any) => {
    setStockUpdateItem(item);
    setNewStockAmount(item.stock.toString());
  };

  const handleSaveStockUpdate = () => {
    if (!newStockAmount || isNaN(parseInt(newStockAmount))) {
      toast.error("Please enter a valid stock amount");
      return;
    }

    const updatedStock = parseInt(newStockAmount);
    setMenuItems(menuItems.map(item => 
      item.id === stockUpdateItem.id 
        ? { ...item, stock: updatedStock, available: updatedStock > 0 }
        : item
    ));
    
    setStockUpdateItem(null);
    setNewStockAmount("");
    toast.success(`Stock updated for ${stockUpdateItem.name}`);
  };

  // Notification handlers
  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  // Settings handlers
  const handleSettingsUpdate = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [key]: value
      }
    }));
    toast.success("Settings updated successfully");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return ShoppingBag;
      case "stock": return Package;
      case "system": return Settings;
      default: return Bell;
    }
  };





  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Canteen Owner Dashboard</h1>
              <p className="text-sm text-muted-foreground">KIT Canteen</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation("/barcode-scanner")}
            >
              <ScanLine className="w-4 h-4 mr-2" />
              Enter Order
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/login")}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-success">{stat.trend}</p>
                      </div>
                      <stat.icon className="w-8 h-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Orders
                  <Button size="sm" onClick={() => setActiveTab("orders")}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(orders as any[]).slice(0, 3).map((order: any) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setLocation(`/canteen-order-detail/${order.id.replace('#', '')}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getOrderStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-sm">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.amount}</p>
                        <p className="text-xs text-muted-foreground">{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="online" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="online">Online Orders</TabsTrigger>
                    <TabsTrigger value="offline">Offline Orders</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="online">
                    <div className="space-y-4">
                      {(orders as any[]).map((order: any) => (
                        <div key={order.id} className="p-4 border rounded-lg space-y-3">
                          <div 
                            className="flex items-center justify-between cursor-pointer hover:bg-accent/20 -m-2 p-2 rounded transition-colors"
                            onClick={() => setLocation(`/canteen-order-detail/${order.id.replace('#', '')}`)}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold">{order.id}</span>
                              <Badge className={getOrderStatusColor(order.status)}>
                                {getOrderStatusText(order.status)}
                              </Badge>
                              {order.estimatedTime > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  ETA: {order.estimatedTime} min
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-lg">₹{order.amount}</span>
                          </div>
                          
                          <div 
                            className="cursor-pointer hover:bg-accent/20 -mx-2 px-2 py-1 rounded transition-colors"
                            onClick={() => setLocation(`/canteen-order-detail/${order.id.replace('#', '')}`)}
                          >
                            <p className="text-sm text-muted-foreground">Customer: {order.customer}</p>
                            <p className="text-sm">{order.items}</p>
                            <p className="text-xs text-muted-foreground">{order.time}</p>
                          </div>

                          <div className="flex space-x-2">
                            {order.status === "preparing" && (
                              <Button 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderStatusUpdate(order.id, "ready");
                                }}
                              >
                                Mark Ready
                              </Button>
                            )}
                            {order.status === "ready" && (
                              <Button 
                                size="sm" 
                                className="bg-success text-success-foreground hover:bg-success/90"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderStatusUpdate(order.id, "completed");
                                }}
                              >
                                Complete Order
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="offline">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Counter Orders</h3>

                      </div>
                      
                      {/* Offline Orders List */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold">#C001</span>
                              <Badge className="bg-primary">Counter Order</Badge>
                              <span className="text-sm text-muted-foreground">
                                Student ID: 21CS1234
                              </span>
                            </div>
                            <span className="font-bold text-lg">₹120</span>
                          </div>
                          
                          <div>
                            <p className="text-sm">2x Veg Meals, 1x Lassi</p>
                            <p className="text-xs text-muted-foreground">Counter 1 • just now</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm">Process Payment</Button>
                            <Button size="sm" variant="outline">Print Receipt</Button>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold">#C002</span>
                              <Badge className="bg-success">Paid</Badge>
                              <span className="text-sm text-muted-foreground">
                                Cash Payment
                              </span>
                            </div>
                            <span className="font-bold text-lg">₹75</span>
                          </div>
                          
                          <div>
                            <p className="text-sm">1x Biryani, 1x Raita</p>
                            <p className="text-xs text-muted-foreground">Counter 2 • 2 min ago</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Reprint Receipt</Button>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold">#C003</span>
                              <Badge className="bg-primary">Counter Order</Badge>
                              <span className="text-sm text-muted-foreground">
                                Faculty Order
                              </span>
                            </div>
                            <span className="font-bold text-lg">₹200</span>
                          </div>
                          
                          <div>
                            <p className="text-sm">3x Special Thali, 2x Tea</p>
                            <p className="text-xs text-muted-foreground">Counter 1 • 5 min ago</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm">Process Payment</Button>
                            <Button size="sm" variant="outline">Print Receipt</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <ChefHat className="w-5 h-5" />
                    Menu Management
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Item Name</Label>
                          <Input
                            id="name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            placeholder="Enter item name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                            placeholder="Enter price"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <div className="flex space-x-2">
                            <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {(categories as any[]).map((category: any) => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Manage Categories</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex space-x-2">
                                    <Input
                                      placeholder="Enter new category"
                                      value={newCategory}
                                      onChange={(e) => setNewCategory(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                    <Button onClick={handleAddCategory}>
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {categories.map((category) => (
                                      <div key={category} className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm">{category}</span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleDeleteCategory(category)}
                                          className="h-6 w-6 p-0"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="barcode">Barcode (Optional)</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="barcode"
                              value={newItem.barcode}
                              onChange={(e) => setNewItem({...newItem, barcode: e.target.value})}
                              placeholder="Enter or scan barcode"
                            />
                            <Button 
                              type="button"
                              variant="outline" 
                              size="icon"
                              onClick={startBarcodeScanner}
                              disabled={isScannerActive}
                            >
                              <ScanLine className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="stock">Initial Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newItem.stock}
                            onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                            placeholder="Enter stock quantity"
                          />
                        </div>
                        <Button onClick={handleAddMenuItem} className="w-full">
                          Add Menu Item
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(menuItems as any[]).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="secondary">{item.category}</Badge>
                          {!item.available && <Badge variant="destructive">Out of Stock</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Stock: {item.stock} | Price: ₹{item.price}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={item.available}
                          onCheckedChange={() => toggleItemAvailability(item.id)}
                        />
                        <Button size="sm" variant="outline" onClick={() => handleEditMenuItem(item)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteMenuItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    Sales Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Today's Revenue</span>
                      <span className="font-semibold text-success">₹{orders.reduce((sum, order) => sum + order.amount, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orders Completed</span>
                      <span className="font-semibold">{orders.filter(o => o.status === "completed").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value</span>
                      <span className="font-semibold">₹{Math.round(orders.reduce((sum, order) => sum + order.amount, 0) / orders.length)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(menuItems as any[]).slice(0, 3).map((item: any, index: any) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">#{index + 1}</Badge>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  Inventory Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(menuItems as any[]).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Stock: {item.stock}</p>
                          {item.stock < 10 && (
                            <p className="text-xs text-destructive flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Low Stock
                            </p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateStock(item)}
                        >
                          Update Stock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editingItem.stock}
                  onChange={(e) => setEditingItem({...editingItem, stock: parseInt(e.target.value)})}
                />
              </div>
              <Button onClick={handleUpdateMenuItem} className="w-full">
                Update Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Stock Update Dialog */}
      {stockUpdateItem && (
        <Dialog open={!!stockUpdateItem} onOpenChange={() => setStockUpdateItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock - {stockUpdateItem.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-stock">Current Stock</Label>
                <Input
                  id="current-stock"
                  value={stockUpdateItem.stock}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="new-stock">New Stock Amount</Label>
                <Input
                  id="new-stock"
                  type="number"
                  value={newStockAmount}
                  onChange={(e) => setNewStockAmount(e.target.value)}
                  placeholder="Enter new stock amount"
                  min="0"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {parseInt(newStockAmount) === 0 && (
                  <p className="text-destructive">⚠️ Setting stock to 0 will make this item unavailable</p>
                )}
                {parseInt(newStockAmount) < 10 && parseInt(newStockAmount) > 0 && (
                  <p className="text-warning">⚠️ Low stock warning will be displayed</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStockUpdateItem(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveStockUpdate} className="flex-1">
                  Update Stock
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Notifications
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllNotificationsAsRead}
                  disabled={notifications.filter(n => !n.read).length === 0}
                >
                  Mark All Read
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No notifications</p>
            ) : (
              notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      notification.read ? 'bg-muted/30' : 'bg-accent/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-4 h-4 mt-0.5 text-primary" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            ✓
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Canteen Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="canteen-name">Canteen Name</Label>
                  <Input
                    id="canteen-name"
                    value={settings.canteenName}
                    onChange={(e) => handleSettingsUpdate('', 'canteenName', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="open-time">Opening Time</Label>
                    <Input
                      id="open-time"
                      type="time"
                      value={settings.workingHours.open}
                      onChange={(e) => handleSettingsUpdate('workingHours', 'open', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="close-time">Closing Time</Label>
                    <Input
                      id="close-time"
                      type="time"
                      value={settings.workingHours.close}
                      onChange={(e) => handleSettingsUpdate('workingHours', 'close', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-orders">New Orders</Label>
                  <Button
                    variant={settings.notifications.newOrders ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingsUpdate('notifications', 'newOrders', !settings.notifications.newOrders)}
                  >
                    {settings.notifications.newOrders ? "ON" : "OFF"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="low-stock">Low Stock Alerts</Label>
                  <Button
                    variant={settings.notifications.lowStock ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingsUpdate('notifications', 'lowStock', !settings.notifications.lowStock)}
                  >
                    {settings.notifications.lowStock ? "ON" : "OFF"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="order-ready">Order Ready</Label>
                  <Button
                    variant={settings.notifications.orderReady ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingsUpdate('notifications', 'orderReady', !settings.notifications.orderReady)}
                  >
                    {settings.notifications.orderReady ? "ON" : "OFF"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-reports">Daily Reports</Label>
                  <Button
                    variant={settings.notifications.dailyReports ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingsUpdate('notifications', 'dailyReports', !settings.notifications.dailyReports)}
                  >
                    {settings.notifications.dailyReports ? "ON" : "OFF"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Operational Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Operational Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-accept">Auto Accept Orders</Label>
                  <Button
                    variant={settings.operationalSettings.autoAcceptOrders ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingsUpdate('operationalSettings', 'autoAcceptOrders', !settings.operationalSettings.autoAcceptOrders)}
                  >
                    {settings.operationalSettings.autoAcceptOrders ? "ON" : "OFF"}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="max-orders">Max Orders Per Hour</Label>
                  <Input
                    id="max-orders"
                    type="number"
                    value={settings.operationalSettings.maxOrdersPerHour}
                    onChange={(e) => handleSettingsUpdate('operationalSettings', 'maxOrdersPerHour', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="prep-time">Default Preparation Time (minutes)</Label>
                  <Input
                    id="prep-time"
                    type="number"
                    value={settings.operationalSettings.preparationTime}
                    onChange={(e) => handleSettingsUpdate('operationalSettings', 'preparationTime', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}