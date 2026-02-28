import { useState,useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Users,
  Star,
  MessageSquare,
  ClipboardList,
  Heart,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Building2,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Palette,
  Target,
  Clock,
  MapPin,
  BarChart3,
  Shuffle,
  Lock,
  Globe,
  Zap,
  ChevronRight,
  Layout,
  PenLine,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createSurvey } from "@/store/surveySlice";
import { fetchSurveyTypes } from "@/store/surveyTypeSlice";
import { QuestionPalette } from "@/components/survey-builder/QuestionPalette";
import { SurveyCanvas, SurveyQuestion } from "@/components/survey-builder/SurveyCanvas";
import { QuestionType } from "@/components/survey-builder/QuestionTypes";
import { SurveyBuilder } from "./SurveyBuilder";

// Survey Templates
const surveyTemplates = [
  {
    id: "blank",
    name: "Blank Survey",
    description: "Start from scratch with a blank canvas",
    icon: FileText,
    color: "bg-muted",
    questions: [],
  },
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction",
    description: "Measure customer happiness and loyalty",
    icon: Star,
    color: "bg-yellow-500/10 text-yellow-600",
    questions: [
      { type: "rating", title: "Overall, how satisfied are you with our service?" },
      { type: "rating", title: "How likely are you to recommend us to a friend?" },
      { type: "multiple-choice", title: "What aspects of our service do you value most?", options: ["Quality", "Price", "Speed", "Support", "Reliability"] },
      { type: "text", title: "What could we do to improve your experience?" },
    ],
  },
  {
    id: "employee-feedback",
    name: "Employee Feedback",
    description: "Gather insights from your team members",
    icon: Briefcase,
    color: "bg-blue-500/10 text-blue-600",
    questions: [
      { type: "rating", title: "How satisfied are you with your current role?" },
      { type: "rating", title: "How would you rate work-life balance?" },
      { type: "multiple-choice", title: "What motivates you at work?", options: ["Growth", "Compensation", "Team", "Culture", "Impact"] },
      { type: "text", title: "Any suggestions for improvement?" },
    ],
  },
  {
    id: "market-research",
    name: "Market Research",
    description: "Understand your target audience better",
    icon: BarChart3,
    color: "bg-green-500/10 text-green-600",
    questions: [
      { type: "multiple-choice", title: "How did you hear about us?", options: ["Social Media", "Search Engine", "Friend/Family", "Advertisement", "Other"] },
      { type: "multiple-choice", title: "What is your age group?", options: ["18-24", "25-34", "35-44", "45-54", "55+"] },
      { type: "rating", title: "How interested are you in our product?" },
      { type: "text", title: "What features would you like to see?" },
    ],
  },
  {
    id: "event-feedback",
    name: "Event Feedback",
    description: "Collect attendee feedback for events",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600",
    questions: [
      { type: "rating", title: "How would you rate the overall event?" },
      { type: "rating", title: "How satisfied were you with the venue?" },
      { type: "multiple-choice", title: "Which sessions did you attend?", options: ["Keynote", "Workshops", "Networking", "Panels"] },
      { type: "text", title: "What did you enjoy most about the event?" },
    ],
  },
  {
    id: "product-feedback",
    name: "Product Feedback",
    description: "Get insights on your product features",
    icon: ShoppingCart,
    color: "bg-orange-500/10 text-orange-600",
    questions: [
      { type: "rating", title: "How easy is the product to use?" },
      { type: "rating", title: "How well does the product meet your needs?" },
      { type: "multiple-choice", title: "Which feature do you use most?", options: ["Feature A", "Feature B", "Feature C", "Feature D"] },
      { type: "text", title: "What features are missing?" },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare Survey",
    description: "Patient satisfaction and feedback",
    icon: Stethoscope,
    color: "bg-red-500/10 text-red-600",
    questions: [
      { type: "rating", title: "How would you rate your overall care?" },
      { type: "rating", title: "How satisfied were you with wait times?" },
      { type: "multiple-choice", title: "What services did you use?", options: ["Consultation", "Treatment", "Follow-up", "Emergency"] },
      { type: "text", title: "Any additional feedback for our staff?" },
    ],
  },
  {
    id: "education",
    name: "Education Survey",
    description: "Course and instructor feedback",
    icon: GraduationCap,
    color: "bg-indigo-500/10 text-indigo-600",
    questions: [
      { type: "rating", title: "How would you rate the course content?" },
      { type: "rating", title: "How would you rate the instructor?" },
      { type: "multiple-choice", title: "What was most valuable?", options: ["Lectures", "Assignments", "Discussions", "Projects"] },
      { type: "text", title: "How can we improve the course?" },
    ],
  },
];

