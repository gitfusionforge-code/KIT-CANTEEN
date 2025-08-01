import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  ArrowLeft, Download, FileText, TrendingUp, DollarSign, 
  Users, Package, Calendar as CalendarIcon, Filter, BarChart3
} from "lucide-react";

export default function AdminReportsPage() {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState<any>();
  const [reportType, setReportType] = useState("revenue");

  const reports = [
    {
      id: 1,
      name: "Daily Revenue Report",
      type: "Financial",
      date: "2024-01-15",
      status: "Generated",
      size: "2.3 MB"
    },
    {
      id: 2,
      name: "Customer Analytics",
      type: "Analytics", 
      date: "2024-01-14",
      status: "Processing",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Inventory Summary",
      type: "Inventory",
      date: "2024-01-13",
      status: "Generated",
      size: "945 KB"
    },
    {
      id: 4,
      name: "Staff Performance",
      type: "HR",
      date: "2024-01-12",
      status: "Generated",
      size: "1.2 MB"
    }
  ];

  const quickStats = {
    totalReports: 156,
    pendingReports: 3,
    storageUsed: "24.5 GB",
    lastGenerated: "2 hours ago"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/admin")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-sm text-muted-foreground">Generate and manage system reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{quickStats.totalReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{quickStats.pendingReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">{quickStats.storageUsed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Generated</p>
                  <p className="text-2xl font-bold">{quickStats.lastGenerated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate New Report */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="customer">Customer Analytics</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="staff">Staff Performance</SelectItem>
                  <SelectItem value="menu">Menu Analytics</SelectItem>
                  <SelectItem value="feedback">Feedback Summary</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="food" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Report Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-sm">Today's Revenue</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">User Activity</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Package className="w-6 h-6" />
                <span className="text-sm">Order Summary</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">Performance</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.type} • {report.date} • {report.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={report.status === "Generated" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                    {report.status === "Generated" && (
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}