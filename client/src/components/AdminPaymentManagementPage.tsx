import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Search, Filter, CreditCard, DollarSign, 
  TrendingUp, AlertTriangle, CheckCircle, Clock, 
  RefreshCw, Download, Eye
} from "lucide-react";

export default function AdminPaymentManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payments = [
    {
      id: "PAY001",
      orderId: "ORD-8935",
      user: "John Doe",
      amount: 250,
      method: "UPI",
      status: "Completed",
      timestamp: "2024-01-15 14:30:00",
      transactionId: "TXN789123456",
      gateway: "Razorpay"
    },
    {
      id: "PAY002",
      orderId: "ORD-8934",
      user: "Jane Smith", 
      amount: 180,
      method: "Credit Card",
      status: "Failed",
      timestamp: "2024-01-15 14:25:00",
      transactionId: "TXN789123457",
      gateway: "Stripe"
    },
    {
      id: "PAY003",
      orderId: "ORD-8933",
      user: "Mike Johnson",
      amount: 320,
      method: "Debit Card",
      status: "Pending",
      timestamp: "2024-01-15 14:20:00",
      transactionId: "TXN789123458",
      gateway: "Razorpay"
    },
    {
      id: "PAY004",
      orderId: "ORD-8932",
      user: "Sarah Wilson",
      amount: 450,
      method: "Net Banking",
      status: "Completed",
      timestamp: "2024-01-15 14:15:00",
      transactionId: "TXN789123459",
      gateway: "PayU"
    },
    {
      id: "PAY005",
      orderId: "ORD-8931",
      user: "Tom Brown",
      amount: 150,
      method: "Wallet",
      status: "Refunded",
      timestamp: "2024-01-15 14:10:00",
      transactionId: "TXN789123460",
      gateway: "Paytm"
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success text-success-foreground";
      case "Failed": return "bg-destructive text-destructive-foreground";
      case "Pending": return "bg-warning text-warning-foreground";
      case "Refunded": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="h-3 w-3" />;
      case "Failed": return <AlertTriangle className="h-3 w-3" />;
      case "Pending": return <Clock className="h-3 w-3" />;
      case "Refunded": return <RefreshCw className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const stats = {
    totalTransactions: payments.length,
    totalAmount: payments.filter(p => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0),
    successRate: ((payments.filter(p => p.status === "Completed").length / payments.length) * 100).toFixed(1),
    pendingAmount: payments.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0)
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Payment report is being generated and will be downloaded shortly.",
    });
    
    // Simulate report generation
    setTimeout(() => {
      const csvContent = [
        ["Payment ID", "Order ID", "User", "Amount", "Method", "Status", "Timestamp", "Transaction ID", "Gateway"],
        ...filteredPayments.map(payment => [
          payment.id,
          payment.orderId,
          payment.user,
          payment.amount,
          payment.method,
          payment.status,
          payment.timestamp,
          payment.transactionId,
          payment.gateway
        ])
      ].map(row => row.join(",")).join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Payment report has been downloaded successfully.",
      });
    }, 2000);
  };

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleRetryPayment = (payment: any) => {
    toast({
      title: "Payment Retry",
      description: `Initiating retry for failed payment ${payment.id}`,
    });
    // In a real app, this would trigger the payment retry process
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
            <p className="text-muted-foreground">Monitor and manage all payment transactions</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{stats.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pending Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, order ID, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{payment.user}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Order: {payment.orderId}</span>
                      <span>•</span>
                      <span>{payment.method}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-lg">₹{payment.amount}</p>
                  <p className="text-xs text-muted-foreground">{payment.gateway}</p>
                </div>
                
                <div className="text-center">
                  <Badge className={`${getStatusColor(payment.status)} mb-1`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(payment.status)}
                      <span>{payment.status}</span>
                    </div>
                  </Badge>
                  <p className="text-xs text-muted-foreground">{payment.timestamp}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewPayment(payment)}
                    title="View payment details"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  {payment.status === "Failed" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRetryPayment(payment)}
                      title="Retry failed payment"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Payment Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                  <p className="text-sm font-mono">{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="text-sm font-mono">{selectedPayment.orderId}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                <p className="text-sm">{selectedPayment.user}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold text-success">₹{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(selectedPayment.status)}
                      <span>{selectedPayment.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="text-sm">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gateway</p>
                  <p className="text-sm">{selectedPayment.gateway}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">{selectedPayment.transactionId}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Transaction Time</p>
                <p className="text-sm">{selectedPayment.timestamp}</p>
              </div>

              {selectedPayment.status === "Failed" && (
                <div className="pt-4">
                  <Button 
                    onClick={() => {
                      handleRetryPayment(selectedPayment);
                      setIsModalOpen(false);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}