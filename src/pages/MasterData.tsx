import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchSurveyTypes, createSurveyType, updateSurveyType, deleteSurveyType, updateSurveyTypeStatus } from "@/store/surveyTypeSlice";
import { fetchAccountLevels, createAccountLevel, deleteAccountLevel, changeAccountLevelStatus, updateAccountLevel } from "@/store/accountLevelSlice";
import { fetchDesignations, createDesignation, updateDesignation, deleteDesignation } from "@/store/designationSlice";
import { fetchSettings } from "@/store/settingsSlice";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  FileText,
  Users,
  Smartphone,
  GripVertical,
  Shield
} from "lucide-react";
import { toast } from "sonner";
// import { useAuthStore } from "@/store/authStore";
import { AdminLayout } from "@/components/layout/AdminLayout";

const userRoles = [
  { id: 1, name: "Field Agent", code: "FA", permissions: 5, users: 45 },
  { id: 2, name: "Supervisor", code: "SUP", permissions: 12, users: 12 },
  { id: 3, name: "Manager", code: "MGR", permissions: 18, users: 5 },
  { id: 4, name: "Admin", code: "ADM", permissions: 25, users: 2 },
];

const deviceTypes = [
  { id: 1, name: "Android Phone", code: "AND", os: "Android 10+", devices: 35 },
  { id: 2, name: "iOS Phone", code: "IOS", os: "iOS 14+", devices: 28 },
  { id: 3, name: "Android Tablet", code: "TAB-A", os: "Android 10+", devices: 12 },
  { id: 4, name: "iPad", code: "TAB-I", os: "iPadOS 14+", devices: 8 },
];

