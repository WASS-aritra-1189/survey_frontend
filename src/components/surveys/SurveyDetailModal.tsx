import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Target,
  TrendingUp,
  Monitor,
  Smartphone,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Eye,
  Download,
  Edit,
} from "lucide-react";
import { Survey } from "@/data/dummyData";

interface SurveyDetailModalProps {
  survey: Survey | null;
  open: boolean;
  onClose: () => void;
}

const responsesTrend = [
  { day: "Mon", responses: 45 },
  { day: "Tue", responses: 62 },
  { day: "Wed", responses: 58 },
  { day: "Thu", responses: 74 },
  { day: "Fri", responses: 89 },
  { day: "Sat", responses: 56 },
  { day: "Sun", responses: 42 },
];

const completionDistribution = [
  { name: "Completed", value: 87, color: "hsl(172, 66%, 50%)" },
  { name: "Partial", value: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Abandoned", value: 5, color: "hsl(0, 84%, 60%)" },
];

const questionStats = [
  { question: "Q1: Overall satisfaction", avgScore: 4.2, responses: 1180 },
  { question: "Q2: Service quality", avgScore: 4.5, responses: 1165 },
  { question: "Q3: Recommendation", avgScore: 4.1, responses: 1150 },
  { question: "Q4: Value for money", avgScore: 3.8, responses: 1145 },
  { question: "Q5: Support quality", avgScore: 4.3, responses: 1120 },
];

const assignedUsers = [
  { name: "John Doe", responses: 156, status: "active" },
  { name: "Sarah Wilson", responses: 234, status: "active" },
  { name: "Mike Johnson", responses: 89, status: "inactive" },
  { name: "Emily Davis", responses: 187, status: "active" },
  { name: "Robert Chen", responses: 268, status: "active" },
];

export function SurveyDetailModal({ survey, open, onClose }: SurveyDetailModalProps) {
  if (!survey) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "gradient-success";
      case "draft":
        return "";
      case "completed":
        return "bg-accent text-accent-foreground";
      case "paused":
        return "bg-warning text-warning-foreground";
      default:
        return "";
    }
  };

  const progressPercentage = (survey.responses / survey.targetResponses) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Survey Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Survey Header */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{survey.name}</h2>
                  <Badge className={getStatusColor(survey.status)}>
                    {survey.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{survey.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {survey.platform === "mobile" && <Smartphone className="h-5 w-5 text-muted-foreground" />}
                {survey.platform === "web" && <Monitor className="h-5 w-5 text-muted-foreground" />}
                {survey.platform === "both" && (
                  <>
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  </>
                )}
                <span className="text-sm capitalize text-muted-foreground">{survey.platform}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Progress</span>
                <span className="font-medium">
                  {survey.responses.toLocaleString()} / {survey.targetResponses.toLocaleString()}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(1)}% of target reached
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{survey.questionCount}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-success/10 p-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">{survey.responses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Responses</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-accent/10 p-2">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold">{survey.assignedUsers}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-warning/10 p-2">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold">{survey.avgCompletionTime}</p>
                  <p className="text-xs text-muted-foreground">Avg Time</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{survey.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="users">Assigned Users</TabsTrigger>
              <TabsTrigger value="settings">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Response Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Daily Responses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={responsesTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                          <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
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

                {/* Completion Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Completion Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center">
                      <ResponsiveContainer width="50%" height="100%">
                        <PieChart>
                          <Pie
                            data={completionDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {completionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-3">
                        {completionDistribution.map((item) => (
                          <div key={item.name} className="flex items-center gap-3">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="flex-1 text-sm">{item.name}</span>
                            <span className="font-semibold">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Question Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Avg Score</TableHead>
                        <TableHead>Responses</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questionStats.map((q, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{q.question}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{q.avgScore}</span>
                              <span className="text-muted-foreground">/ 5</span>
                            </div>
                          </TableCell>
                          <TableCell>{q.responses.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="w-24">
                              <Progress value={(q.avgScore / 5) * 100} className="h-2" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assigned Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Responses Collected</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedUsers.map((user, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.responses}</TableCell>
                          <TableCell>
                            <Badge
                              className={user.status === "active" ? "gradient-success" : ""}
                              variant={user.status === "active" ? "default" : "secondary"}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Survey Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Survey ID</span>
                        <code className="bg-muted px-2 py-1 rounded text-sm">{survey.id}</code>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{survey.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Created By</span>
                        <span className="font-medium">{survey.createdBy}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Created At</span>
                        <span className="font-medium">{survey.createdAt}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{survey.updatedAt}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Platform</span>
                        <span className="font-medium capitalize">{survey.platform}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Target Responses</span>
                        <span className="font-medium">{survey.targetResponses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
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
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Survey
            </Button>
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              View Responses
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
