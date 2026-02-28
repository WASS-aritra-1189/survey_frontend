import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardStats } from "@/store/dashboardSlice";
import { reportsService } from "@/services/reportsService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { 
  Download, 
  FileSpreadsheet,
  FileText,
  File,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  FileCheck,
  Clock,
  MapPin,
  Smartphone,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Filter,
  RefreshCw,
  Eye,
  Printer,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const responseData = [
  { name: "Mon", responses: 120, completed: 98, pending: 22 },
  { name: "Tue", responses: 180, completed: 156, pending: 24 },
  { name: "Wed", responses: 150, completed: 132, pending: 18 },
  { name: "Thu", responses: 220, completed: 198, pending: 22 },
  { name: "Fri", responses: 280, completed: 245, pending: 35 },
  { name: "Sat", responses: 190, completed: 167, pending: 23 },
  { name: "Sun", responses: 140, completed: 118, pending: 22 },
];

const monthlyTrend = [
  { month: "Jan", surveys: 45, responses: 2340, users: 120 },
  { month: "Feb", surveys: 52, responses: 2890, users: 145 },
  { month: "Mar", surveys: 48, responses: 3120, users: 167 },
  { month: "Apr", surveys: 61, responses: 3560, users: 189 },
  { month: "May", surveys: 58, responses: 4120, users: 212 },
  { month: "Jun", surveys: 72, responses: 4890, users: 245 },
];

const platformData = [
  { name: "Mobile", value: 65, color: "hsl(199, 89%, 48%)" },
  { name: "Web", value: 25, color: "hsl(172, 66%, 50%)" },
  { name: "Tablet", value: 10, color: "hsl(38, 92%, 50%)" },
];

const regionData = [
  { name: "North", value: 35, color: "hsl(199, 89%, 48%)" },
  { name: "South", value: 28, color: "hsl(172, 66%, 50%)" },
  { name: "East", value: 22, color: "hsl(38, 92%, 50%)" },
  { name: "West", value: 15, color: "hsl(280, 65%, 60%)" },
];

const completionData = [
  { name: "Week 1", rate: 72 },
  { name: "Week 2", rate: 78 },
  { name: "Week 3", rate: 85 },
  { name: "Week 4", rate: 82 },
];

const surveyStats = [
  { label: "Total Surveys", value: "156", change: 12, icon: <FileText className="h-5 w-5" /> },
  { label: "Total Responses", value: "45,234", change: 24, icon: <FileCheck className="h-5 w-5" /> },
  { label: "Avg. Completion Rate", value: "78%", change: 5, icon: <Activity className="h-5 w-5" /> },
  { label: "Active Users", value: "892", change: -3, icon: <Users className="h-5 w-5" /> },
];

const topSurveys = [
  { name: "Customer Satisfaction Q1", responses: 1245, completion: 92, trend: "up" },
  { name: "Employee Engagement 2024", responses: 876, completion: 88, trend: "up" },
  { name: "Product Feedback Survey", responses: 654, completion: 76, trend: "down" },
  { name: "Market Research Study", responses: 543, completion: 82, trend: "up" },
  { name: "Brand Awareness Check", responses: 432, completion: 71, trend: "down" },
];

const recentReports = [
  { name: "Monthly Analytics Report", type: "PDF", date: "Jan 15, 2026", size: "2.4 MB" },
  { name: "Survey Responses Export", type: "Excel", date: "Jan 14, 2026", size: "5.1 MB" },
  { name: "User Activity Summary", type: "CSV", date: "Jan 13, 2026", size: "1.2 MB" },
  { name: "Regional Performance", type: "PDF", date: "Jan 12, 2026", size: "3.8 MB" },
];