export default function MasterData() {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens } = useAuthStore();
  const { surveyTypes, loading } = useSelector((state: RootState) => state.surveyType);
  const { levels, loading: levelsLoading } = useSelector((state: RootState) => state.accountLevel);
  const { designations, loading: designationsLoading } = useSelector((state: RootState) => state.designation);
  const { data: settings = [] } = useSelector((state: RootState) => state.settings);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [editingType, setEditingType] = useState<any>(null);
  const [form, setForm] = useState({ name: "", templateQuestions: [] as any[] });
  const [levelForm, setLevelForm] = useState({ name: "", priority: 1, settingId: "" });
  const [isDesignationDialogOpen, setIsDesignationDialogOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<any>(null);
  const [designationForm, setDesignationForm] = useState({ name: "", description: "", priority: 1, status: "ACTIVE", settingId: "" });

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveyTypes(tokens.accessToken));
      dispatch(fetchAccountLevels(tokens.accessToken));
      dispatch(fetchDesignations(tokens.accessToken));
      dispatch(fetchSettings(tokens.accessToken));
    }
  }, [dispatch, tokens]);

  const handleSubmit = async () => {
    if (!tokens?.accessToken) return;
    try {
      const cleanedQuestions = form.templateQuestions.filter(q => q && typeof q === 'object' && q.type && q.title);
      const dataToSend = { ...form, templateQuestions: cleanedQuestions };
      console.log('Submitting:', JSON.stringify(dataToSend, null, 2));
      
      if (editingType) {
        await dispatch(updateSurveyType({ id: editingType.id, data: dataToSend, token: tokens.accessToken })).unwrap();
        toast.success("Survey type updated");
      } else {
        await dispatch(createSurveyType({ data: dataToSend, token: tokens.accessToken })).unwrap();
        toast.success("Survey type created");
      }
      setIsDialogOpen(false);
      setEditingType(null);
      setForm({ name: "", templateQuestions: [] });
    } catch (error) {
      toast.error("Failed to save survey type");
    }
  };

  const handleDelete = async (id: string) => {
    if (!tokens?.accessToken) return;
    try {
      await dispatch(deleteSurveyType({ id, token: tokens.accessToken })).unwrap();
      toast.success("Survey type deleted");
    } catch (error) {
      toast.error("Failed to delete survey type");
    }
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    if (!tokens?.accessToken) return;
    try {
      await dispatch(updateSurveyTypeStatus({ id, isActive, token: tokens.accessToken })).unwrap();
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAdd = (type: string) => {
    setEditingType(null);
    setForm({ name: "", templateQuestions: [] });
    setIsDialogOpen(true);
  };

  const addQuestion = () => {
    setForm({ ...form, templateQuestions: [...form.templateQuestions, { type: "text", title: "", options: [] }] });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...form.templateQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, templateQuestions: updated });
  };

  const deleteQuestion = (index: number) => {
    setForm({ ...form, templateQuestions: form.templateQuestions.filter((_, i) => i !== index) });
  };

  const addOption = (qIndex: number) => {
    const updated = [...form.templateQuestions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options = [...updated[qIndex].options, ""];
    setForm({ ...form, templateQuestions: updated });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...form.templateQuestions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options[oIndex] = value;
    setForm({ ...form, templateQuestions: updated });
  };

  const deleteOption = (qIndex: number, oIndex: number) => {
    const updated = [...form.templateQuestions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options = updated[qIndex].options.filter((_: any, i: number) => i !== oIndex);
    setForm({ ...form, templateQuestions: updated });
  };

  const handleAddLevel = async () => {
    if (!tokens?.accessToken) return;
    if (!levelForm.name || !levelForm.settingId) {
      toast.error("Name and Setting are required");
      return;
    }
    try {
      if (editingLevel) {
        await dispatch(updateAccountLevel({ token: tokens.accessToken, id: editingLevel.id, data: levelForm })).unwrap();
        toast.success("Account level updated");
      } else {
        await dispatch(createAccountLevel({ token: tokens.accessToken, data: levelForm })).unwrap();
        toast.success("Account level created");
      }
      setIsLevelDialogOpen(false);
      setEditingLevel(null);
      setLevelForm({ name: "", priority: 1, settingId: "" });
    } catch (error) {
      toast.error(editingLevel ? "Failed to update account level" : "Failed to create account level");
    }
  };

  const handleDeleteLevel = async (id: string) => {
    if (!tokens?.accessToken) return;
    try {
      await dispatch(deleteAccountLevel({ token: tokens.accessToken, id })).unwrap();
      toast.success("Account level deleted");
    } catch (error) {
      toast.error("Failed to delete account level");
    }
  };

  const handleLevelStatusChange = async (id: string, currentStatus: string) => {
    if (!tokens?.accessToken) return;
    const newStatus = currentStatus === "ACTIVE" ? "DEACTIVE" : "ACTIVE";
    try {
      await dispatch(changeAccountLevelStatus({ token: tokens.accessToken, id, status: newStatus })).unwrap();
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAddDesignation = async () => {
    if (!tokens?.accessToken) return;
    if (!designationForm.name || !designationForm.settingId) {
      toast.error("Name and Setting are required");
      return;
    }
    try {
      if (editingDesignation) {
        await dispatch(updateDesignation({ token: tokens.accessToken, id: editingDesignation.id, data: designationForm })).unwrap();
        toast.success("Designation updated");
      } else {
        await dispatch(createDesignation({ token: tokens.accessToken, data: designationForm })).unwrap();
        toast.success("Designation created");
      }
      setIsDesignationDialogOpen(false);
      setEditingDesignation(null);
      setDesignationForm({ name: "", description: "", priority: 1, status: "ACTIVE", settingId: "" });
    } catch (error) {
      toast.error(editingDesignation ? "Failed to update designation" : "Failed to create designation");
    }
  };

  const handleDeleteDesignation = async (id: string) => {
    if (!tokens?.accessToken) return;
    try {
      await dispatch(deleteDesignation({ token: tokens.accessToken, id })).unwrap();
      toast.success("Designation deleted");
    } catch (error) {
      toast.error("Failed to delete designation");
    }
  };

  return (
    <AdminLayout title="Master Data" subtitle="Manage system master data and configurations">
      <Tabs defaultValue="surveys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="surveys" className="gap-2">
            <FileText className="h-4 w-4" />
            Survey Types
          </TabsTrigger>
          <TabsTrigger value="levels" className="gap-2">
            <Users className="h-4 w-4" />
            Account Levels
          </TabsTrigger>
          <TabsTrigger value="designations" className="gap-2">
            <Shield className="h-4 w-4" />
            Designations
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Device Types
          </TabsTrigger>
        </TabsList>

        {/* Survey Types */}
        <TabsContent value="surveys">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Survey Types</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => handleAdd("Survey type")}>
                        <Plus className="h-4 w-4" />
                        Add Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingType ? "Edit Survey Type" : "Add Survey Type"}</DialogTitle>
                        <DialogDescription>Create a survey type with template questions</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Type Name</Label>
                          <Input placeholder="e.g., Customer Feedback" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Template Questions</Label>
                          {form.templateQuestions.length > 0 && form.templateQuestions.map((q, qIndex) => (
                            q && typeof q === 'object' && (
                            <Card key={qIndex} className="p-3">
                              <div className="flex items-start gap-2">
                                <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                                <div className="flex-1 space-y-2">
                                  <div className="flex gap-2">
                                    <Select value={q.type} onValueChange={(v) => updateQuestion(qIndex, "type", v)}>
                                      <SelectTrigger className="w-40">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" onClick={() => deleteQuestion(qIndex)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <Input placeholder="Question text" value={q.title} onChange={(e) => updateQuestion(qIndex, "title", e.target.value)} />
                                  {q.type === "multiple-choice" && (
                                    <div className="space-y-1 pl-4">
                                      {(q.options || []).map((opt: string, oIndex: number) => (
                                        <div key={oIndex} className="flex gap-2">
                                          <Input placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} />
                                          <Button variant="ghost" size="icon" onClick={() => deleteOption(qIndex, oIndex)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button variant="outline" size="sm" onClick={() => addOption(qIndex)}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Option
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                            )
                          ))}
                          <Button variant="outline" onClick={addQuestion} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Add Question
                          </Button>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Surveys</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveyTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{type.surveyCount || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={type.isActive ? "gradient-success" : ""} variant={type.isActive ? "default" : "secondary"}>
                          {type.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { 
                            console.log('Editing type:', type);
                            setEditingType(type); 
                            const questions = Array.isArray(type.templateQuestions) 
                              ? type.templateQuestions.filter(q => q && typeof q === 'object' && q.type && q.title) 
                              : [];
                            setForm({ name: type.name, templateQuestions: questions }); 
                            setIsDialogOpen(true); 
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(type.id)}>
                            <Trash2 className="h-4 w-4" />
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

        {/* Account Levels */}
        <TabsContent value="levels">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Account Levels</CardTitle>
                <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                      Add Level
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingLevel ? "Edit Account Level" : "Add Account Level"}</DialogTitle>
                      <DialogDescription>{editingLevel ? "Update account level" : "Create a new account level"}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input placeholder="e.g., Premium Level" value={levelForm.name} onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority *</Label>
                        <Input type="number" value={levelForm.priority} onChange={(e) => setLevelForm({ ...levelForm, priority: parseInt(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Setting *</Label>
                        <Select value={levelForm.settingId} onValueChange={(val) => setLevelForm({ ...levelForm, settingId: val })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select setting" />
                          </SelectTrigger>
                          <SelectContent>
                            {settings.map((setting: any) => (
                              <SelectItem key={setting.id} value={setting.id}>{setting.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => { setIsLevelDialogOpen(false); setEditingLevel(null); setLevelForm({ name: "", priority: 1, settingId: "" }); }}>Cancel</Button>
                      <Button onClick={handleAddLevel}>{editingLevel ? "Update" : "Add"} Level</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((level) => (
                    <TableRow key={level.id}>
                      <TableCell className="font-medium">{level.name}</TableCell>
                      <TableCell>{level.priority}</TableCell>
                      <TableCell>
                        <Badge 
                          className={level.status === "ACTIVE" ? "gradient-success cursor-pointer" : "cursor-pointer"}
                          onClick={() => handleLevelStatusChange(level.id, level.status)}
                        >
                          {level.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(level.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingLevel(level); setLevelForm({ name: level.name, priority: level.priority, settingId: level.settingId }); setIsLevelDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteLevel(level.id)}>
                            <Trash2 className="h-4 w-4" />
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

        {/* Designations */}
        <TabsContent value="designations">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Designations</CardTitle>
                <Dialog open={isDesignationDialogOpen} onOpenChange={setIsDesignationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                      Add Designation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingDesignation ? "Edit Designation" : "Add Designation"}</DialogTitle>
                      <DialogDescription>{editingDesignation ? "Update designation" : "Create a new designation"}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input placeholder="e.g., Software Engineer" value={designationForm.name} onChange={(e) => setDesignationForm({ ...designationForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input placeholder="e.g., Develops and maintains software" value={designationForm.description} onChange={(e) => setDesignationForm({ ...designationForm, description: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority *</Label>
                        <Input type="number" value={designationForm.priority} onChange={(e) => setDesignationForm({ ...designationForm, priority: parseInt(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Status *</Label>
                        <Select value={designationForm.status} onValueChange={(val) => setDesignationForm({ ...designationForm, status: val })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Setting *</Label>
                        <Select value={designationForm.settingId} onValueChange={(val) => setDesignationForm({ ...designationForm, settingId: val })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select setting" />
                          </SelectTrigger>
                          <SelectContent>
                            {settings.map((setting: any) => (
                              <SelectItem key={setting.id} value={setting.id}>{setting.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => { setIsDesignationDialogOpen(false); setEditingDesignation(null); setDesignationForm({ name: "", description: "", priority: 1, status: "ACTIVE", settingId: "" }); }}>Cancel</Button>
                      <Button onClick={handleAddDesignation}>{editingDesignation ? "Update" : "Add"} Designation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designations.map((designation) => (
                    <TableRow key={designation.id}>
                      <TableCell className="font-medium">{designation.name}</TableCell>
                      <TableCell>{designation.description}</TableCell>
                      <TableCell>{designation.priority}</TableCell>
                      <TableCell>
                        <Badge className={designation.status === "ACTIVE" ? "gradient-success" : ""}>
                          {designation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingDesignation(designation); setDesignationForm({ name: designation.name, description: designation.description, priority: designation.priority, status: designation.status, settingId: designation.settingId }); setIsDesignationDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteDesignation(designation.id)}>
                            <Trash2 className="h-4 w-4" />
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

        {/* Device Types */}
        <TabsContent value="devices">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Device Types</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Add Device Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device Type</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>OS Requirement</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceTypes.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{device.code}</code>
                      </TableCell>
                      <TableCell>{device.os}</TableCell>
                      <TableCell>{device.devices}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
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
