import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Smartphone,
  Monitor,
  Filter,
  Download,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Loader2,
  X,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSurveys, fetchSurveyById, updateSurvey, updateSurveyStatus, deleteSurvey } from "@/store/surveySlice";
import { Survey } from "@/types/survey";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Switch } from "@/components/ui/switch";

import { surveyService } from "@/services/surveyService";

export default function Surveys() {
  const dispatch = useAppDispatch();
  const { tokens } = useAuthStore();
  const { data: surveys, total, isLoading, currentSurvey } = useAppSelector((state) => state.survey);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", target: 1000, requiresLocationValidation: false });
  const [isUpdating, setIsUpdating] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]);
  const [questionsTotal, setQuestionsTotal] = useState(0);
  const [editQuestions, setEditQuestions] = useState<any[]>([]);



  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveys({ token: tokens.accessToken, limit: 50 }));
    }
  }, [dispatch, tokens]);

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || survey.status?.toLowerCase() === statusFilter;
    const matchesPlatform = platformFilter === "all" || 
      (platformFilter === "mobile" && survey.deviceType.includes("ANDROID") && !survey.deviceType.includes("WEB")) ||
      (platformFilter === "web" && survey.deviceType.includes("WEB") && !survey.deviceType.includes("ANDROID")) ||
      (platformFilter === "both" && survey.deviceType.includes("ANDROID") && survey.deviceType.includes("WEB"));
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const getStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="gradient-success">Active</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "INACTIVE":
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  const getPlatformIcon = (deviceType: string[]) => {
    const hasAndroid = deviceType.includes("ANDROID");
    const hasWeb = deviceType.includes("WEB");
    const hasIOS = deviceType.includes("IOS");
    
    if ((hasAndroid || hasIOS) && hasWeb) {
      return (
        <div className="flex gap-1">
          <Monitor className="h-4 w-4" />
          <Smartphone className="h-4 w-4" />
        </div>
      );
    } else if (hasWeb) {
      return <Monitor className="h-4 w-4" />;
    } else if (hasAndroid || hasIOS) {
      return <Smartphone className="h-4 w-4" />;
    }
    return null;
  };

  const handleViewSurvey = async (survey: Survey) => {
    console.log("handleViewSurvey called", survey);
    if (!tokens?.accessToken || !survey.id) return;
    
    setIsDetailOpen(true);
    setIsLoadingDetail(true);
    try {
      const response = await surveyService.getQuestions(tokens.accessToken, survey.id);
      setSurveyQuestions(response.data.data || []);
      setQuestionsTotal(response.data.total || 0);
      await dispatch(fetchSurveyById({ token: tokens.accessToken, id: survey.id })).unwrap();
    } catch (error) {
      toast.error("Failed to load survey details");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleEditSurvey = async (survey: Survey) => {
    if (!tokens?.accessToken || !survey.id) return;
    setSelectedSurvey(survey);
    setEditForm({
      title: survey.title,
      description: survey.description || "",
      target: survey.target,
      requiresLocationValidation: survey.requiresLocationValidation || false,
    });
    setIsEditOpen(true);
  };

  const handleUpdateSurvey = async () => {
    if (!tokens?.accessToken || !selectedSurvey?.id) return;
    
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(updateSurvey({
        id: selectedSurvey.id,
        data: editForm,
        token: tokens.accessToken,
      })).unwrap();
      toast.success("Survey updated successfully!");
      setIsEditOpen(false);
      dispatch(fetchSurveys({ token: tokens.accessToken, limit: 50 }));
    } catch (error) {
      toast.error("Failed to update survey");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSurvey = async () => {
    if (!tokens?.accessToken || !surveyToDelete?.id) return;
    try {
      await dispatch(deleteSurvey({ id: surveyToDelete.id, token: tokens.accessToken })).unwrap();
      toast.success(`Survey "${surveyToDelete.title}" deleted successfully!`);
      setSurveyToDelete(null);
      dispatch(fetchSurveys({ token: tokens.accessToken, limit: 50 }));
    }catch (error) {
      toast.error("Failed to delete survey");
    }
  };

  const handleDuplicate = (survey: Survey) => {
    toast.success(`Survey "${survey.title}" duplicated successfully!`);
  };

  const handleToggleStatus = async (survey: Survey) => {
    if (!tokens?.accessToken || !survey.id) return;
    const newStatus = survey.status === "ACTIVE" ? "DEACTIVE" : "ACTIVE";
    try {
      await dispatch(updateSurveyStatus({ id: survey.id, status: newStatus, token: tokens.accessToken })).unwrap();
      toast.success(`Survey ${newStatus.toLowerCase()} successfully!`);
      dispatch(fetchSurveys({ token: tokens.accessToken, limit: 50 }));
    } catch (error) {
      toast.error("Failed to update survey status");
    }
  };

  

  const handleExport = () => {
    toast.success("Exporting surveys data...");
  };

  const stats = {
    total: surveys.length,
    active: surveys.filter(s => s.status === "ACTIVE").length,
    totalResponses: surveys.reduce((acc, s) => acc + (s.totalResponses || 0), 0),
    avgCompletion: surveys.length > 0 ? Math.round(surveys.reduce((acc, s) => acc + ((s.totalResponses || 0) / s.target * 100), 0) / surveys.length) : 0,
  };

  const renderDetailContent = () => {
    if (isLoadingDetail) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!currentSurvey) {
      return <p className="text-center py-4 text-muted-foreground">No survey data available</p>;
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{currentSurvey.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{currentSurvey.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="mt-1">{getStatusBadge(currentSurvey.status)}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Target Responses</span>
              <p className="font-medium mt-1">{currentSurvey.target.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Responses</span>
              <p className="font-medium mt-1">{(currentSurvey.totalResponses || 0).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Devices</span>
              <div className="flex items-center gap-2 mt-1">
                {getPlatformIcon(currentSurvey.deviceType)}
                <span className="text-sm">{currentSurvey.deviceType.join(", ")}</span>
              </div>
            </div>
            {currentSurvey.accessToken && (
              <div>
                <span className="text-sm text-muted-foreground">Access Token</span>
                <p className="font-medium mt-1">{currentSurvey.accessToken}</p>
              </div>
            )}
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Progress</span>
            <div className="flex items-center gap-2 mt-2">
              <Progress 
                value={((currentSurvey.totalResponses || 0) / currentSurvey.target) * 100} 
                className="h-2 flex-1" 
              />
              <span className="text-sm font-medium">
                {Math.round(((currentSurvey.totalResponses || 0) / currentSurvey.target) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Questions ({questionsTotal})</h4>
          {surveyQuestions && surveyQuestions.length > 0 ? (
            <div className="space-y-3">
              {surveyQuestions.map((q, index) => (
                <Card key={q.id || `question-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{q.questionText}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {q.type?.replace("_", " ") || "N/A"}
                          </Badge>
                          {q.isRequired && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">Options:</span>
                            <ul className="list-disc list-inside text-sm mt-1">
                              {q.options.map((opt, optIndex) => (
                                <li key={`${q.id || index}-opt-${optIndex}`}>
                                  {typeof opt === 'string' ? opt : opt.optionText}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No questions added yet</p>
          )}
        </div>
      </div>
    );
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (filteredSurveys.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No surveys found</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Survey Title</TableHead>
            <TableHead>Access Token</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Devices</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Responses</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Public URL</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSurveys.map((survey) => (
            <TableRow key={survey.id} className="group cursor-pointer" onClick={() => handleViewSurvey(survey)}>
              <TableCell>
                <div>
                  <span className="font-medium">{survey.title}</span>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">{survey.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">{survey.accessToken}</Badge>
              </TableCell>
              <TableCell>{getStatusBadge(survey.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getPlatformIcon(survey.deviceType)}
                  <span className="text-xs">{survey.deviceType.join(", ")}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={((survey.totalResponses || 0) / survey.target) * 100} 
                    className="h-2 w-20" 
                  />
                  <span className="text-xs text-muted-foreground">
                    {Math.round(((survey.totalResponses || 0) / survey.target) * 100)}%
                  </span>
                </div>
              </TableCell>
              <TableCell>{(survey.totalResponses || 0).toLocaleString()}</TableCell>
              <TableCell>{survey.target.toLocaleString()}</TableCell>
              <TableCell>{survey.questions?.length || 0}</TableCell>
              <TableCell>
                {survey.publicUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(survey.publicUrl, '_blank');
                    }}
                    className="h-8 px-2"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open
                  </Button>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={(e) => { 
                      e.preventDefault();
                      if (survey.publicUrl) {
                        window.open(survey.publicUrl, '_blank');
                      }
                    }}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Public URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { 
                      e.preventDefault();
                      console.log("View Details clicked");
                      handleViewSurvey(survey); 
                    }}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { 
                      e.preventDefault();
                      console.log("Edit clicked", survey);
                      handleEditSurvey(survey); 
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { 
                      e.preventDefault();
                      handleToggleStatus(survey); 
                    }}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {survey.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { 
                      e.preventDefault();
                      console.log("Duplicate clicked");
                      handleDuplicate(survey); 
                    }}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onSelect={(e) => { 
                      e.preventDefault();
                      console.log("Delete clicked");
                      setSurveyToDelete(survey); 
                    }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <AdminLayout title="Surveys" subtitle="Manage and create surveys">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Surveys</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-success/10 p-3">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Surveys</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent/10 p-3">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalResponses.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Responses</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-warning/10 p-3">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgCompletion}%</p>
              <p className="text-sm text-muted-foreground">Avg Completion</p>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Surveys</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search surveys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
              <Link to="/surveys/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Create Survey
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderTableContent()}

          {!isLoading && filteredSurveys.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSurveys.length} of {total} surveys
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Survey</DialogTitle>
            <DialogDescription>
              Update survey information (questions cannot be edited)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Enter survey title"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter survey description"
                rows={3}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-target">Target Responses *</Label>
              <Input
                id="edit-target"
                type="number"
                value={editForm.target}
                onChange={(e) => setEditForm({ ...editForm, target: parseInt(e.target.value) || 0 })}
                placeholder="Enter target responses"
                autoComplete="off"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>Require Location Validation</Label>
                  <p className="text-xs text-muted-foreground">Enable GPS location constraints</p>
                </div>
              </div>
              <Switch
                checked={editForm.requiresLocationValidation}
                onCheckedChange={(checked) => setEditForm({ ...editForm, requiresLocationValidation: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSurvey} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Survey"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!surveyToDelete}
        onOpenChange={() => setSurveyToDelete(null)}
        title="Delete Survey"
        description={`Are you sure you want to delete "${surveyToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDeleteSurvey}
      />

      {/* Survey Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Survey Details
            </DialogTitle>
            <DialogDescription>
              View complete survey information and questions
            </DialogDescription>
          </DialogHeader>
          {renderDetailContent()}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