export default function Reports() {
  const dispatch = useAppDispatch();
  const { tokens } = useAuthStore();
  const { stats } = useAppSelector((state) => state.dashboard);
  const [dateRange, setDateRange] = useState("30");
  const [selectedSurvey, setSelectedSurvey] = useState("all");
  const [weeklyData, setWeeklyData] = useState(responseData);
  const [topSurveysData, setTopSurveysData] = useState(topSurveys);
  const [userActivityData, setUserActivityData] = useState(monthlyTrend);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchDashboardStats(tokens.accessToken));
      reportsService.getWeeklyResponses(tokens.accessToken)
        .then(res => setWeeklyData(res.data || responseData))
        .catch(() => setWeeklyData(responseData));
      reportsService.getTopSurveys(tokens.accessToken)
        .then(res => setTopSurveysData(res.data || topSurveys))
        .catch(() => setTopSurveysData(topSurveys));
      reportsService.getUserActivity(tokens.accessToken)
        .then(res => {
          console.log('User Activity Response:', res);
          setUserActivityData(res.data || monthlyTrend);
        })
        .catch(err => {
          console.error('User Activity Error:', err);
          setUserActivityData(monthlyTrend);
        });
    }
  }, [dispatch, tokens]);

  const surveyStats = [
    { label: "Total Survey Masters", value: stats?.totalSurveyMasters?.toString() || "0", change: 12, icon: <Users className="h-5 w-5" /> },
    { label: "Total Surveys", value: stats?.totalSurveys?.toString() || "0", change: 24, icon: <FileText className="h-5 w-5" /> },
    { label: "Total Responses", value: stats?.totalResponses?.toLocaleString() || "0", change: 5, icon: <FileCheck className="h-5 w-5" /> },
    { label: "Completion Rate", value: `${stats?.completionRate || 0}%`, change: -3, icon: <Activity className="h-5 w-5" /> },
  ];

  const platformData = [
    { name: "Android", value: stats?.platformDistribution?.android || 0, color: "hsl(199, 89%, 48%)" },
    { name: "iOS", value: stats?.platformDistribution?.ios || 0, color: "hsl(172, 66%, 50%)" },
    { name: "Web", value: stats?.platformDistribution?.web || 0, color: "hsl(38, 92%, 50%)" },
  ];

  const handleExport = (format: string) => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`, {
      description: "Your download will start shortly."
    });
  };

  const handlePrint = () => {
    toast.success("Preparing print preview...");
  };

  const handleShare = () => {
    toast.success("Report link copied to clipboard!");
  };

  return (
    <AdminLayout title="Reports & Analytics" subtitle="Comprehensive data analytics and export options">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {surveyStats.map((stat) => (
          <Card key={stat.label} variant="stat" className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-primary/10 p-3">
                {stat.icon}
              </div>
              <Badge className={stat.change >= 0 ? "gradient-success" : "bg-destructive text-destructive-foreground"}>
                {stat.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(stat.change)}%
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Actions */}
      <Card variant="elevated" className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Report Controls</CardTitle>
              <CardDescription>Filter data and export reports</CardDescription>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select survey" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Surveys</SelectItem>
                  <SelectItem value="customer-sat">Customer Satisfaction</SelectItem>
                  <SelectItem value="employee">Employee Engagement</SelectItem>
                  <SelectItem value="product">Product Feedback</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:border-success hover:bg-success/5"
              onClick={() => handleExport("csv")}
            >
              <FileSpreadsheet className="h-6 w-6 text-success" />
              <span className="text-sm">CSV</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handleExport("excel")}
            >
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              <span className="text-sm">Excel</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:border-destructive hover:bg-destructive/5"
              onClick={() => handleExport("pdf")}
            >
              <FileText className="h-6 w-6 text-destructive" />
              <span className="text-sm">PDF</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:border-warning hover:bg-warning/5"
              onClick={() => handleExport("json")}
            >
              <File className="h-6 w-6 text-warning" />
              <span className="text-sm">JSON</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm">Print</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm">Share</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily Responses */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Daily Responses
                  </CardTitle>
                  <Badge variant="secondary">This Week</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(215, 16%, 47%)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(215, 16%, 47%)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(0, 0%, 100%)",
                          border: "1px solid hsl(214, 32%, 91%)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" fill="hsl(172, 66%, 50%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" name="Pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Monthly Response Trend
                  </CardTitle>
                  <Badge variant="secondary">Last 6 Months</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.monthlyTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(0, 0%, 100%)",
                          border: "1px solid hsl(214, 32%, 91%)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="count" name="Responses" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Platform Distribution */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Platform Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {platformData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {regionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate Trend */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-success" />
                  Weekly Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.weeklyCompletion || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="week" stroke="hsl(215, 16%, 47%)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} stroke="hsl(215, 16%, 47%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, "Rate"]} />
                      <Line type="monotone" dataKey="completionRate" stroke="hsl(172, 66%, 50%)" strokeWidth={3} dot={{ fill: "hsl(172, 66%, 50%)", strokeWidth: 2, r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-success/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rate</span>
                    <span className="text-lg font-bold text-success">{stats?.completionRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="surveys" className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Top Performing Surveys</CardTitle>
              <CardDescription>Surveys ranked by response count and completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Survey Name</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSurveysData.map((survey, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {i + 1}
                          </div>
                          <span className="font-medium">{survey.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{survey.responses.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={survey.completion} className="h-2 w-20" />
                          <span className={survey.completion >= 80 ? "text-success" : survey.completion >= 60 ? "text-warning" : "text-destructive"}>
                            {survey.completion}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={survey.trend === "up" ? "gradient-success" : "bg-destructive text-destructive-foreground"}>
                          {survey.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>User Activity Analytics</CardTitle>
              <CardDescription>Detailed breakdown of user engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" name="Active Users" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="surveys" name="Surveys Created" stroke="hsl(172, 66%, 50%)" fill="hsl(172, 66%, 50%)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>Previously generated reports and exports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{report.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{report.date}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
