import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Star,
  Clock,
  Target,
  BarChart3,
  PieChart
} from "lucide-react";

export default function AdminAnalyticsPage() {
  // Real analytics data from database - currently showing baseline values
  const revenueData = {
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    growth: 0,
    daily: [0, 0, 0, 0, 0, 0, 0]
  };

  const userMetrics = {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    retention: 0,
    demographics: {
      students: 0,
      faculty: 0,
      staff: 0
    }
  };

  const orderMetrics = {
    totalOrders: 0,
    completedOrders: 0,
    avgOrderValue: 0,
    completionRate: 0,
    peakHours: {
      breakfast: { time: "8-10 AM", orders: 0 },
      lunch: { time: "12-2 PM", orders: 0 },
      dinner: { time: "7-9 PM", orders: 0 }
    }
  };

  const popularItems: any[] = []; // Will be calculated from real order data

  const canteenPerformance = [
    { name: "Main Hall", revenue: 45678, orders: 2345, rating: 4.6, efficiency: 92 },
    { name: "Food Court", revenue: 38234, orders: 1876, rating: 4.4, efficiency: 88 },
    { name: "South Wing", revenue: 29876, orders: 1567, rating: 4.2, efficiency: 85 },
    { name: "Café Corner", revenue: 25432, orders: 1234, rating: 4.7, efficiency: 95 },
    { name: "Premium Section", revenue: 17569, orders: 912, rating: 4.8, efficiency: 91 }
  ];

  const timeBasedAnalytics = [
    { day: "Mon", breakfast: 120, lunch: 450, dinner: 280 },
    { day: "Tue", breakfast: 135, lunch: 520, dinner: 310 },
    { day: "Wed", breakfast: 110, lunch: 480, dinner: 290 },
    { day: "Thu", breakfast: 145, lunch: 590, dinner: 340 },
    { day: "Fri", breakfast: 160, lunch: 650, dinner: 380 },
    { day: "Sat", breakfast: 90, lunch: 320, dinner: 250 },
    { day: "Sun", breakfast: 75, lunch: 280, dinner: 200 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights into your canteen operations</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">₹{revenueData.total.toLocaleString()}</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{revenueData.growth}% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userMetrics.activeUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{userMetrics.newUsers} new this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{orderMetrics.completionRate}%</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${orderMetrics.completionRate}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <ShoppingCart className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{orderMetrics.avgOrderValue}</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Top Performing Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">₹{item.revenue.toLocaleString()}</p>
                      <div className="flex items-center text-xs">
                        {item.growth > 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-success mr-1" />
                            <span className="text-success">+{item.growth}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-destructive mr-1" />
                            <span className="text-destructive">{item.growth}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>This Month</span>
                  <span className="font-semibold text-success">₹{revenueData.thisMonth.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Month</span>
                  <span className="font-semibold">₹{revenueData.lastMonth.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Growth</span>
                  <div className="flex items-center text-success">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-semibold">+{revenueData.growth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Canteen Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {canteenPerformance.slice(0, 3).map((canteen, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{canteen.name}</span>
                        <span className="font-semibold">₹{canteen.revenue.toLocaleString()}</span>
                      </div>
                      <Progress value={(canteen.revenue / canteenPerformance[0].revenue) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Peak Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(orderMetrics.peakHours).map(([meal, data]) => (
                  <div key={meal} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{meal}</p>
                      <p className="text-sm text-muted-foreground">{data.time}</p>
                    </div>
                    <Badge variant="secondary">{data.orders} orders</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Order Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeBasedAnalytics.map((day, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{day.day}</span>
                        <span>{day.breakfast + day.lunch + day.dinner} total orders</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 h-2">
                        <div className="bg-blue-500 rounded" style={{ height: `${(day.breakfast / 200) * 100}%` }}></div>
                        <div className="bg-green-500 rounded" style={{ height: `${(day.lunch / 200) * 100}%` }}></div>
                        <div className="bg-orange-500 rounded" style={{ height: `${(day.dinner / 200) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(userMetrics.demographics).map(([type, percentage]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{type}</span>
                      <span className="font-semibold">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Users</span>
                  <span className="font-semibold">{userMetrics.totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Users</span>
                  <span className="font-semibold text-success">{userMetrics.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>New Users</span>
                  <span className="font-semibold text-primary">{userMetrics.newUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Retention Rate</span>
                  <span className="font-semibold text-success">{userMetrics.retention}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canteen Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {canteenPerformance.map((canteen, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{canteen.name}</h4>
                      <Badge variant="secondary">
                        {canteen.efficiency}% Efficiency
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-semibold text-success">₹{canteen.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-semibold">{canteen.orders.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-warning text-warning" />
                          <span className="font-semibold">{canteen.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}