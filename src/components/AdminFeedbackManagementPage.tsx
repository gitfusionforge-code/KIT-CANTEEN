import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, MessageSquare, Star, ThumbsUp, ThumbsDown,
  Search, Filter, Reply, Archive, Flag, Eye, Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminFeedbackManagementPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const feedbacks = [
    {
      id: 1,
      user: "John Doe",
      email: "john@example.com",
      subject: "App Performance Issue",
      message: "The app is running slow on my device. Sometimes it takes too long to load the menu.",
      category: "Technical",
      priority: "High",
      status: "Open",
      rating: 2,
      submittedAt: "2024-01-15 10:30 AM",
      lastResponse: null,
      responseCount: 0
    },
    {
      id: 2,
      user: "Sarah Wilson",
      email: "sarah@example.com",
      subject: "Great Food Quality",
      message: "I absolutely love the food quality and the quick delivery service. Keep up the excellent work!",
      category: "Compliment",
      priority: "Low",
      status: "Resolved",
      rating: 5,
      submittedAt: "2024-01-15 09:15 AM",
      lastResponse: "2024-01-15 11:00 AM",
      responseCount: 1
    },
    {
      id: 3,
      user: "Mike Johnson",
      email: "mike@example.com",
      subject: "Payment Failed",
      message: "My payment was deducted but the order was not placed. This happened twice now.",
      category: "Payment",
      priority: "High",
      status: "In Progress",
      rating: 1,
      submittedAt: "2024-01-15 08:45 AM",
      lastResponse: "2024-01-15 09:30 AM",
      responseCount: 2
    },
    {
      id: 4,
      user: "Emily Davis",
      email: "emily@example.com",
      subject: "Menu Suggestions",
      message: "Could you please add more healthy options to the menu? Some salads and fresh juices would be great.",
      category: "Suggestion",
      priority: "Medium",
      status: "Open",
      rating: 4,
      submittedAt: "2024-01-14 05:20 PM",
      lastResponse: null,
      responseCount: 0
    },
    {
      id: 5,
      user: "Alex Brown",
      email: "alex@example.com",
      subject: "Order Delivery Issue",
      message: "My order was delivered to the wrong location. Please improve the delivery system.",
      category: "Delivery",
      priority: "Medium",
      status: "Open",
      rating: 2,
      submittedAt: "2024-01-14 02:15 PM",
      lastResponse: null,
      responseCount: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-success text-success-foreground";
      case "In Progress": return "bg-warning text-warning-foreground";
      case "Open": return "bg-primary text-primary-foreground";
      case "Closed": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical": return "bg-blue-100 text-blue-800";
      case "Payment": return "bg-red-100 text-red-800";
      case "Delivery": return "bg-yellow-100 text-yellow-800";
      case "Suggestion": return "bg-green-100 text-green-800";
      case "Compliment": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`}
      />
    ));
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && feedback.status.toLowerCase().replace(" ", "-") === activeTab;
  });

  const handleReply = () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Reply sent successfully!",
    });

    setReplyMessage("");
    setSelectedFeedback(null);
  };

  const stats = {
    total: feedbacks.length,
    open: feedbacks.filter(f => f.status === "Open").length,
    inProgress: feedbacks.filter(f => f.status === "In Progress").length,
    resolved: feedbacks.filter(f => f.status === "Resolved").length,
    avgRating: (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin-dashboard")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Feedback Management</h1>
            <p className="text-muted-foreground">Manage user feedback and support requests</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-xs text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <ThumbsUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {[
          { key: "all", label: "All" },
          { key: "open", label: "Open" },
          { key: "in-progress", label: "In Progress" },
          { key: "resolved", label: "Resolved" }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={activeTab === key ? "default" : "outline"}
            onClick={() => setActiveTab(key)}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback by user, subject, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-foreground">{feedback.subject}</h4>
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                      <Badge className={getPriorityColor(feedback.priority)}>
                        {feedback.priority}
                      </Badge>
                      <Badge className={getCategoryColor(feedback.category)}>
                        {feedback.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-muted-foreground">by {feedback.user}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(feedback.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{feedback.submittedAt}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{feedback.message}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {feedback.responseCount > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {feedback.responseCount} response(s) • Last response: {feedback.lastResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reply Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Reply to Feedback</CardTitle>
              <div className="text-sm text-muted-foreground">
                <p><strong>From:</strong> {selectedFeedback.user} ({selectedFeedback.email})</p>
                <p><strong>Subject:</strong> {selectedFeedback.subject}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{selectedFeedback.message}</p>
              </div>
              <Textarea
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                  Cancel
                </Button>
                <Button onClick={handleReply}>
                  <Reply className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}