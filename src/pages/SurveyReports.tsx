import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, Download, FileText, Users, Clock, CheckCircle, AlertTriangle,
  TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Map, Filter, Search,
  ChevronLeft, ChevronRight, Eye, MapPin, Smartphone, Target, Star, MessageSquare,
  FileSpreadsheet, Share2, Printer, RefreshCw, CalendarIcon, Hash, Layers,
  Award, Activity, User, Mail, Phone, ThumbsUp, ThumbsDown, Minus
} from "lucide-react";
import { format } from "date-fns";
import { surveys, responses, users, devices } from "@/data/dummyData";
import { toast } from "sonner";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, RadialBarChart, RadialBar
} from "recharts";

// ─── DATA ───────────────────────────────────────────────────────────────────

const extendedResponses = [
  ...responses,
  ...Array.from({ length: 80 }, (_, i) => ({
    id: `R-${10300 + i}`,
    surveyId: surveys[Math.floor(Math.random() * surveys.length)].id,
    surveyName: surveys[Math.floor(Math.random() * surveys.length)].name,
    respondent: ["Anonymous", "John Smith", "Jane Doe", "Michael Brown", "Sarah Wilson", "Emily Davis", "Robert Chen", "Amanda Foster"][Math.floor(Math.random() * 8)],
    respondentEmail: `user${i}@email.com`,
    device: devices[Math.floor(Math.random() * devices.length)].id,
    location: ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Miami, FL", "Seattle, WA", "Boston, MA", "San Francisco, CA"][Math.floor(Math.random() * 8)],
    coordinates: { lat: 35 + Math.random() * 10, lng: -100 + Math.random() * 30 },
    completedAt: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
    startedAt: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 7).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
    duration: `${Math.floor(Math.random() * 15) + 3}m ${Math.floor(Math.random() * 60)}s`,
    status: ["complete", "partial", "complete", "complete", "abandoned"][Math.floor(Math.random() * 5)] as "complete" | "partial" | "abandoned",
    score: Math.floor(Math.random() * 40) + 60,
    npsScore: Math.floor(Math.random() * 11),
    answers: [
      { questionId: "Q1", question: "How satisfied are you?", answer: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"][Math.floor(Math.random() * 4)] },
      { questionId: "Q2", question: "Would you recommend us?", answer: ["Yes", "Maybe", "No"][Math.floor(Math.random() * 3)] },
      { questionId: "Q3", question: "Service quality?", answer: ["Excellent", "Good", "Average", "Poor"][Math.floor(Math.random() * 4)] },
      { questionId: "Q4", question: "Value for money?", answer: ["Very Good", "Good", "Fair", "Poor"][Math.floor(Math.random() * 4)] },
      { questionId: "Q5", question: "Ease of use?", answer: String(Math.floor(Math.random() * 5) + 1) },
    ],
  })),
];

const responseTrendData = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  responses: Math.floor(Math.random() * 120) + 40,
  completed: Math.floor(Math.random() * 100) + 30,
  abandoned: Math.floor(Math.random() * 25) + 5,
  partial: Math.floor(Math.random() * 15) + 3,
}));

const npsOverTime = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  promoters: Math.floor(Math.random() * 20) + 40,
  passives: Math.floor(Math.random() * 15) + 20,
  detractors: Math.floor(Math.random() * 10) + 10,
  npsScore: Math.floor(Math.random() * 30) + 30,
}));

const crossTabData = {
  satisfaction: {
    "Male": { "Very Satisfied": 45, "Satisfied": 30, "Neutral": 15, "Dissatisfied": 10 },
    "Female": { "Very Satisfied": 52, "Satisfied": 28, "Neutral": 12, "Dissatisfied": 8 },
    "18-25": { "Very Satisfied": 38, "Satisfied": 35, "Neutral": 18, "Dissatisfied": 9 },
    "26-35": { "Very Satisfied": 48, "Satisfied": 32, "Neutral": 13, "Dissatisfied": 7 },
    "36-45": { "Very Satisfied": 55, "Satisfied": 25, "Neutral": 12, "Dissatisfied": 8 },
    "46+": { "Very Satisfied": 42, "Satisfied": 33, "Neutral": 16, "Dissatisfied": 9 },
  },
};