// Wizard Steps
const wizardSteps = [
  { id: 1, title: "Choose Template", description: "Start with a template or blank", icon: Layout },
  { id: 2, title: "Basic Info", description: "Name and describe your survey", icon: PenLine },
  { id: 3, title: "Settings", description: "Configure survey options", icon: Target },
  { id: 4, title: "Questions", description: "Add and edit questions", icon: ClipboardList },
  { id: 5, title: "Review", description: "Review and create", icon: Check },
];

// Theme Options
const themeOptions = [
  { id: "default", name: "Default", primary: "hsl(199, 89%, 48%)", secondary: "hsl(172, 66%, 50%)" },
  { id: "ocean", name: "Ocean", primary: "hsl(210, 100%, 50%)", secondary: "hsl(190, 90%, 45%)" },
  { id: "forest", name: "Forest", primary: "hsl(142, 71%, 45%)", secondary: "hsl(160, 60%, 45%)" },
  { id: "sunset", name: "Sunset", primary: "hsl(25, 95%, 53%)", secondary: "hsl(38, 92%, 50%)" },
  { id: "berry", name: "Berry", primary: "hsl(280, 70%, 50%)", secondary: "hsl(320, 70%, 50%)" },
  { id: "midnight", name: "Midnight", primary: "hsl(222, 47%, 30%)", secondary: "hsl(199, 89%, 48%)" },
];

interface SurveyWizardProps {
  onComplete: (config: SurveyConfig) => void;
  onCancel: () => void;
}

export interface SurveyConfig {
  title: string;
  description: string;
  template: string;
  platform: string;
  theme: string;
  settings: {
    allowAnonymous: boolean;
    requireLocation: boolean;
    showProgressBar: boolean;
    randomizeQuestions: boolean;
    limitResponses: boolean;
    responseLimit: number;
    startDate: string;
    endDate: string;
  };
  questions: any[];
}

