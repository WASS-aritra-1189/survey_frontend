import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Star,
  Activity,
  Target,
  Award,
} from "lucide-react";
import { User } from "@/data/dummyData";

interface UserDetailModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

// Performance chart data
const performanceData = [
  { week: "W1", responses: 45, avgTime: 4.2 },
  { week: "W2", responses: 52, avgTime: 3.8 },
  { week: "W3", responses: 68, avgTime: 4.1 },
  { week: "W4", responses: 61, avgTime: 3.9 },
];

const surveyBreakdown = [
  { name: "Customer Sat", completed: 85 },
  { name: "Employee Eng", completed: 120 },
  { name: "Field Survey", completed: 156 },
  { name: "Market Res", completed: 45 },
];

const recentActivity = [
  { action: "Completed survey response", survey: "Customer Satisfaction", time: "2 minutes ago" },
  { action: "Synced device data", survey: "-", time: "15 minutes ago" },
  { action: "Started new survey", survey: "Field Survey - Region A", time: "1 hour ago" },
  { action: "Completed survey response", survey: "Employee Engagement", time: "2 hours ago" },
  { action: "Location check-in", survey: "Downtown Survey Area", time: "3 hours ago" },
];

export function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "gradient-success";
      case "inactive":
        return "";
      case "suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "";
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start gap-6 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {user.role.replace("-", " ")}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {user.createdAt}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.assignedSurveys}</p>
                  <p className="text-xs text-muted-foreground">Assigned Surveys</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-success/10 p-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.completedResponses}</p>
                  <p className="text-xs text-muted-foreground">Completed Responses</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-accent/10 p-2">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.avgResponseTime}</p>
                  <p className="text-xs text-muted-foreground">Avg Response Time</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-warning/10 p-2">
                  <Award className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${getPerformanceColor(user.performanceScore)}`}>
                    {user.performanceScore}%
                  </p>
                  <p className="text-xs text-muted-foreground">Performance Score</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="surveys">Surveys</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="device">Device</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Weekly Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                          <XAxis dataKey="week" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(0, 0%, 100%)",
                              border: "1px solid hsl(214, 32%, 91%)",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="responses"
                            stroke="hsl(199, 89%, 48%)"
                            fill="hsl(199, 89%, 48%)"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Survey Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Survey Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={surveyBreakdown} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                          <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(0, 0%, 100%)",
                              border: "1px solid hsl(214, 32%, 91%)",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar
                            dataKey="completed"
                            fill="hsl(172, 66%, 50%)"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy Rate</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Quality Score</span>
                        <span className="font-medium">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="surveys" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assigned Surveys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Customer Satisfaction 2024", status: "active", progress: 85 },
                      { name: "Employee Engagement Survey", status: "active", progress: 62 },
                      { name: "Field Survey - Region A", status: "active", progress: 45 },
                      { name: "Market Research Q1", status: "completed", progress: 100 },
                      { name: "Brand Awareness Study", status: "paused", progress: 30 },
                    ].map((survey, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{survey.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <Progress value={survey.progress} className="h-2" />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">{survey.progress}%</span>
                          <Badge
                            className={survey.status === "active" ? "gradient-success" : ""}
                            variant={survey.status === "active" ? "default" : "secondary"}
                          >
                            {survey.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          {activity.survey !== "-" && (
                            <p className="text-sm text-muted-foreground">{activity.survey}</p>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="device" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Assigned Device
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Device ID</span>
                        <code className="bg-muted px-2 py-1 rounded text-sm">{user.deviceId}</code>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Device Type</span>
                        <span className="font-medium">Smartphone</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">OS</span>
                        <span className="font-medium">Android 14</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">App Version</span>
                        <span className="font-medium">v2.5.1</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="gradient-success">Online</Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Battery</span>
                        <span className="font-medium text-success">85%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span className="font-medium">2 minutes ago</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Storage Used</span>
                        <span className="font-medium">1.2 GB</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">Edit User</Button>
            <Button>Assign Survey</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