const spatialData = [
  { region: "Northeast", responses: 3456, avgScore: 82, nps: 45, completionRate: 89, topSurvey: "Customer Satisfaction" },
  { region: "Southeast", responses: 2890, avgScore: 78, nps: 38, completionRate: 85, topSurvey: "Employee Engagement" },
  { region: "Midwest", responses: 2345, avgScore: 80, nps: 42, completionRate: 87, topSurvey: "Product Feedback" },
  { region: "Southwest", responses: 1890, avgScore: 75, nps: 35, completionRate: 82, topSurvey: "Market Research" },
  { region: "West Coast", responses: 4230, avgScore: 85, nps: 52, completionRate: 91, topSurvey: "Field Survey" },
  { region: "Pacific NW", responses: 1560, avgScore: 83, nps: 48, completionRate: 88, topSurvey: "Brand Awareness" },
];

const scoringData = [
  { question: "Q1: Overall Satisfaction", avgScore: 4.2, median: 4.0, mode: 5, stdDev: 0.8, responses: 1234 },
  { question: "Q2: Recommendation Likelihood", avgScore: 8.1, median: 8.0, mode: 9, stdDev: 1.2, responses: 1210 },
  { question: "Q3: Service Quality", avgScore: 4.5, median: 5.0, mode: 5, stdDev: 0.6, responses: 1198 },
  { question: "Q4: Value for Money", avgScore: 3.9, median: 4.0, mode: 4, stdDev: 0.9, responses: 1180 },
  { question: "Q5: Ease of Use", avgScore: 4.3, median: 4.0, mode: 5, stdDev: 0.7, responses: 1156 },
  { question: "Q6: Support Quality", avgScore: 4.6, median: 5.0, mode: 5, stdDev: 0.5, responses: 1140 },
  { question: "Q7: Feature Satisfaction", avgScore: 3.8, median: 4.0, mode: 4, stdDev: 1.0, responses: 1125 },
  { question: "Q8: Future Purchase Intent", avgScore: 4.1, median: 4.0, mode: 5, stdDev: 0.8, responses: 1100 },
];

const dailyReport = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  date: `Jan ${20 + i}, 2024`,
  newResponses: Math.floor(Math.random() * 80) + 40,
  completed: Math.floor(Math.random() * 70) + 30,
  partial: Math.floor(Math.random() * 15) + 3,
  abandoned: Math.floor(Math.random() * 10) + 2,
  avgDuration: `${Math.floor(Math.random() * 8) + 4}m`,
  avgScore: Math.floor(Math.random() * 15) + 75,
  nps: Math.floor(Math.random() * 25) + 30,
}));

