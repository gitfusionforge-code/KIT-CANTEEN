import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BarcodeScannerPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  
  // Manual order creation state
  const [isCreatingManualOrder, setIsCreatingManualOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    studentId: "",
    paymentMethod: "pending"
  });
  const [selectedItems, setSelectedItems] = useState([]);

  // Sample menu items - in real app, this would come from API
  const menuItems = [
    { id: 1, name: "Veg Thali", price: 60, category: "Veg", available: true, stock: 20 },
    { id: 2, name: "Paneer Curry", price: 70, category: "Veg", available: true, stock: 15 },
    { id: 3, name: "Rice", price: 25, category: "Staples", available: true, stock: 100 },
    { id: 4, name: "Coffee", price: 15, category: "Beverages", available: true, stock: 50 },
    { id: 5, name: "Chicken Curry", price: 80, category: "Non-Veg", available: true, stock: 10 },
  ];

  const handleSubmit = () => {
    if (!orderId.trim()) {
      toast.error("Please enter an Order ID");
      return;
    }
    
    toast.success(`Processing Order ID: ${orderId}`);
    // Navigate to order status or processing page
    navigate(`/order-status/${orderId}`);
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

    toast.success(`Manual order created: ${orderNumber} for ${newOrder.customerName} - Total: ₹${total}`);
    
    // Reset form
    setNewOrder({ customerName: "", studentId: "", paymentMethod: "pending" });
    setSelectedItems([]);
    setIsCreatingManualOrder(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Order Entry</h1>
          <Button 
            onClick={() => setIsCreatingManualOrder(!isCreatingManualOrder)}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreatingManualOrder ? "Cancel" : "Manual Order"}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order ID Entry Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Enter Order ID</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            {orderId && (
              <Alert className="border-primary/50 text-primary dark:border-primary [&>svg]:text-primary">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Order ID ready: {orderId}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={!orderId.trim()}
            >
              Submit Order ID
            </Button>
          </CardContent>
        </Card>

        {/* Manual Order Creation Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Create Manual Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCreatingManualOrder && (
              <div className="space-y-6 border-t pt-4">
                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="font-medium">Customer Details</h3>
                  <div className="grid grid-cols-1 gap-4">
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

                    {/* Create Order Button */}
                    <Button
                      onClick={handleCreateManualOrder}
                      disabled={!newOrder.customerName || selectedItems.length === 0}
                      className="w-full"
                      size="lg"
                    >
                      Create Order (₹{calculateOrderTotal()})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}