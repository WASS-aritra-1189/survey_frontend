import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, Download, Eye, CalendarIcon,
  FileSpreadsheet, FileText, CheckCircle, Star, TrendingUp,
  ChevronLeft, ChevronRight, User, MessageSquare, Loader2, X
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchResponses, clearResponses } from "@/store/responseSlice";
import { fetchSurveys } from "@/store/surveySlice";
import { SurveyResponse } from "@/services/responseService";
import { exportResponsesToCSV, exportResponsesToPDF } from "@/lib/exportUtils";

export default function Responses() {
  const dispatch = useAppDispatch();
  const { tokens } = useAuthStore();
  const { data: surveys } = useAppSelector((state) => state.survey);
  const { data: responses, total, isLoading } = useAppSelector((state) => state.response);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [surveyFilter, setSurveyFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveys({ token: tokens.accessToken, limit: 100 }));
    }
  }, [dispatch, tokens]);

  useEffect(() => {
    if (surveyFilter !== "all" && tokens?.accessToken) {
      dispatch(fetchResponses({
        token: tokens.accessToken,
        surveyId: surveyFilter,
        page,
        limit,
        search: searchQuery || undefined,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      }));
    } else {
      dispatch(clearResponses());
    }
  }, [surveyFilter, searchQuery, page, limit, startDate, endDate, dispatch, tokens]);

  const handleExport = (fmt: string) => {
    if (!selectedResponse && surveyFilter === 'all') {
      toast.error('Please select a survey first');
      return;
    }

    const dataToExport = selectedResponse ? [selectedResponse] : responses;
    
    if (fmt === 'pdf') {
      exportResponsesToPDF(dataToExport);
    } else if (fmt === 'excel' || fmt === 'csv') {
      exportResponsesToCSV(dataToExport);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Responses" subtitle="View and manage all survey responses with detailed analytics">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Total Responses", value: total.toString(), icon: FileText },
          { label: "Current Page", value: responses.length.toString(), icon: TrendingUp },
          { label: "Pages", value: totalPages.toString(), icon: CheckCircle },
          { label: "Per Page", value: limit.toString(), icon: Star },
        ].map(s => (
          <Card key={s.label} variant="stat" className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2"><s.icon className="h-5 w-5 text-primary" /></div>
            </div>
            <p className="text-2xl font-bold mt-2">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>All Responses</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleExport('csv')}><FileSpreadsheet className="h-4 w-4 mr-2" />CSV</Button>
                <Button variant="outline" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-2" />Excel</Button>
                <Button onClick={() => handleExport('pdf')}><Download className="h-4 w-4 mr-2" />PDF</Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search responses, surveys, respondents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
              {(startDate || endDate) && (
                <Button variant="ghost" size="icon" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Select value={surveyFilter} onValueChange={setSurveyFilter}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select Survey" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select Survey</SelectItem>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>{survey.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value="all" onValueChange={() => {}}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                </SelectContent>
              </Select>
              <Select value={limit.toString()} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : surveyFilter === "all" ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Please select a survey to view responses</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No responses found</p>
            </div>
          ) : (
            <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Response ID</TableHead>
                <TableHead>Respondent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Answers</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id} className="group">
                  <TableCell><code className="text-sm bg-muted px-2 py-1 rounded">{response.id.slice(0, 8)}</code></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/10 text-primary text-xs">{response.respondentName.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                      <p className="text-sm font-medium">{response.respondentName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{response.respondentContact}</TableCell>
                  <TableCell><Badge variant="secondary">{response.responses.length} answers</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{new Date(response.createdAt).toLocaleString()}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedResponse(response); setDetailOpen(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Showing {responses.length} of {total} responses</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          </>
          )}
        </CardContent>
      </Card>

      {/* Response Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedResponse && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-11 w-11"><AvatarFallback className="bg-primary/10 text-primary font-bold">{selectedResponse.respondentName.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <div>
                    <p className="text-lg">{selectedResponse.respondentName}</p>
                    <p className="text-sm text-muted-foreground font-normal">{selectedResponse.respondentContact}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />Contact: {selectedResponse.respondentContact}</div>
                  <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" />Submitted: {new Date(selectedResponse.createdAt).toLocaleString()}</div>
                  <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" />Updated: {new Date(selectedResponse.updatedAt).toLocaleString()}</div>
                </div>
                <Card className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{selectedResponse.responses.length}</p>
                  <p className="text-xs text-muted-foreground">Total Answers</p>
                </Card>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4" />Answers</h4>
                <div className="space-y-3">
                  {selectedResponse.responses.map((a, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Question ID: {a.questionId}</p>
                      <p className="text-sm font-medium">{a.answer}</p>
                    </div>
                  ))}
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
