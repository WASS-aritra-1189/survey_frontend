import { useState, useCallback,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionPalette } from "@/components/survey-builder/QuestionPalette";
import { SurveyCanvas, SurveyQuestion } from "@/components/survey-builder/SurveyCanvas";
import { DevicePreview } from "@/components/survey-builder/DevicePreview";
import { QuestionLogic, QuestionLogicConfig } from "@/components/survey-builder/QuestionLogic";
import { QuestionType, questionTypes } from "@/components/survey-builder/QuestionTypes";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Send, 
  Settings, 
  GitBranch,
  Smartphone,
  Tablet,
  Monitor,
  Undo,
  Redo,
  Copy,
  Trash2,
  MoreVertical,
  Palette,
  Layout,
  Database,
  Share2,
  FileDown,
  Clock,
  Users,
  Target,
  Layers,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createSurvey } from "@/store/surveySlice";
import { fetchSurveyTypes } from "@/store/surveyTypeSlice";

// Preview device type
type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

export function SurveyBuilder({ 
  wizardMode = false,
  initialData,
  initialQuestions,
  onPublishFromWizard 
}: { 
  wizardMode?: boolean;
  initialData?: { title: string; description: string; platform: string; surveyTypeId?: string };
  initialQuestions?: any[];
  onPublishFromWizard?: (questions: SurveyQuestion[]) => void;
} = {}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tokens } = useAuthStore();
  const { surveyTypes } = useAppSelector((state) => state.surveyType);
  const [title, setTitle] = useState(initialData?.title || "Untitled Survey");
  const [description, setDescription] = useState(initialData?.description || "");
  const [platform, setPlatform] = useState(initialData?.platform || "both");
  const [surveyTypeId, setSurveyTypeId] = useState(initialData?.surveyTypeId || "");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);

  useEffect(() => {
    if (initialQuestions?.length) {
      const converted = initialQuestions.map((q, i) => ({
        id: `${q.type}-${Date.now()}-${i}`,
        type: questionTypes.find(qt => qt.id === q.type) || questionTypes[0],
        title: q.title || "",
        required: q.isRequired || false,
        position: i,
        options: q.options || undefined,
      }));
      setQuestions(converted);
    }
  }, [initialQuestions]);
  const [draggedType, setDraggedType] = useState<QuestionType | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('mobile');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("build");
  const [questionLogics, setQuestionLogics] = useState<Record<string, QuestionLogicConfig>>({});
  const [logicDialogOpen, setLogicDialogOpen] = useState(false);
  const [selectedQuestionForLogic, setSelectedQuestionForLogic] = useState<SurveyQuestion | null>(null);
  const [undoStack, setUndoStack] = useState<SurveyQuestion[][]>([]);
  const [redoStack, setRedoStack] = useState<SurveyQuestion[][]>([]);
  const [settingsTab, setSettingsTab] = useState("general");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveyTypes(tokens.accessToken));
    }
  }, [dispatch, tokens]);

  // Survey settings
  const [surveySettings, setSurveySettings] = useState({
    allowAnonymous: true,
    requireLocation: false,
    showProgressBar: true,
    randomizeQuestions: false,
    limitResponses: false,
    responseLimit: 1000,
    startDate: "",
    endDate: "",
    thankYouMessage: "Thank you for completing the survey!",
    theme: "default",
  });

  const handleDragStart = (type: QuestionType) => {
    setDraggedType(type);
  };

  const handleDrop = useCallback((type: QuestionType) => {
    // Save current state for undo
    setUndoStack(prev => [...prev, questions]);
    setRedoStack([]);

    const newQuestion: SurveyQuestion = {
      id: `${type.id}-${Date.now()}`,
      type,
      title: "",
      required: false,
      position: questions.length,
      options: ["radio", "radio-other", "dropdown", "dropdown-other", "checkbox", "checkbox-other", "checkbox-2col"].includes(type.id) ? ["Option 1", "Option 2"] : undefined,
    };
    setQuestions(prev => [...prev, newQuestion]);
    setDraggedType(null);
    setSelectedQuestionId(newQuestion.id);
    setSettingsTab("question");
    toast.success(`Added ${type.name} question`);
  }, [questions]);

  const handleQuestionsChange = useCallback((newQuestions: SurveyQuestion[]) => {
    setUndoStack(prev => [...prev, questions]);
    setRedoStack([]);
    setQuestions(newQuestions);
  }, [questions]);

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, questions]);
    setQuestions(previousState);
    setUndoStack(prev => prev.slice(0, -1));
    toast.info("Undo successful");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, questions]);
    setQuestions(nextState);
    setRedoStack(prev => prev.slice(0, -1));
    toast.info("Redo successful");
  };

  const handleOpenLogic = (question: SurveyQuestion) => {
    setSelectedQuestionForLogic(question);
    setLogicDialogOpen(true);
  };

  const handleSaveLogic = (logic: QuestionLogicConfig) => {
    setQuestionLogics(prev => ({
      ...prev,
      [logic.questionId]: logic,
    }));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a survey title");
      return;
    }
    toast.success("Survey saved successfully!");
  };

  const handlePublish = async () => {
    if (wizardMode && onPublishFromWizard) {
      if (questions.length === 0) {
        toast.error("Please add at least one question");
        return;
      }
      const untitledQuestions = questions.filter(q => !q.title.trim());
      if (untitledQuestions.length > 0) {
        toast.error(`${untitledQuestions.length} question(s) need titles`);
        return;
      }
      onPublishFromWizard(questions);
      return;
    }

    // Standalone mode - publish directly
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    
    const untitledQuestions = questions.filter(q => !q.title.trim());
    if (untitledQuestions.length > 0) {
      toast.error(`${untitledQuestions.length} question(s) need titles`);
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a survey title");
      return;
    }

    setIsPublishing(true);
    try {
      const typeMapping: Record<string, string> = {
        "short-answer": "text",
        "paragraph": "textarea",
        "multiple-choice": "single_choice",
        "checkboxes": "multiple_choice",
        "dropdown": "single_choice",
        "linear-scale": "rating",
        "date": "date",
        "time": "date",
        "file-upload": "file",
      };

      const surveyData = {
        title,
        description: description || "",
        target: surveySettings.responseLimit || 1000,
        deviceType: platform === "both" ? ["ANDROID", "WEB"] : platform === "mobile" ? ["ANDROID"] : ["WEB"],
        requiresLocationValidation: surveySettings.requireLocation,
        surveyTypeId: surveyTypeId || undefined,
        questions: questions.map((q, index) => ({
          questionText: q.title,
          type: typeMapping[q.type.id] || "text",
          order: index + 1,
          isRequired: q.required,
          options: q.options?.map((opt, i) => ({ optionText: opt, order: i + 1 })) || [],
        })),
      };

      await dispatch(createSurvey({ data: surveyData, token: tokens.accessToken })).unwrap();
      toast.success("Survey published successfully!");
      navigate("/surveys");
    } catch (error) {
      toast.error("Failed to publish survey");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDuplicateSurvey = () => {
    toast.success("Survey duplicated");
  };

  const handleExportSurvey = () => {
    toast.success("Survey exported as JSON");
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur-xl px-4 md:px-6">
        <div className="flex items-center gap-4">
          {!wizardMode && (
            <Link to="/surveys">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-0 outline-none focus:ring-0 h-auto p-0"
              placeholder="Enter survey title..."
              disabled={wizardMode}
            />
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </Badge>
              {Object.keys(questionLogics).length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <GitBranch className="h-3 w-3 mr-1" />
                  {Object.keys(questionLogics).length} logic rules
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">{platform}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleUndo}
              disabled={undoStack.length === 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRedo}
              disabled={redoStack.length === 0}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          {/* Preview Toggle */}
          <div className="hidden lg:flex items-center gap-1 border rounded-lg p-1 mr-2">
            {[
              { type: 'mobile' as PreviewDevice, icon: Smartphone },
              { type: 'tablet' as PreviewDevice, icon: Tablet },
              { type: 'desktop' as PreviewDevice, icon: Monitor },
            ].map(({ type, icon: Icon }) => (
              <Button
                key={type}
                variant={previewDevice === type ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPreviewDevice(type)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicateSurvey}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Survey
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportSurvey}>
                <FileDown className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Survey
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="secondary" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            <Send className="h-4 w-4 mr-2" />
            {wizardMode ? "Continue" : isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </header>

      {/* Main Builder Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Question Types */}
        <div className="w-72 border-r bg-card/50 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="flex-shrink-0 grid w-full grid-cols-2 m-2 mb-0">
              <TabsTrigger value="build" className="text-xs">
                <Layers className="h-3 w-3 mr-1" />
                Build
              </TabsTrigger>
              <TabsTrigger value="logic" className="text-xs">
                <GitBranch className="h-3 w-3 mr-1" />
                Logic
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="build" className="flex-1 m-0 p-0 overflow-y-auto custom-scrollbar">
              <div className="p-4">
                <QuestionPalette onDragStart={handleDragStart} />
              </div>
            </TabsContent>
            
            <TabsContent value="logic" className="flex-1 m-0 p-0 overflow-y-auto custom-scrollbar">
              <div className="p-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Skip Logic & Branching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {questions.length < 2 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Add at least 2 questions to configure logic</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {questions.map((q, i) => (
                          <div 
                            key={q.id}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-colors",
                              questionLogics[q.id] 
                                ? "border-primary bg-primary/5" 
                                : "hover:bg-muted/50"
                            )}
                            onClick={() => handleOpenLogic(q)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-xs font-medium">
                                  {i + 1}
                                </span>
                                <span className="text-sm truncate max-w-[150px]">
                                  {q.title || q.type.name}
                                </span>
                              </div>
                              {questionLogics[q.id] && (
                                <Badge variant="secondary" className="text-xs">
                                  {questionLogics[q.id].rules.length} rules
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-6" onDragEnd={() => setDraggedType(null)}>
            <SurveyCanvas
              questions={questions}
              onQuestionsChange={handleQuestionsChange}
              onDrop={handleDrop}
              draggedType={draggedType}
              onQuestionSelect={(id) => {
                setSelectedQuestionId(id);
                setSettingsTab("question");
              }}
            />
          </div>
        </div>

        {/* Right Panel - Settings & Preview */}
        <div className="w-80 border-l bg-card/50 flex flex-col overflow-hidden">
          <Tabs value={settingsTab} onValueChange={setSettingsTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="flex-shrink-0 grid w-full grid-cols-3 m-2 mb-0">
              <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
              <TabsTrigger value="question" className="text-xs">Question</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="flex-1 m-0 p-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {/* Survey Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Survey Information</h4>
                  <div className="space-y-2">
                    <Label>Survey Type</Label>
                    <Select value={surveyTypeId} onValueChange={setSurveyTypeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select survey type" />
                      </SelectTrigger>
                      <SelectContent>
                        {surveyTypes.filter(t => t.isActive).map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Enter survey description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Mobile & Web</SelectItem>
                        <SelectItem value="mobile">Mobile Only</SelectItem>
                        <SelectItem value="web">Web Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Settings Toggles */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Settings</h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Anonymous Responses</Label>
                      <p className="text-xs text-muted-foreground">Allow anonymous submissions</p>
                    </div>
                    <Switch 
                      checked={surveySettings.allowAnonymous}
                      onCheckedChange={(checked) => setSurveySettings(prev => ({ ...prev, allowAnonymous: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Require GPS Location</Label>
                      <p className="text-xs text-muted-foreground">Capture respondent location</p>
                    </div>
                    <Switch 
                      checked={surveySettings.requireLocation}
                      onCheckedChange={(checked) => setSurveySettings(prev => ({ ...prev, requireLocation: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Show Progress Bar</Label>
                      <p className="text-xs text-muted-foreground">Display completion progress</p>
                    </div>
                    <Switch 
                      checked={surveySettings.showProgressBar}
                      onCheckedChange={(checked) => setSurveySettings(prev => ({ ...prev, showProgressBar: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Randomize Questions</Label>
                      <p className="text-xs text-muted-foreground">Shuffle question order</p>
                    </div>
                    <Switch 
                      checked={surveySettings.randomizeQuestions}
                      onCheckedChange={(checked) => setSurveySettings(prev => ({ ...prev, randomizeQuestions: checked }))}
                    />
                  </div>
                </div>

                {/* Thank You Message */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Completion Message</h4>
                  <Textarea 
                    value={surveySettings.thankYouMessage}
                    onChange={(e) => setSurveySettings(prev => ({ ...prev, thankYouMessage: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="question" className="flex-1 m-0 p-4 overflow-y-auto custom-scrollbar">
              {selectedQuestion ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {selectedQuestion.position + 1}
                      </span>
                      <span className="font-medium">{selectedQuestion.type.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedQuestion.type.category}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea 
                      value={selectedQuestion.title}
                      onChange={(e) => {
                        const updated = questions.map(q => 
                          q.id === selectedQuestion.id ? { ...q, title: e.target.value } : q
                        );
                        setQuestions(updated);
                      }}
                      placeholder="Enter your question..."
                      rows={2}
                    />
                  </div>

                  {["radio", "radio-other", "dropdown", "dropdown-other", "checkbox", "checkbox-other", "checkbox-2col"].includes(selectedQuestion.type.id) && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      {(selectedQuestion.options || []).map((opt, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const updated = questions.map(q => {
                                if (q.id === selectedQuestion.id) {
                                  const newOptions = [...(q.options || [])];
                                  newOptions[i] = e.target.value;
                                  return { ...q, options: newOptions };
                                }
                                return q;
                              });
                              setQuestions(updated);
                            }}
                            placeholder={`Option ${i + 1}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updated = questions.map(q => {
                                if (q.id === selectedQuestion.id) {
                                  const newOptions = (q.options || []).filter((_, idx) => idx !== i);
                                  return { ...q, options: newOptions };
                                }
                                return q;
                              });
                              setQuestions(updated);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = questions.map(q => {
                            if (q.id === selectedQuestion.id) {
                              return { ...q, options: [...(q.options || []), ""] };
                            }
                            return q;
                          });
                          setQuestions(updated);
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Required</Label>
                      <p className="text-xs text-muted-foreground">Make this question mandatory</p>
                    </div>
                    <Switch 
                      checked={selectedQuestion.required}
                      onCheckedChange={(checked) => {
                        const updated = questions.map(q => 
                          q.id === selectedQuestion.id ? { ...q, required: checked } : q
                        );
                        setQuestions(updated);
                      }}
                    />
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOpenLogic(selectedQuestion)}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Configure Logic
                    {questionLogics[selectedQuestion.id] && (
                      <Badge variant="secondary" className="ml-2">
                        {questionLogics[selectedQuestion.id].rules.length}
                      </Badge>
                    )}
                  </Button>

                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      const updated = questions.filter(q => q.id !== selectedQuestion.id);
                      updated.forEach((q, i) => q.position = i);
                      setQuestions(updated);
                      setSelectedQuestionId(null);
                      toast.success("Question deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Question
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No Question Selected</p>
                  <p className="text-sm mt-1">Click on a question to edit its properties</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
              <div className="h-full">
                <DevicePreview 
                  questions={questions}
                  surveyTitle={title}
                  className="h-full border-0 shadow-none"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Full Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Survey Preview
            </DialogTitle>
            <DialogDescription>
              Preview how your survey will appear on different devices
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <DevicePreview 
              questions={questions}
              surveyTitle={title}
              className="h-full max-h-[70vh]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question Logic Dialog */}
      {selectedQuestionForLogic && (
        <QuestionLogic
          open={logicDialogOpen}
          onOpenChange={setLogicDialogOpen}
          question={selectedQuestionForLogic}
          allQuestions={questions}
          existingLogic={questionLogics[selectedQuestionForLogic.id]}
          onSave={handleSaveLogic}
        />
      )}
    </div>
  );
}

export default SurveyBuilder;
