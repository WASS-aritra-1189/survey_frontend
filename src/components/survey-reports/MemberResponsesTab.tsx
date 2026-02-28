import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Eye,
  Download,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Member response data with detailed answers
const memberResponses = [
  {
    id: "MR-001",
    respondentId: "U-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    avatar: "JD",
    location: "New York, NY",
    department: "Sales",
    startedAt: "2024-01-20 09:15:00",
    completedAt: "2024-01-20 09:23:45",
    duration: "8m 45s",
    status: "complete" as const,
    score: 92,
    responseQuality: 95,
    deviceUsed: "iPhone 15 Pro",
    platform: "iOS App",
    answers: [
      { questionId: "Q1", question: "Overall satisfaction?", type: "rating", answer: "5", maxScore: 5 },
      { questionId: "Q2", question: "How likely to recommend?", type: "nps", answer: "9", maxScore: 10 },
      { questionId: "Q3", question: "Service quality rating", type: "rating", answer: "4", maxScore: 5 },
      { questionId: "Q4", question: "What did you like most?", type: "text", answer: "The quick response time and professional staff were excellent." },
      { questionId: "Q5", question: "Areas for improvement?", type: "text", answer: "Could improve the mobile app experience." },
      { questionId: "Q6", question: "Preferred communication", type: "choice", answer: "Email" },
    ],
    sentimentScore: 85,
    tags: ["Promoter", "Loyal Customer", "High Value"],
  },
  {
    id: "MR-002",
    respondentId: "U-002",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 234 567 8901",
    avatar: "SW",
    location: "Los Angeles, CA",
    department: "Marketing",
    startedAt: "2024-01-20 10:30:00",
    completedAt: "2024-01-20 10:42:15",
    duration: "12m 15s",
    status: "complete" as const,
    score: 88,
    responseQuality: 90,
    deviceUsed: "MacBook Pro",
    platform: "Web Browser",
    answers: [
      { questionId: "Q1", question: "Overall satisfaction?", type: "rating", answer: "4", maxScore: 5 },
      { questionId: "Q2", question: "How likely to recommend?", type: "nps", answer: "8", maxScore: 10 },
      { questionId: "Q3", question: "Service quality rating", type: "rating", answer: "5", maxScore: 5 },
      { questionId: "Q4", question: "What did you like most?", type: "text", answer: "Great customer support and comprehensive documentation." },
      { questionId: "Q5", question: "Areas for improvement?", type: "text", answer: "Pricing could be more competitive." },
      { questionId: "Q6", question: "Preferred communication", type: "choice", answer: "Phone" },
    ],
    sentimentScore: 78,
    tags: ["Passive", "Frequent User"],
  },
  {
    id: "MR-003",
    respondentId: "U-003",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 234 567 8902",
    avatar: "MB",
    location: "Chicago, IL",
    department: "Operations",
    startedAt: "2024-01-20 14:00:00",
    completedAt: "2024-01-20 14:08:30",
    duration: "8m 30s",
    status: "complete" as const,
    score: 75,
    responseQuality: 82,
    deviceUsed: "Samsung Galaxy S23",
    platform: "Android App",
    answers: [
      { questionId: "Q1", question: "Overall satisfaction?", type: "rating", answer: "3", maxScore: 5 },
      { questionId: "Q2", question: "How likely to recommend?", type: "nps", answer: "6", maxScore: 10 },
      { questionId: "Q3", question: "Service quality rating", type: "rating", answer: "4", maxScore: 5 },
      { questionId: "Q4", question: "What did you like most?", type: "text", answer: "Product features are useful." },
      { questionId: "Q5", question: "Areas for improvement?", type: "text", answer: "Need better onboarding process and more tutorials." },
      { questionId: "Q6", question: "Preferred communication", type: "choice", answer: "Email" },
    ],
    sentimentScore: 60,
    tags: ["Detractor", "New Customer"],
  },
  {
    id: "MR-004",
    respondentId: "U-004",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 234 567 8903",
    avatar: "ED",
    location: "Houston, TX",
    department: "HR",
    startedAt: "2024-01-20 11:45:00",
    completedAt: null,
    duration: "5m 20s",
    status: "partial" as const,
    score: 45,
    responseQuality: 50,
    deviceUsed: "iPad Pro",
    platform: "iOS App",
    answers: [
      { questionId: "Q1", question: "Overall satisfaction?", type: "rating", answer: "4", maxScore: 5 },
      { questionId: "Q2", question: "How likely to recommend?", type: "nps", answer: "7", maxScore: 10 },
    ],
    sentimentScore: 65,
    tags: ["Incomplete"],
  },
  {
    id: "MR-005",
    respondentId: "U-005",
    name: "Robert Chen",
    email: "robert.chen@email.com",
    phone: "+1 234 567 8904",
    avatar: "RC",
    location: "San Francisco, CA",
    department: "Engineering",
    startedAt: "2024-01-20 16:20:00",
    completedAt: "2024-01-20 16:35:00",
    duration: "15m 00s",
    status: "complete" as const,
    score: 98,
    responseQuality: 100,
    deviceUsed: "ThinkPad X1",
    platform: "Web Browser",
    answers: [
      { questionId: "Q1", question: "Overall satisfaction?", type: "rating", answer: "5", maxScore: 5 },
      { questionId: "Q2", question: "How likely to recommend?", type: "nps", answer: "10", maxScore: 10 },
      { questionId: "Q3", question: "Service quality rating", type: "rating", answer: "5", maxScore: 5 },
      { questionId: "Q4", question: "What did you like most?", type: "text", answer: "Exceptional product quality and outstanding support team. The platform has significantly improved our workflow efficiency." },
      { questionId: "Q5", question: "Areas for improvement?", type: "text", answer: "API documentation could be more detailed." },
      { questionId: "Q6", question: "Preferred communication", type: "choice", answer: "In-app Chat" },
    ],
    sentimentScore: 95,
    tags: ["Promoter", "Power User", "Enterprise"],
  },
];