const memberDetailData = [
  { id: "MR-001", name: "John Doe", email: "john.doe@email.com", avatar: "JD", location: "New York, NY", dept: "Sales", totalSurveys: 12, completedSurveys: 11, avgScore: 92, npsGiven: 9, lastActive: "2 hours ago", sentiment: "positive", duration: "8m 45s", status: "complete" as const },
  { id: "MR-002", name: "Sarah Wilson", email: "sarah.wilson@email.com", avatar: "SW", location: "Los Angeles, CA", dept: "Marketing", totalSurveys: 8, completedSurveys: 8, avgScore: 88, npsGiven: 8, lastActive: "5 hours ago", sentiment: "positive", duration: "12m 15s", status: "complete" as const },
  { id: "MR-003", name: "Michael Brown", email: "michael.brown@email.com", avatar: "MB", location: "Chicago, IL", dept: "Operations", totalSurveys: 6, completedSurveys: 5, avgScore: 75, npsGiven: 6, lastActive: "1 day ago", sentiment: "neutral", duration: "8m 30s", status: "complete" as const },
  { id: "MR-004", name: "Emily Davis", email: "emily.davis@email.com", avatar: "ED", location: "Houston, TX", dept: "HR", totalSurveys: 10, completedSurveys: 7, avgScore: 45, npsGiven: 4, lastActive: "3 days ago", sentiment: "negative", duration: "5m 20s", status: "partial" as const },
  { id: "MR-005", name: "Robert Chen", email: "robert.chen@email.com", avatar: "RC", location: "San Francisco, CA", dept: "Engineering", totalSurveys: 15, completedSurveys: 15, avgScore: 98, npsGiven: 10, lastActive: "Just now", sentiment: "positive", duration: "15m", status: "complete" as const },
  { id: "MR-006", name: "Amanda Foster", email: "amanda.foster@email.com", avatar: "AF", location: "Miami, FL", dept: "Support", totalSurveys: 9, completedSurveys: 8, avgScore: 82, npsGiven: 7, lastActive: "4 hours ago", sentiment: "positive", duration: "10m 12s", status: "complete" as const },
  { id: "MR-007", name: "David Park", email: "david.park@email.com", avatar: "DP", location: "Seattle, WA", dept: "Finance", totalSurveys: 4, completedSurveys: 2, avgScore: 60, npsGiven: 5, lastActive: "1 week ago", sentiment: "neutral", duration: "6m 40s", status: "partial" as const },
  { id: "MR-008", name: "Lisa Thompson", email: "lisa.thompson@email.com", avatar: "LT", location: "Boston, MA", dept: "Legal", totalSurveys: 11, completedSurveys: 11, avgScore: 95, npsGiven: 10, lastActive: "30 min ago", sentiment: "positive", duration: "9m 15s", status: "complete" as const },
];

const platformData = [
  { name: "Mobile", value: 65, color: "hsl(199, 89%, 48%)" },
  { name: "Web", value: 25, color: "hsl(172, 66%, 50%)" },
  { name: "Tablet", value: 10, color: "hsl(38, 92%, 50%)" },
];