export function SurveyWizard({ onComplete, onCancel }: SurveyWizardProps) {
  const dispatch = useAppDispatch();
  const { tokens } = useAuthStore();
  const { surveyTypes } = useAppSelector((state) => state.surveyType);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("both");
  const [theme, setTheme] = useState("default");
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [draggedType, setDraggedType] = useState<QuestionType | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    allowAnonymous: true,
    requireLocation: false,
    showProgressBar: true,
    randomizeQuestions: false,
    limitResponses: false,
    responseLimit: 1000,
    startDate: "",
    endDate: "",
  });

  // Load survey types and template questions
  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveyTypes(tokens.accessToken));
    }
  }, [dispatch, tokens]);

  useEffect(() => {
    if (selectedTemplate && currentStep === 4 && customQuestions.length === 0) {
      const template = surveyTypes.find(t => t.id === selectedTemplate);
      if (template?.templateQuestions?.length) {
        setCustomQuestions(template.templateQuestions.map(q => ({ ...q, isRequired: false })));
      }
    }
  }, [selectedTemplate, currentStep, surveyTypes]);

  const progress = (currentStep / wizardSteps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return title.trim().length > 0;
      case 3:
        return true;
      case 4:
        return customQuestions.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBuilderPublish = (questions: SurveyQuestion[]) => {
    const convertedQuestions = questions.map(q => ({
      type: q.type.id,
      title: q.title,
      options: q.options || [],
      isRequired: q.required,
    }));
    setCustomQuestions(convertedQuestions);
    handleNext();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete({
      title,
      description,
      template: selectedTemplate || "blank",
      platform,
      theme,
      settings,
      questions: customQuestions,
    });
  };

  const selectedTemplateData = surveyTypes.find(t => t.id === selectedTemplate);

  const addQuestion = () => {
    setCustomQuestions([...customQuestions, { type: "text", title: "", options: [], isRequired: false }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...customQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setCustomQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number) => {
    const updated = [...customQuestions];
    updated[qIndex].options = [...(updated[qIndex].options || []), ""];
    setCustomQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...customQuestions];
    updated[qIndex].options[oIndex] = value;
    setCustomQuestions(updated);
  };

  const deleteOption = (qIndex: number, oIndex: number) => {
    const updated = [...customQuestions];
    updated[qIndex].options = updated[qIndex].options.filter((_: any, i: number) => i !== oIndex);
    setCustomQuestions(updated);
  };

  const handleDragStart = (type: QuestionType) => {
    setDraggedType(type);
  };

  const handleDrop = useCallback((type: QuestionType) => {
    const newQuestion: SurveyQuestion = {
      id: `${type.id}-${Date.now()}`,
      type,
      title: "",
      required: false,
      position: customQuestions.length,
      options: ["radio", "radio-other", "dropdown", "dropdown-other", "checkbox", "checkbox-other", "checkbox-2col"].includes(type.id) ? ["Option 1", "Option 2"] : undefined,
    };
    setCustomQuestions(prev => [...prev, newQuestion]);
    setDraggedType(null);
    setSelectedQuestionId(newQuestion.id);
  }, [customQuestions]);

  const handleQuestionsChange = useCallback((newQuestions: SurveyQuestion[]) => {
    setCustomQuestions(newQuestions);
  }, []);

  return (
    <div className="min-h-[600px] flex flex-col">
      {/* Progress Header */}
      <div className="border-b bg-muted/30 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-between mb-4">
            {wizardSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                        isCompleted && "bg-success text-success-foreground",
                        isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-2 font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <div className={cn(
                      "w-24 h-0.5 mx-2 transition-colors duration-300",
                      isCompleted ? "bg-success" : "bg-border"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Choose Template */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
                <p className="text-muted-foreground">
                  Start with a pre-built template or create from scratch
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {surveyTypes.filter(t => t.isActive).map((template) => {
                  const Icon = FileText;
                  const isSelected = selectedTemplate === template.id;
                  
                  return (
                    <Card
                      key={template.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        isSelected && "ring-2 ring-primary border-primary"
                      )}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Survey type template
                        </p>
                        {template.templateQuestions && template.templateQuestions.length > 0 && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {template.templateQuestions.length} questions
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedTemplateData && selectedTemplateData.templateQuestions && selectedTemplateData.templateQuestions.length > 0 && (
                <Card className="mt-6 animate-slide-up">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Template Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedTemplateData.templateQuestions.map((q, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {i + 1}
                          </span>
                          <span className="text-sm">{q.title}</span>
                          <Badge variant="outline" className="ml-auto text-xs capitalize">
                            {q.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Survey Details</h2>
                <p className="text-muted-foreground">
                  Give your survey a name and description
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Survey Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose of this survey..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platform</Label>
                  <RadioGroup value={platform} onValueChange={setPlatform} className="grid grid-cols-3 gap-4">
                    <Label
                      htmlFor="platform-both"
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                        platform === "both" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50"
                      )}
                    >
                      <RadioGroupItem value="both" id="platform-both" className="sr-only" />
                      <div className="flex items-center gap-1 mb-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="text-muted-foreground">&</span>
                        <Monitor className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Both</span>
                    </Label>
                    <Label
                      htmlFor="platform-mobile"
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                        platform === "mobile" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50"
                      )}
                    >
                      <RadioGroupItem value="mobile" id="platform-mobile" className="sr-only" />
                      <Smartphone className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Mobile</span>
                    </Label>
                    <Label
                      htmlFor="platform-web"
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                        platform === "web" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50"
                      )}
                    >
                      <RadioGroupItem value="web" id="platform-web" className="sr-only" />
                      <Monitor className="h-5 w-5 mb-2" />
                      <span className="text-sm font-medium">Web</span>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {themeOptions.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "relative h-12 rounded-lg overflow-hidden transition-all",
                          theme === t.id && "ring-2 ring-offset-2 ring-primary"
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${t.primary} 0%, ${t.secondary} 100%)`
                        }}
                        title={t.name}
                      >
                        {theme === t.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Survey Settings</h2>
                <p className="text-muted-foreground">
                  Configure how your survey behaves
                </p>
              </div>

              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Lock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <Label>Anonymous Responses</Label>
                        <p className="text-xs text-muted-foreground">Allow submissions without login</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.allowAnonymous}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowAnonymous: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <MapPin className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <Label>GPS Location</Label>
                        <p className="text-xs text-muted-foreground">Capture respondent location</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.requireLocation}
                      onCheckedChange={(checked) => setSettings({ ...settings, requireLocation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <BarChart3 className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <Label>Progress Bar</Label>
                        <p className="text-xs text-muted-foreground">Show completion progress</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showProgressBar}
                      onCheckedChange={(checked) => setSettings({ ...settings, showProgressBar: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-warning/10">
                        <Shuffle className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <Label>Randomize Questions</Label>
                        <p className="text-xs text-muted-foreground">Show questions in random order</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.randomizeQuestions}
                      onCheckedChange={(checked) => setSettings({ ...settings, randomizeQuestions: checked })}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-destructive/10">
                          <Target className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <Label>Limit Responses</Label>
                          <p className="text-xs text-muted-foreground">Set maximum number of responses</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.limitResponses}
                        onCheckedChange={(checked) => setSettings({ ...settings, limitResponses: checked })}
                      />
                    </div>
                    {settings.limitResponses && (
                      <Input
                        type="number"
                        placeholder="Maximum responses..."
                        value={settings.responseLimit}
                        onChange={(e) => setSettings({ ...settings, responseLimit: parseInt(e.target.value) || 0 })}
                        className="animate-fade-in"
                      />
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="mb-3 block">Schedule (Optional)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Start Date</Label>
                        <Input
                          type="date"
                          value={settings.startDate}
                          onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">End Date</Label>
                        <Input
                          type="date"
                          value={settings.endDate}
                          onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Questions - Survey Builder */}
          {currentStep === 4 && (
            <div className="animate-fade-in h-[600px]">
              <SurveyBuilder 
                wizardMode={true}
                initialData={{
                  title,
                  description,
                  platform,
                  surveyTypeId: selectedTemplate || undefined,
                }}
                initialQuestions={customQuestions}
                onPublishFromWizard={handleBuilderPublish}
              />
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ready to Create!</h2>
                <p className="text-muted-foreground">
                  Review your survey configuration below
                </p>
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Template</span>
                    <span className="font-medium">{selectedTemplateData?.name || "Blank"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium">{title}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Platform</span>
                    <Badge variant="secondary" className="capitalize">{platform}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Theme</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${themeOptions.find(t => t.id === theme)?.primary} 0%, ${themeOptions.find(t => t.id === theme)?.secondary} 100%)`
                        }}
                      />
                      <span className="font-medium capitalize">{theme}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-medium">{customQuestions.length} questions</span>
                  </div>
                  <div className="py-2">
                    <span className="text-muted-foreground block mb-2">Settings</span>
                    <div className="flex flex-wrap gap-2">
                      {settings.allowAnonymous && <Badge variant="outline">Anonymous</Badge>}
                      {settings.requireLocation && <Badge variant="outline">GPS Required</Badge>}
                      {settings.showProgressBar && <Badge variant="outline">Progress Bar</Badge>}
                      {settings.randomizeQuestions && <Badge variant="outline">Randomized</Badge>}
                      {settings.limitResponses && <Badge variant="outline">Limited to {settings.responseLimit}</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={currentStep === 1 ? onCancel : handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {wizardSteps.length}
            </span>
          </div>

          <Button onClick={handleNext} disabled={!canProceed()}>
            {currentStep === wizardSteps.length ? (
              <>
                Create Survey
                <Zap className="h-4 w-4 ml-2" />
              </>
            ) : currentStep === 4 ? (
              <>
                Skip Builder (Use Template)
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Page wrapper for standalone wizard
export default function SurveyWizardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tokens = useAuthStore((state) => state.tokens);

  const handleComplete = async (config: SurveyConfig) => {
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      const typeMapping: Record<string, string> = {
        "text": "text",
        "short-answer": "text",
        "paragraph": "textarea",
        "rating": "rating",
        "linear-scale": "rating",
        "multiple-choice": "single_choice",
        "radio": "single_choice",
        "radio-other": "single_choice",
        "dropdown": "single_choice",
        "dropdown-other": "single_choice",
        "checkboxes": "multiple_choice",
        "checkbox": "multiple_choice",
        "checkbox-other": "multiple_choice",
        "checkbox-2col": "multiple_choice",
        "date": "date",
        "time": "date",
        "file": "file",
        "file-upload": "file",
      };

      const surveyData = {
        title: config.title,
        description: config.description,
        target: config.settings.responseLimit || 1000,
        deviceType: config.platform === "both" ? ["ANDROID", "WEB"] : config.platform === "mobile" ? ["ANDROID"] : ["WEB"],
        requiresLocationValidation: config.settings.requireLocation,
        surveyTypeId: config.template !== "blank" ? config.template : undefined,
        questions: config.questions.map((q, index) => ({
          questionText: q.title,
          type: typeMapping[q.type] || "text",
          order: index + 1,
          isRequired: q.isRequired || true,
          options: q.options?.map((opt, i) => ({ optionText: opt, order: i + 1 })) || [],
        })),
      };

      await dispatch(createSurvey({ data: surveyData, token: tokens.accessToken })).unwrap();
      toast.success("Survey created successfully!");
      navigate("/surveys");
    } catch (error) {
      toast.error("Failed to create survey");
    }
  };

  const handleCancel = () => {
    navigate("/surveys");
  };

  return (
    <AdminLayout title="Create New Survey" subtitle="Use the wizard to set up your survey">
      <Card className="overflow-hidden">
        <SurveyWizard onComplete={handleComplete} onCancel={handleCancel} />
      </Card>
    </AdminLayout>
  );
}