// Response distribution for pie chart
const responseDistribution = [
  { name: "Promoters (9-10)", value: 45, color: "hsl(var(--success))" },
  { name: "Passives (7-8)", value: 35, color: "hsl(var(--warning))" },
  { name: "Detractors (0-6)", value: 20, color: "hsl(var(--destructive))" },
];

// Score breakdown by category
const categoryScores = [
  { category: "Satisfaction", score: 4.2, fullMark: 5 },
  { category: "Recommendation", score: 8.1, fullMark: 10 },
  { category: "Service", score: 4.5, fullMark: 5 },
  { category: "Value", score: 3.9, fullMark: 5 },
  { category: "Support", score: 4.6, fullMark: 5 },
];

// Response quality distribution
const qualityDistribution = [
  { range: "90-100%", count: 28, fill: "hsl(var(--success))" },
  { range: "80-89%", count: 35, fill: "hsl(var(--primary))" },
  { range: "70-79%", count: 22, fill: "hsl(var(--warning))" },
  { range: "60-69%", count: 10, fill: "hsl(var(--muted-foreground))" },
  { range: "<60%", count: 5, fill: "hsl(var(--destructive))" },
];

export function MemberResponsesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<typeof memberResponses[0] | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredResponses = memberResponses.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openMemberDetail = (member: typeof memberResponses[0]) => {
    setSelectedMember(member);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{memberResponses.length}</p>
              <p className="text-sm text-muted-foreground">Total Respondents</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-3">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {memberResponses.filter((r) => r.status === "complete").length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-3">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {(memberResponses.reduce((acc, r) => acc + r.score, 0) / memberResponses.length).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent p-3">
              <TrendingUp className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {(memberResponses.reduce((acc, r) => acc + r.sentimentScore, 0) / memberResponses.length).toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">Sentiment Score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* NPS Distribution */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              NPS Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={responseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {responseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {responseDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Radar */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4" />
              Score by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={categoryScores}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Quality */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Response Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={qualityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="range" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Member Response Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Individual Member Responses
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px]">Member</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Quality</TableHead>
                <TableHead className="text-center">Sentiment</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {member.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{member.department}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        member.status === "complete" && "bg-success/10 text-success",
                        member.status === "partial" && "bg-warning/10 text-warning"
                      )}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "font-semibold",
                        member.score >= 80 && "text-success",
                        member.score >= 60 && member.score < 80 && "text-warning",
                        member.score < 60 && "text-destructive"
                      )}
                    >
                      {member.score}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={member.responseQuality} className="h-2 w-16" />
                      <span className="text-xs text-muted-foreground">{member.responseQuality}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        member.sentimentScore >= 80 && "bg-success/10 text-success",
                        member.sentimentScore >= 50 && member.sentimentScore < 80 && "bg-warning/10 text-warning",
                        member.sentimentScore < 50 && "bg-destructive/10 text-destructive"
                      )}
                    >
                      {member.sentimentScore >= 80 ? "😊" : member.sentimentScore >= 50 ? "😐" : "😞"}
                      {member.sentimentScore}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {member.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openMemberDetail(member)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {selectedMember?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{selectedMember?.name}</p>
                <p className="text-sm font-normal text-muted-foreground">{selectedMember?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedMember && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pr-4">
                {/* Response Overview */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">{selectedMember.score}%</p>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{selectedMember.responseQuality}%</p>
                    <p className="text-xs text-muted-foreground">Response Quality</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{selectedMember.sentimentScore}</p>
                    <p className="text-xs text-muted-foreground">Sentiment Score</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{selectedMember.duration}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                </div>

                {/* Respondent Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Respondent Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMember.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMember.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMember.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Started: {format(new Date(selectedMember.startedAt), "MMM dd, yyyy HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Device: {selectedMember.deviceUsed} ({selectedMember.platform})</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Answers */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Detailed Answers ({selectedMember.answers.length} questions)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {selectedMember.answers.map((answer, i) => (
                        <AccordionItem key={answer.questionId} value={answer.questionId}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {i + 1}
                              </span>
                              <div>
                                <p className="font-medium text-sm">{answer.question}</p>
                                <p className="text-xs text-muted-foreground capitalize">{answer.type}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-9 pt-2">
                              {answer.type === "rating" || answer.type === "nps" ? (
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: Number(answer.maxScore) }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={cn(
                                          "h-5 w-5",
                                          i < Number(answer.answer)
                                            ? "text-warning fill-warning"
                                            : "text-muted-foreground/30"
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-semibold">
                                    {answer.answer}/{answer.maxScore}
                                  </span>
                                </div>
                              ) : answer.type === "choice" ? (
                                <Badge variant="secondary">{answer.answer}</Badge>
                              ) : (
                                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                                  "{answer.answer}"
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Tags */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
