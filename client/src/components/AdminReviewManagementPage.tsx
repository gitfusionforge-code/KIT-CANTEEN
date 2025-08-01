import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Star, ThumbsUp, ThumbsDown, Flag, 
  Search, Filter, Eye, Trash2, CheckCircle, 
  XCircle, MessageSquare, Calendar, TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminReviewManagementPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const reviews = [
    {
      id: 1,
      user: "John Doe",
      itemName: "Chicken Biryani",
      itemId: "ITEM001",
      rating: 5,
      comment: "Absolutely delicious! The chicken was tender and the rice was perfectly cooked. Will definitely order again.",
      status: "Approved",
      submittedAt: "2024-01-15 02:30 PM",
      helpfulVotes: 12,
      reportCount: 0,
      verified: true
    },
    {
      id: 2,
      user: "Sarah Wilson",
      itemName: "Margherita Pizza",
      itemId: "ITEM002",
      rating: 2,
      comment: "The pizza was cold when it arrived and the cheese was not melted properly. Very disappointed.",
      status: "Pending",
      submittedAt: "2024-01-15 01:15 PM",
      helpfulVotes: 3,
      reportCount: 1,
      verified: true
    },
    {
      id: 3,
      user: "Mike Johnson",
      itemName: "Veg Burger",
      itemId: "ITEM003",
      rating: 4,
      comment: "Good taste and fresh ingredients. The bun was soft and the patty was crispy.",
      status: "Approved",
      submittedAt: "2024-01-15 12:45 PM",
      helpfulVotes: 8,
      reportCount: 0,
      verified: false
    },
    {
      id: 4,
      user: "Emily Davis",
      itemName: "Masala Dosa",
      itemId: "ITEM004",
      rating: 1,
      comment: "This is completely inappropriate content that should not be here. Terrible service and food.",
      status: "Flagged",
      submittedAt: "2024-01-15 11:30 AM",
      helpfulVotes: 0,
      reportCount: 5,
      verified: true
    },
    {
      id: 5,
      user: "Alex Brown",
      itemName: "Chocolate Shake",
      itemId: "ITEM005",
      rating: 5,
      comment: "Rich and creamy chocolate shake. Perfect sweetness level and great consistency.",
      status: "Approved",
      submittedAt: "2024-01-15 10:20 AM",
      helpfulVotes: 15,
      reportCount: 0,
      verified: true
    },
    {
      id: 6,
      user: "Lisa Garcia",
      itemName: "Caesar Salad",
      itemId: "ITEM006",
      rating: 3,
      comment: "Average taste. The lettuce was fresh but the dressing was too salty for my liking.",
      status: "Rejected",
      submittedAt: "2024-01-14 08:15 PM",
      helpfulVotes: 2,
      reportCount: 0,
      verified: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-success text-success-foreground";
      case "Pending": return "bg-warning text-warning-foreground";
      case "Rejected": return "bg-destructive text-destructive-foreground";
      case "Flagged": return "bg-red-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;
    
    let matchesStatus = true;
    if (activeTab !== "all") {
      matchesStatus = review.status.toLowerCase() === activeTab;
    }
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleApprove = (reviewId: number) => {
    toast({
      title: "Success",
      description: "Review approved successfully!",
    });
  };

  const handleReject = (reviewId: number) => {
    toast({
      title: "Success",
      description: "Review rejected successfully!",
    });
  };

  const handleFlag = (reviewId: number) => {
    toast({
      title: "Success",
      description: "Review flagged for moderation!",
      variant: "destructive"
    });
  };

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === "Approved").length,
    pending: reviews.filter(r => r.status === "Pending").length,
    flagged: reviews.filter(r => r.status === "Flagged").length,
    avgRating: (reviews.filter(r => r.status === "Approved").reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.status === "Approved").length).toFixed(1)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/admin-dashboard")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Review Management</h1>
            <p className="text-muted-foreground">Moderate and manage user reviews</p>
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
                <p className="text-xs text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
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
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Flag className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.flagged}</p>
                <p className="text-xs text-muted-foreground">Flagged</p>
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
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "flagged", label: "Flagged" },
          { key: "rejected", label: "Rejected" }
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
                placeholder="Search reviews by user, item, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-foreground">{review.itemName}</h4>
                      <Badge className={getStatusColor(review.status)}>
                        {review.status}
                      </Badge>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-muted-foreground">by {review.user}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{review.submittedAt}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review.helpfulVotes} helpful</span>
                      </div>
                      {review.reportCount > 0 && (
                        <div className="flex items-center space-x-1">
                          <Flag className="h-3 w-3 text-red-500" />
                          <span>{review.reportCount} reports</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {review.status === "Pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          className="text-success hover:bg-success/10"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(review.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFlag(review.id)}
                    >
                      <Flag className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}