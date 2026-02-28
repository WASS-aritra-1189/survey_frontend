import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, Target, Award, Users, FileText, 
  BarChart3, Activity, Clock, CheckCircle2, AlertCircle, Zap,
  ArrowUpRight, ArrowDownRight, Flame, Trophy, Star
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, Legend
} from "recharts";

// KPI Data
const kpiData = {
  totalResponses: { value: 45678, change: 12.5, target: 50000 },
  completionRate: { value: 87.3, change: 3.2, target: 90 },
  averageTime: { value: "4m 32s", change: -8.1, target: "4m" },
  activeUsers: { value: 2341, change: 15.7, target: 2500 },
  nps: { value: 72, change: 5, target: 75 },
  satisfaction: { value: 4.5, change: 0.2, target: 4.8 },
};

// Performance Trends
const performanceTrend = [
  { date: "Mon", responses: 420, completion: 85, engagement: 78 },
  { date: "Tue", responses: 380, completion: 82, engagement: 75 },
  { date: "Wed", responses: 520, completion: 88, engagement: 82 },
  { date: "Thu", responses: 490, completion: 86, engagement: 80 },
  { date: "Fri", responses: 610, completion: 90, engagement: 85 },
  { date: "Sat", responses: 340, completion: 83, engagement: 72 },
  { date: "Sun", responses: 280, completion: 80, engagement: 68 },
];

// Goal Tracking
const goals = [
  { name: "Monthly Responses", current: 45678, target: 50000, percentage: 91.4, status: "on-track" },
  { name: "User Engagement", current: 78, target: 85, percentage: 91.8, status: "on-track" },
  { name: "Survey Completion", current: 87, target: 90, percentage: 96.7, status: "excellent" },
  { name: "Response Time", current: 4.5, target: 4, percentage: 87.5, status: "needs-attention" },
  { name: "NPS Score", current: 72, target: 75, percentage: 96, status: "on-track" },
];

// Team Performance
const teamPerformance = [
  { name: "Field Team A", surveys: 156, responses: 4520, completion: 92 },
  { name: "Field Team B", surveys: 142, responses: 3890, completion: 88 },
  { name: "Field Team C", surveys: 128, responses: 3650, completion: 85 },
  { name: "Remote Team", surveys: 98, responses: 2840, completion: 90 },
];

// Benchmark Data
const benchmarks = [
  { metric: "Response Rate", yours: 87, industry: 72, percentile: 92 },
  { metric: "Completion Time", yours: 4.5, industry: 6.2, percentile: 85 },
  { metric: "NPS Score", yours: 72, industry: 55, percentile: 88 },
  { metric: "User Retention", yours: 78, industry: 65, percentile: 80 },
];

// Radial Chart Data
const radialData = [
  { name: "Responses", value: 91, fill: "hsl(199, 89%, 48%)" },
  { name: "Completion", value: 97, fill: "hsl(142, 71%, 45%)" },
  { name: "Engagement", value: 85, fill: "hsl(172, 66%, 50%)" },
  { name: "Satisfaction", value: 90, fill: "hsl(38, 92%, 50%)" },
];

const COLORS = ["hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)", "hsl(172, 66%, 50%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">Track your key performance indicators and goals</p>
        </div>
        <div className="flex gap-2">
          {["day", "week", "month", "quarter"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Total Responses"
          value={kpiData.totalResponses.value.toLocaleString()}
          change={kpiData.totalResponses.change}
          target={kpiData.totalResponses.target.toLocaleString()}
          progress={(kpiData.totalResponses.value / kpiData.totalResponses.target) * 100}
          icon={<FileText className="h-4 w-4" />}
        />
        <KPICard
          title="Completion Rate"
          value={`${kpiData.completionRate.value}%`}
          change={kpiData.completionRate.change}
          target={`${kpiData.completionRate.target}%`}
          progress={kpiData.completionRate.value}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <KPICard
          title="Avg. Response Time"
          value={kpiData.averageTime.value}
          change={kpiData.averageTime.change}
          target={kpiData.averageTime.target}
          progress={85}
          icon={<Clock className="h-4 w-4" />}
        />
        <KPICard
          title="Active Users"
          value={kpiData.activeUsers.value.toLocaleString()}
          change={kpiData.activeUsers.change}
          target={kpiData.activeUsers.target.toLocaleString()}
          progress={(kpiData.activeUsers.value / kpiData.activeUsers.target) * 100}
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="NPS Score"
          value={kpiData.nps.value.toString()}
          change={kpiData.nps.change}
          target={kpiData.nps.target.toString()}
          progress={(kpiData.nps.value / kpiData.nps.target) * 100}
          icon={<Star className="h-4 w-4" />}
        />
        <KPICard
          title="Satisfaction"
          value={`${kpiData.satisfaction.value}/5`}
          change={kpiData.satisfaction.change}
          target={`${kpiData.satisfaction.target}/5`}
          progress={(kpiData.satisfaction.value / 5) * 100}
          icon={<Trophy className="h-4 w-4" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Trends
            </CardTitle>
            <CardDescription>Daily performance metrics overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="responses"
                    stroke="hsl(199, 89%, 48%)"
                    fillOpacity={1}
                    fill="url(#colorResponses)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="hsl(142, 71%, 45%)"
                    fillOpacity={1}
                    fill="url(#colorCompletion)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goal Progress
            </CardTitle>
            <CardDescription>Track progress towards your targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="90%" 
                  barSize={18} 
                  data={radialData}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals & Team Performance */}
      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="benchmarks">Industry Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Goals Progress</CardTitle>
              <CardDescription>Track your progress towards monthly targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{goal.name}</span>
                        <Badge 
                          variant={
                            goal.status === "excellent" ? "default" :
                            goal.status === "on-track" ? "secondary" : "destructive"
                          }
                          className={
                            goal.status === "excellent" ? "bg-success text-success-foreground" :
                            goal.status === "on-track" ? "" : ""
                          }
                        >
                          {goal.status === "excellent" ? "Excellent" :
                           goal.status === "on-track" ? "On Track" : "Needs Attention"}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {goal.current} / {goal.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={goal.percentage} className="flex-1" />
                      <span className="text-sm font-medium w-12 text-right">
                        {goal.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Comparison</CardTitle>
              <CardDescription>Compare performance across different teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="surveys" name="Surveys" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="responses" name="Responses" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks">
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarks</CardTitle>
              <CardDescription>See how you compare to industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {benchmarks.map((benchmark, i) => (
                  <div key={i} className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{benchmark.metric}</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Top {100 - benchmark.percentile}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <p className="text-xs text-muted-foreground">Your Score</p>
                        <p className="text-xl font-bold text-primary">{benchmark.yours}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground">Industry Avg</p>
                        <p className="text-xl font-bold">{benchmark.industry}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {benchmark.yours > benchmark.industry ? (
                        <>
                          <ArrowUpRight className="h-4 w-4 text-success" />
                          <span className="text-sm text-success">
                            {((benchmark.yours - benchmark.industry) / benchmark.industry * 100).toFixed(1)}% above average
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">
                            {((benchmark.industry - benchmark.yours) / benchmark.industry * 100).toFixed(1)}% below average
                          </span>
                        </>
                      )}
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

// KPI Card Component
function KPICard({ 
  title, 
  value, 
  change, 
  target, 
  progress, 
  icon 
}: { 
  title: string; 
  value: string; 
  change: number; 
  target: string; 
  progress: number;
  icon: React.ReactNode;
}) {
  const isPositive = change >= 0;
  
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-success" : "text-destructive"
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Target: {target}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