const categoryRadar = [
  { category: "Satisfaction", score: 4.2, fullMark: 5 },
  { category: "Recommend", score: 4.5, fullMark: 5 },
  { category: "Service", score: 4.0, fullMark: 5 },
  { category: "Value", score: 3.9, fullMark: 5 },
  { category: "Ease of Use", score: 4.3, fullMark: 5 },
  { category: "Support", score: 4.6, fullMark: 5 },
];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function SurveyReports() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<typeof memberDetailData[0] | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const itemsPerPage = 15;

  const survey = surveys.find(s => s.id === surveyId) || surveys[0];

  const surveyResponses = useMemo(() => {
    return extendedResponses.filter(r => {
      const matchesSurvey = surveyId ? r.surveyId === surveyId : true;
      const matchesSearch = r.respondent.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSurvey && matchesSearch && matchesStatus;
    });
  }, [surveyId, searchQuery, statusFilter]);

  const totalPages = Math.ceil(surveyResponses.length / itemsPerPage);
  const paginatedResponses = surveyResponses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const completed = surveyResponses.filter(r => r.status === 'complete').length;
    const partial = surveyResponses.filter(r => r.status === 'partial').length;
    const abandoned = surveyResponses.filter(r => r.status === 'abandoned').length;
    const avgScore = surveyResponses.filter(r => r.score).reduce((acc, r) => acc + (r.score || 0), 0) / (surveyResponses.filter(r => r.score).length || 1);
    const npsScores = extendedResponses.filter(r => (r as any).npsScore !== undefined).map(r => (r as any).npsScore as number);
    const promoters = npsScores.filter(s => s >= 9).length;
    const detractors = npsScores.filter(s => s <= 6).length;
    const nps = Math.round(((promoters - detractors) / (npsScores.length || 1)) * 100);
    return { total: surveyResponses.length, completed, partial, abandoned, completionRate: Math.round((completed / (surveyResponses.length || 1)) * 100), avgScore: avgScore.toFixed(1), nps };
  }, [surveyResponses]);

  const handleExport = (fmt: string) => toast.success(`Exporting ${fmt.toUpperCase()} report — download will start shortly.`);
  const handlePrint = () => { window.print(); toast.success("Print dialog opened"); };

  return (
    <AdminLayout title={`Survey Report: ${survey.name}`} subtitle="Comprehensive survey analytics and detailed reporting">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/reports">Reports</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/surveys">Surveys</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{survey.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateFrom ? format(dateFrom, "MMM dd") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateTo ? format(dateTo, "MMM dd") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <Separator orientation="vertical" className="h-8 mx-1" />
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Print</Button>
          <Button variant="outline" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-2" />Excel</Button>
          <Button onClick={() => handleExport('pdf')}><Download className="h-4 w-4 mr-2" />PDF</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
        {[
          { label: "Total Responses", value: stats.total, icon: FileText, color: "primary" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "success" },
          { label: "Partial", value: stats.partial, icon: Clock, color: "warning" },
          { label: "Abandoned", value: stats.abandoned, icon: AlertTriangle, color: "destructive" },
          { label: "Completion Rate", value: `${stats.completionRate}%`, icon: TrendingUp, color: "primary" },
          { label: "Avg Score", value: stats.avgScore, icon: Star, color: "warning" },
          { label: "NPS Score", value: stats.nps, icon: Award, color: "success" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-${s.color}/10 p-2`}>
                <s.icon className={`h-4 w-4 text-${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
          {[
            { value: "summary", label: "Summary Report" },
            { value: "analytics", label: "Analytics" },
            { value: "nps", label: "NPS" },
            { value: "crosstab", label: "Cross Tab" },
            { value: "daily", label: "Daily Report" },
            { value: "spatial", label: "Spatial Report" },
            { value: "scoring", label: "Scoring Report" },
            { value: "members", label: "Member Responses" },
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* ─── SUMMARY TAB ─── */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Response Trend (30 Days)</h3>
              <p className="text-sm text-muted-foreground mb-4">Daily response volume with completion breakdown</p>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={responseTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="completed" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} name="Completed" strokeWidth={2} />
                  <Area type="monotone" dataKey="partial" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.2} name="Partial" strokeWidth={2} />
                  <Area type="monotone" dataKey="abandoned" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} name="Abandoned" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-primary" />Platform & Category Distribution</h3>
              <p className="text-sm text-muted-foreground mb-4">Response distribution across platforms</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={platformData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                        {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1">
                    {platformData.map(p => (
                      <div key={p.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} /><span>{p.name}</span></div>
                        <span className="font-semibold">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={categoryRadar}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 5]} />
                      <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Statistics Table */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" />Summary Statistics</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-center">Value</TableHead>
                    <TableHead className="text-center">Change</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { metric: "Total Responses", value: stats.total, change: "+12%", up: true },
                    { metric: "Completion Rate", value: `${stats.completionRate}%`, change: "+5%", up: true },
                    { metric: "Average Score", value: `${stats.avgScore}/100`, change: "+3%", up: true },
                    { metric: "NPS Score", value: stats.nps, change: "+8", up: true },
                    { metric: "Avg Duration", value: "8m 32s", change: "-12%", up: false },
                    { metric: "Skip Rate", value: "6.2%", change: "-2%", up: false },
                    { metric: "Drop-off Rate", value: `${Math.round((stats.abandoned / (stats.total || 1)) * 100)}%`, change: "-3%", up: false },
                  ].map((row) => (
                    <TableRow key={row.metric}>
                      <TableCell className="font-medium">{row.metric}</TableCell>
                      <TableCell className="text-center font-bold">{row.value}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={row.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>{row.change}</Badge>
                      </TableCell>
                      <TableCell>
                        {row.up ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ANALYTICS TAB ─── */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Response Volume Analysis</h3>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={responseTrendData.slice(0, 14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="completed" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} name="Completed" />
                  <Bar dataKey="partial" fill="hsl(var(--warning))" radius={[3, 3, 0, 0]} name="Partial" />
                  <Bar dataKey="abandoned" fill="hsl(var(--destructive))" radius={[3, 3, 0, 0]} name="Abandoned" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-success" />Score Distribution Over Time</h3>
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={responseTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--success))" strokeWidth={3} dot={{ r: 3 }} name="Completed" />
                  <Line type="monotone" dataKey="responses" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3 }} name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Question-wise Performance */}
          <Card>
            <CardHeader><CardTitle>Question-wise Performance Analysis</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={scoringData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="question" type="category" width={180} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── NPS TAB ─── */}
        <TabsContent value="nps" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            {[
              { label: "Promoters (9-10)", value: "45%", count: 5540, icon: ThumbsUp, color: "success" },
              { label: "Passives (7-8)", value: "35%", count: 4310, icon: Minus, color: "warning" },
              { label: "Detractors (0-6)", value: "20%", count: 2460, icon: ThumbsDown, color: "destructive" },
            ].map(n => (
              <Card key={n.label} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`rounded-lg bg-${n.color}/10 p-3`}><n.icon className={`h-6 w-6 text-${n.color}`} /></div>
                  <span className="text-3xl font-bold">{n.value}</span>
                </div>
                <p className="font-medium">{n.label}</p>
                <p className="text-sm text-muted-foreground">{n.count.toLocaleString()} respondents</p>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />NPS Trend Over 12 Months</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={npsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="promoters" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} name="Promoters" strokeWidth={2} />
                <Area type="monotone" dataKey="passives" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.2} name="Passives" strokeWidth={2} />
                <Area type="monotone" dataKey="detractors" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} name="Detractors" strokeWidth={2} />
                <Line type="monotone" dataKey="npsScore" stroke="hsl(var(--primary))" strokeWidth={3} name="NPS Score" dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">NPS Score Gauge</h3>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-48 h-48 rounded-full border-8 border-success/20">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-success">{stats.nps}</p>
                    <p className="text-sm text-muted-foreground">NPS Score</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {stats.nps >= 50 ? "Excellent" : stats.nps >= 30 ? "Good" : stats.nps >= 0 ? "Average" : "Needs Improvement"}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ─── CROSS TAB ─── */}
        <TabsContent value="crosstab" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" />Cross Tabulation Analysis</CardTitle>
                  <CardDescription>Satisfaction by Demographics</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-1" />Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="h-4 w-4 mr-1" />PDF</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Segment</TableHead>
                      <TableHead className="text-center text-success font-semibold">Very Satisfied</TableHead>
                      <TableHead className="text-center text-primary font-semibold">Satisfied</TableHead>
                      <TableHead className="text-center text-warning font-semibold">Neutral</TableHead>
                      <TableHead className="text-center text-destructive font-semibold">Dissatisfied</TableHead>
                      <TableHead className="text-center font-bold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(crossTabData.satisfaction).map(([segment, values]) => {
                      const total = Object.values(values).reduce((a, b) => a + b, 0);
                      return (
                        <TableRow key={segment}>
                          <TableCell className="font-medium">{segment}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-success">{values["Very Satisfied"]}%</span>
                              <Progress value={values["Very Satisfied"]} className="h-1.5 w-16 mt-1" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-primary">{values["Satisfied"]}%</span>
                              <Progress value={values["Satisfied"]} className="h-1.5 w-16 mt-1" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-warning">{values["Neutral"]}%</span>
                              <Progress value={values["Neutral"]} className="h-1.5 w-16 mt-1" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-destructive">{values["Dissatisfied"]}%</span>
                              <Progress value={values["Dissatisfied"]} className="h-1.5 w-16 mt-1" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold">{total}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Cross Tab Visualization</h3>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={Object.entries(crossTabData.satisfaction).map(([k, v]) => ({ segment: k, ...v }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="segment" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="Very Satisfied" fill="hsl(var(--success))" stackId="a" />
                <Bar dataKey="Satisfied" fill="hsl(var(--primary))" stackId="a" />
                <Bar dataKey="Neutral" fill="hsl(var(--warning))" stackId="a" />
                <Bar dataKey="Dissatisfied" fill="hsl(var(--destructive))" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* ─── DAILY REPORT ─── */}
        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5" />Daily Report Breakdown</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-1" />Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="h-4 w-4 mr-1" />PDF</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Day</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">New</TableHead>
                    <TableHead className="text-center">Completed</TableHead>
                    <TableHead className="text-center">Partial</TableHead>
                    <TableHead className="text-center">Abandoned</TableHead>
                    <TableHead className="text-center">Avg Duration</TableHead>
                    <TableHead className="text-center">Avg Score</TableHead>
                    <TableHead className="text-center">NPS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyReport.map((day) => (
                    <TableRow key={day.day}>
                      <TableCell className="font-medium">{day.day}</TableCell>
                      <TableCell className="text-muted-foreground">{day.date}</TableCell>
                      <TableCell className="text-center font-bold">{day.newResponses}</TableCell>
                      <TableCell className="text-center text-success font-semibold">{day.completed}</TableCell>
                      <TableCell className="text-center text-warning">{day.partial}</TableCell>
                      <TableCell className="text-center text-destructive">{day.abandoned}</TableCell>
                      <TableCell className="text-center">{day.avgDuration}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={day.avgScore >= 80 ? "default" : "secondary"} className={day.avgScore >= 80 ? "bg-success/10 text-success" : ""}>{day.avgScore}%</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={day.nps >= 40 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{day.nps}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-3 rounded-lg bg-muted/50 flex justify-between text-sm">
                <span className="font-semibold">Weekly Total</span>
                <span>Responses: <strong>{dailyReport.reduce((a, d) => a + d.newResponses, 0)}</strong> | Avg Score: <strong>{Math.round(dailyReport.reduce((a, d) => a + d.avgScore, 0) / 7)}%</strong> | Avg NPS: <strong>{Math.round(dailyReport.reduce((a, d) => a + d.nps, 0) / 7)}</strong></span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Daily Volume Chart</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyReport}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="partial" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Partial" />
                <Bar dataKey="abandoned" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Abandoned" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* ─── SPATIAL REPORT ─── */}
        <TabsContent value="spatial" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5" />Spatial Report — Regional Analysis</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-1" />Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="h-4 w-4 mr-1" />PDF</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Region</TableHead>
                    <TableHead className="text-center">Responses</TableHead>
                    <TableHead className="text-center">Avg Score</TableHead>
                    <TableHead className="text-center">NPS</TableHead>
                    <TableHead className="text-center">Completion Rate</TableHead>
                    <TableHead>Top Survey</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spatialData.map((r) => (
                    <TableRow key={r.region}>
                      <TableCell><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span className="font-medium">{r.region}</span></div></TableCell>
                      <TableCell className="text-center font-bold">{r.responses.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={r.avgScore >= 80 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{r.avgScore}%</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={r.nps >= 40 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{r.nps}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <Progress value={r.completionRate} className="h-2 w-20" />
                          <span className="text-sm">{r.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.topSurvey}</TableCell>
                      <TableCell>
                        <Progress value={r.avgScore} className="h-2.5 w-24" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Regional Comparison</h3>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={spatialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="responses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Responses" />
                <Bar dataKey="avgScore" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Avg Score" />
                <Bar dataKey="nps" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="NPS" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* ─── SCORING REPORT ─── */}
        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Scoring Report — Statistical Analysis</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-1" />Excel</Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="h-4 w-4 mr-1" />PDF</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Question</TableHead>
                    <TableHead className="text-center">Responses</TableHead>
                    <TableHead className="text-center">Mean</TableHead>
                    <TableHead className="text-center">Median</TableHead>
                    <TableHead className="text-center">Mode</TableHead>
                    <TableHead className="text-center">Std Dev</TableHead>
                    <TableHead>Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scoringData.map((q) => (
                    <TableRow key={q.question}>
                      <TableCell className="font-medium max-w-[200px]">{q.question}</TableCell>
                      <TableCell className="text-center">{q.responses.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn("font-bold", q.avgScore >= 4 ? "text-success" : q.avgScore >= 3 ? "text-warning" : "text-destructive")}>{q.avgScore}</span>
                      </TableCell>
                      <TableCell className="text-center">{q.median}</TableCell>
                      <TableCell className="text-center">{q.mode}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{q.stdDev}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={(q.avgScore / 5) * 100} className="h-3 w-28" />
                          <span className="text-xs font-medium">{((q.avgScore / 5) * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Score Distribution by Question</h3>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={scoringData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="question" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={80} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Mean Score" />
                  <Bar dataKey="median" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Median" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Category Performance Radar</h3>
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart data={categoryRadar}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 5]} />
                  <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* ─── MEMBER RESPONSES TAB ─── */}
        <TabsContent value="members" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Total Members", value: memberDetailData.length, icon: Users, color: "primary" },
              { label: "Completed All", value: memberDetailData.filter(m => m.status === "complete").length, icon: CheckCircle, color: "success" },
              { label: "Avg Score", value: `${Math.round(memberDetailData.reduce((a, m) => a + m.avgScore, 0) / memberDetailData.length)}%`, icon: Star, color: "warning" },
              { label: "Avg NPS", value: (memberDetailData.reduce((a, m) => a + m.npsGiven, 0) / memberDetailData.length).toFixed(1), icon: Award, color: "success" },
            ].map(s => (
              <Card key={s.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-${s.color}/10 p-3`}><s.icon className={`h-5 w-5 text-${s.color}`} /></div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Individual Member Responses</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search members..." className="pl-9 w-64" />
                  </div>
                  <Button variant="outline" onClick={() => handleExport('excel')}><Download className="h-4 w-4 mr-2" />Export All</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[220px]">Member</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-center">Surveys</TableHead>
                    <TableHead className="text-center">Avg Score</TableHead>
                    <TableHead className="text-center">NPS Given</TableHead>
                    <TableHead className="text-center">Sentiment</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberDetailData.map((m) => (
                    <TableRow key={m.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{m.avatar}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-medium text-sm">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm"><div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{m.location}</div></TableCell>
                      <TableCell className="text-sm">{m.dept}</TableCell>
                      <TableCell className="text-center text-sm">{m.completedSurveys}/{m.totalSurveys}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(m.avgScore >= 80 ? "bg-success/10 text-success" : m.avgScore >= 60 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive")}>{m.avgScore}%</Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">{m.npsGiven}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={cn(
                          m.sentiment === "positive" && "bg-success/10 text-success",
                          m.sentiment === "neutral" && "bg-warning/10 text-warning",
                          m.sentiment === "negative" && "bg-destructive/10 text-destructive",
                        )}>{m.sentiment}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={m.status === "complete" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{m.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedMember(m); setMemberDialogOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleExport('pdf')}>
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
      </Tabs>

      {/* Member Detail Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/10 text-primary font-bold">{selectedMember.avatar}</AvatarFallback></Avatar>
                  <div>
                    <p className="text-lg">{selectedMember.name}</p>
                    <p className="text-sm text-muted-foreground font-normal">{selectedMember.email}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{selectedMember.location}</div>
                  <div className="flex items-center gap-2 text-sm"><Layers className="h-4 w-4 text-muted-foreground" />{selectedMember.dept}</div>
                  <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-muted-foreground" />Last Active: {selectedMember.lastActive}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3 text-center"><p className="text-2xl font-bold text-primary">{selectedMember.avgScore}%</p><p className="text-xs text-muted-foreground">Avg Score</p></Card>
                  <Card className="p-3 text-center"><p className="text-2xl font-bold text-success">{selectedMember.npsGiven}</p><p className="text-xs text-muted-foreground">NPS Given</p></Card>
                  <Card className="p-3 text-center"><p className="text-2xl font-bold">{selectedMember.completedSurveys}</p><p className="text-xs text-muted-foreground">Completed</p></Card>
                  <Card className="p-3 text-center"><p className="text-2xl font-bold">{selectedMember.duration}</p><p className="text-xs text-muted-foreground">Avg Duration</p></Card>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleExport('pdf')}><Download className="h-4 w-4 mr-2" />Download PDF</Button>
                <Button variant="outline" className="flex-1" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-2" />Download Excel</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
