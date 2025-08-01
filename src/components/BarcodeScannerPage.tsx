import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function BarcodeScannerPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  const handleSubmit = () => {
    if (!orderId.trim()) {
      toast.error("Please enter an Order ID");
      return;
    }
    
    toast.success(`Processing Order ID: ${orderId}`);
    // Navigate to order status or processing page
    navigate(`/order-status/${orderId}`);
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
          <div className="w-16" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Manual Entry Section */}
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
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Button 
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          disabled={!orderId.trim()}
        >
          Submit Order ID
        </Button>
      </div>
    </div>
  );
}