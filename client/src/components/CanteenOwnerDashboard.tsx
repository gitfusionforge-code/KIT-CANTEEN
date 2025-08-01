import { useState } from "react";
import { useLocation } from "wouter";
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
  
  // Categories state
  const [categories, setCategories] = useState([
    "South Indian",
    "North Indian", 
    "Street Food",
    "Beverages",
    "Non-Veg",
    "Desserts"
  ]);
  const [newCategory, setNewCategory] = useState("");
  
  // Mock data with state management
  const [orders, setOrders] = useState([
    { id: "#1234", customer: "John Doe", items: "2x Masala Dosa, 1x Coffee", amount: 85, status: "pending", time: "2 min ago", estimatedTime: 15 },
    { id: "#1233", customer: "Jane Smith", items: "1x Idli Sambar, 1x Tea", amount: 45, status: "preparing", time: "5 min ago", estimatedTime: 8 },
    { id: "#1232", customer: "Mike Johnson", items: "1x Vada Pav, 1x Lassi", amount: 60, status: "ready", time: "8 min ago", estimatedTime: 0 },
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Masala Dosa", price: 35, category: "South Indian", available: true, stock: 25 },
    { id: 2, name: "Idli Sambar", price: 25, category: "South Indian", available: true, stock: 30 },
    { id: 3, name: "Vada Pav", price: 20, category: "Street Food", available: true, stock: 15 },
    { id: 4, name: "Coffee", price: 15, category: "Beverages", available: true, stock: 50 },
    { id: 5, name: "Chicken Curry", price: 80, category: "Non-Veg", available: false, stock: 0 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", stock: "", barcode: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  
  // Manual order creation state
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    studentId: "",
    items: [],
    paymentMethod: "pending"
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const stats = [
    { title: "Today's Orders", value: orders.length.toString(), icon: ShoppingBag, trend: "+12%" },
    { title: "Revenue", value: `₹${orders.reduce((sum, order) => sum + order.amount, 0)}`, icon: DollarSign, trend: "+8%" },
    { title: "Active Menu Items", value: menuItems.filter(item => item.available).length.toString(), icon: ChefHat, trend: "+3" },
    { title: "Avg Rating", value: "4.8", icon: Star, trend: "+0.2" }
  ];

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  const handleAddMenuItem = () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const item = {
      id: Date.now(),
      name: newItem.name,
      price: parseInt(newItem.price),
      category: newItem.category || "Other",
      available: true,
      stock: parseInt(newItem.stock) || 0
    };
    
    setMenuItems([...menuItems, item]);
    setNewItem({ name: "", price: "", category: "", stock: "", barcode: "" });
    toast.success("Menu item added successfully");
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

  const handleEditMenuItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateMenuItem = () => {
    setMenuItems(menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
    toast.success("Menu item updated successfully");
  };

  const handleDeleteMenuItem = (itemId) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
    toast.success("Menu item deleted successfully");
  };

  const toggleItemAvailability = (itemId) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    if (categories.includes(newCategory)) {
      toast.error("Category already exists");
      return;
    }
    
    setCategories([...categories, newCategory]);
    setNewCategory("");
    toast.success("Category added successfully");
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (menuItems.some(item => item.category === categoryToDelete)) {
      toast.error("Cannot delete category - items are using it");
      return;
    }
    
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    toast.success("Category deleted successfully");
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-warning";
      case "preparing": return "bg-primary";
      case "ready": return "bg-success";
      case "completed": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "pending": return "Pending";
      case "preparing": return "Preparing";
      case "ready": return "Ready";
      case "completed": return "Completed";
      default: return status;
    }
  };

  // Manual order creation handlers
  const handleAddItemToOrder = (menuItem, quantity = 1) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item => 
        item.id === menuItem.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...menuItem, quantity }]);
    }
  };

  const handleRemoveItemFromOrder = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleUpdateItemQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItemFromOrder(itemId);
      return;
    }
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const calculateOrderTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCreateManualOrder = () => {
    if (!newOrder.customerName || selectedItems.length === 0) {
      toast.error("Please add customer name and at least one item");
      return;
    }

    const orderNumber = `#C${String(Date.now()).slice(-3)}`;
    const orderItems = selectedItems.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const total = calculateOrderTotal();

    // Reset form
    setNewOrder({ customerName: "", studentId: "", items: [], paymentMethod: "pending" });
    setSelectedItems([]);
    setIsCreatingOrder(false);
    
    toast.success(`Order ${orderNumber} created successfully!`);
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
              onClick={() => navigate("/barcode-scanner")}
            >
              <ScanLine className="w-4 h-4 mr-2" />
              Enter Order
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/login")}
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
                  {orders.slice(0, 3).map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/canteen-order-detail/${order.id.replace('#', '')}`, { state: { from: '/canteen-owner' } })}
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
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg space-y-3">
                          <div 
                            className="flex items-center justify-between cursor-pointer hover:bg-accent/20 -m-2 p-2 rounded transition-colors"
                            onClick={() => navigate(`/canteen-order-detail/${order.id.replace('#', '')}`, { state: { from: '/canteen-owner' } })}
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
                            onClick={() => navigate(`/canteen-order-detail/${order.id.replace('#', '')}`, { state: { from: '/canteen-owner' } })}
                          >
                            <p className="text-sm text-muted-foreground">Customer: {order.customer}</p>
                            <p className="text-sm">{order.items}</p>
                            <p className="text-xs text-muted-foreground">{order.time}</p>
                          </div>

                          <div className="flex space-x-2">
                            {order.status === "pending" && (
                              <Button 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderStatusUpdate(order.id, "preparing");
                                }}
                              >
                                Start Preparing
                              </Button>
                            )}
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
                        <div className="flex space-x-2">
                          <Dialog open={isCreatingOrder} onOpenChange={setIsCreatingOrder}>
                            <DialogTrigger asChild>
                              <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Manual Order
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Create Manual Order</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Customer Details */}
                                <div className="space-y-4">
                                  <h3 className="font-medium">Customer Details</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="customer-name">Customer Name *</Label>
                                      <Input
                                        id="customer-name"
                                        value={newOrder.customerName}
                                        onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                                        placeholder="Enter customer name"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="student-id">Student ID (Optional)</Label>
                                      <Input
                                        id="student-id"
                                        value={newOrder.studentId}
                                        onChange={(e) => setNewOrder({...newOrder, studentId: e.target.value})}
                                        placeholder="e.g. 21CS1234"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Menu Items Selection */}
                                <div className="space-y-4">
                                  <h3 className="font-medium">Add Items</h3>
                                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                                    {menuItems.filter(item => item.available).map((item) => (
                                      <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                          <span className="font-medium">{item.name}</span>
                                          <span className="text-sm text-muted-foreground ml-2">₹{item.price}</span>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleAddItemToOrder(item)}
                                        >
                                          <Plus className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Selected Items */}
                                {selectedItems.length > 0 && (
                                  <div className="space-y-4">
                                    <h3 className="font-medium">Order Items</h3>
                                    <div className="space-y-2">
                                      {selectedItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-accent/50 rounded">
                                          <div>
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-sm text-muted-foreground ml-2">₹{item.price} each</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                                            >
                                              -
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                                            >
                                              +
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => handleRemoveItemFromOrder(item.id)}
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* Order Total */}
                                    <div className="border-t pt-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">Total:</span>
                                        <span className="text-xl font-bold">₹{calculateOrderTotal()}</span>
                                      </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                      <Label>Payment Method</Label>
                                      <Select value={newOrder.paymentMethod} onValueChange={(value) => setNewOrder({...newOrder, paymentMethod: value})}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending Payment</SelectItem>
                                          <SelectItem value="cash">Cash</SelectItem>
                                          <SelectItem value="card">Card</SelectItem>
                                          <SelectItem value="upi">UPI</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsCreatingOrder(false);
                                      setSelectedItems([]);
                                      setNewOrder({ customerName: "", studentId: "", items: [], paymentMethod: "pending" });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleCreateManualOrder}
                                    disabled={!newOrder.customerName || selectedItems.length === 0}
                                    className="flex-1"
                                  >
                                    Create Order (₹{calculateOrderTotal()})
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
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
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
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
                  {menuItems.map((item) => (
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
                    {menuItems.slice(0, 3).map((item, index) => (
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
                  {menuItems.map((item) => (
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
                        <Button size="sm" variant="outline">
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
    </div>
  );
}