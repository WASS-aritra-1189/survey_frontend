import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Smartphone,
  Tablet,
  Monitor,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Star,
  ThumbsUp,
  MessageSquare,
  Calendar,
  MapPin,
  Upload,
  Image,
  Wifi,
  Battery,
  Signal,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SurveyQuestion } from "./SurveyCanvas";
import { format } from "date-fns";

type DeviceType = "mobile" | "tablet" | "desktop";
type Orientation = "portrait" | "landscape";

interface SurveyPreviewSimulatorProps {
  questions: SurveyQuestion[];
  surveyTitle: string;
  surveyDescription?: string;
  showProgressBar?: boolean;
  theme?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deviceFrames: Record<DeviceType, { width: number; height: number; name: string }> = {
  mobile: { width: 375, height: 667, name: "iPhone 12" },
  tablet: { width: 768, height: 1024, name: "iPad" },
  desktop: { width: 1280, height: 800, name: "Desktop" },
};

export function SurveyPreviewSimulator({
  questions,
  surveyTitle,
  surveyDescription,
  showProgressBar = true,
  theme = "default",
  open,
  onOpenChange,
}: SurveyPreviewSimulatorProps) {
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [interactionMode, setInteractionMode] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Auto-play simulation
  useEffect(() => {
    if (isPlaying && currentQuestionIndex < questions.length - 1) {
      const timer = setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentQuestionIndex === questions.length - 1) {
      setIsPlaying(false);
      setShowCompleted(true);
    }
  }, [isPlaying, currentQuestionIndex, questions.length]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowCompleted(false);
    setIsPlaying(false);
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getDeviceDimensions = () => {
    const frame = deviceFrames[device];
    if (device === "desktop") {
      return { width: frame.width, height: frame.height };
    }
    if (orientation === "landscape") {
      return { width: frame.height, height: frame.width };
    }
    return { width: frame.width, height: frame.height };
  };

  const dimensions = getDeviceDimensions();
  const scale = device === "desktop" ? 0.7 : device === "tablet" ? 0.65 : 0.85;

  const renderQuestionInput = (question: SurveyQuestion) => {
    const answer = answers[question.id];

    switch (question.type.id) {
      case "short-text":
        return (
          <Input
            placeholder="Type your answer here..."
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            disabled={!interactionMode}
            className="w-full"
          />
        );

      case "long-text":
        return (
          <Textarea
            placeholder="Type your detailed response here..."
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            disabled={!interactionMode}
            rows={4}
            className="w-full"
          />
        );

      case "single-choice":
        return (
          <RadioGroup
            value={answer || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
            disabled={!interactionMode}
            className="space-y-2"
          >
            {["Option 1", "Option 2", "Option 3", "Option 4"].map((option, i) => (
              <div key={i} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                <Label htmlFor={`${question.id}-${i}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple-choice":
        return (
          <div className="space-y-2">
            {["Option A", "Option B", "Option C", "Option D"].map((option, i) => (
              <div
                key={i}
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50"
              >
                <Checkbox
                  id={`${question.id}-${i}`}
                  checked={(answer || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const current = answer || [];
                    if (checked) {
                      handleAnswer(question.id, [...current, option]);
                    } else {
                      handleAnswer(question.id, current.filter((o: string) => o !== option));
                    }
                  }}
                  disabled={!interactionMode}
                />
                <Label htmlFor={`${question.id}-${i}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "rating":
        return (
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => interactionMode && handleAnswer(question.id, star)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  (answer || 0) >= star
                    ? "text-warning scale-110"
                    : "text-muted-foreground hover:text-warning"
                )}
              >
                <Star className={cn("h-8 w-8", (answer || 0) >= star && "fill-current")} />
              </button>
            ))}
          </div>
        );

      case "nps":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not Likely</span>
              <span>Very Likely</span>
            </div>
            <div className="grid grid-cols-11 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => interactionMode && handleAnswer(question.id, num)}
                  className={cn(
                    "p-2 rounded-lg border text-sm font-medium transition-all",
                    answer === num
                      ? num <= 6
                        ? "bg-destructive/20 border-destructive text-destructive"
                        : num <= 8
                        ? "bg-warning/20 border-warning text-warning"
                        : "bg-success/20 border-success text-success"
                      : "hover:bg-muted"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );

      case "slider":
        return (
          <div className="space-y-4 px-2">
            <Slider
              value={[answer || 50]}
              onValueChange={([value]) => handleAnswer(question.id, value)}
              disabled={!interactionMode}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-sm">
              <span>0</span>
              <span className="font-medium">{answer || 50}</span>
              <span>100</span>
            </div>
          </div>
        );

      case "date":
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Input
              type="date"
              value={answer || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              disabled={!interactionMode}
              className="flex-1"
            />
          </div>
        );

      case "file-upload":
        return (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click or drag to upload</p>
          </div>
        );

      case "image-choice":
        return (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => interactionMode && handleAnswer(question.id, i)}
                className={cn(
                  "aspect-square rounded-lg border-2 bg-muted/50 flex items-center justify-center transition-all",
                  answer === i ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
                )}
              >
                <Image className="h-8 w-8 text-muted-foreground" />
              </button>
            ))}
          </div>
        );

      case "location":
        return (
          <div className="flex items-center gap-2 p-4 rounded-lg border bg-muted/50">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm">Location access required</span>
          </div>
        );

      default:
        return (
          <Input
            placeholder="Your answer..."
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            disabled={!interactionMode}
          />
        );
    }
  };

  const renderDeviceFrame = () => (
    <div
      className={cn(
        "relative bg-black rounded-[40px] shadow-2xl transition-all duration-300",
        device === "desktop" && "rounded-xl"
      )}
      style={{
        width: dimensions.width * scale,
        height: dimensions.height * scale,
        padding: device === "mobile" ? "12px" : device === "tablet" ? "16px" : "8px",
      }}
    >
      {/* Status Bar (mobile/tablet) */}
      {device !== "desktop" && (
        <div
          className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-6 text-white text-xs z-10"
          style={{ paddingTop: device === "mobile" ? "4px" : "8px" }}
        >
          <span>{format(new Date(), "HH:mm")}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div
        className={cn(
          "w-full h-full bg-background overflow-hidden",
          device === "mobile" && "rounded-[32px]",
          device === "tablet" && "rounded-[24px]",
          device === "desktop" && "rounded-lg"
        )}
      >
        <ScrollArea className="h-full">
          {/* Survey Header */}
          <div className="p-4 border-b sticky top-0 bg-background z-10">
            <h2 className="font-semibold text-base">{surveyTitle || "Survey Preview"}</h2>
            {surveyDescription && (
              <p className="text-xs text-muted-foreground mt-1">{surveyDescription}</p>
            )}
            {showProgressBar && questions.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Survey Content */}
          <div className="p-4">
            {showCompleted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                <p className="text-muted-foreground text-sm">
                  Your response has been recorded.
                </p>
                <Button onClick={handleReset} className="mt-6">
                  Start Over
                </Button>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No questions added yet</p>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-start gap-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                      {currentQuestionIndex + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {currentQuestion.title || "Untitled Question"}
                        {currentQuestion.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentQuestion.type.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">{renderQuestionInput(currentQuestion)}</div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button size="sm" onClick={handleNext}>
                    {currentQuestionIndex === questions.length - 1 ? (
                      "Submit"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>

      {/* Home indicator (mobile) */}
      {device === "mobile" && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Interactive Survey Preview
          </DialogTitle>
          <DialogDescription>
            Test how your survey will appear to respondents on different devices
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Controls */}
          <Card className="w-56 p-4 shrink-0">
            <div className="space-y-6">
              {/* Device Selection */}
              <div>
                <h4 className="text-sm font-medium mb-3">Device</h4>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { type: "mobile" as DeviceType, icon: Smartphone, label: "Mobile" },
                    { type: "tablet" as DeviceType, icon: Tablet, label: "Tablet" },
                    { type: "desktop" as DeviceType, icon: Monitor, label: "Desktop" },
                  ] as const).map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setDevice(type)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                        device === type
                          ? "border-primary bg-primary/5 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation (mobile/tablet only) */}
              {device !== "desktop" && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Orientation</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setOrientation("portrait")}
                      className={cn(
                        "flex items-center justify-center gap-1 p-2 rounded-lg border text-xs",
                        orientation === "portrait"
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="w-3 h-5 border-2 rounded" />
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation("landscape")}
                      className={cn(
                        "flex items-center justify-center gap-1 p-2 rounded-lg border text-xs",
                        orientation === "landscape"
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="w-5 h-3 border-2 rounded" />
                      Landscape
                    </button>
                  </div>
                </div>
              )}

              {/* Playback Controls */}
              <div>
                <h4 className="text-sm font-medium mb-3">Playback</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={questions.length === 0}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isPlaying ? "Auto-advancing..." : "Click play for auto demo"}
                </p>
              </div>

              {/* Interaction Mode */}
              <div>
                <h4 className="text-sm font-medium mb-3">Mode</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInteractionMode(true)}
                    className={cn(
                      "p-2 rounded-lg border text-xs",
                      interactionMode ? "border-primary bg-primary/5" : "hover:bg-muted"
                    )}
                  >
                    Interactive
                  </button>
                  <button
                    onClick={() => setInteractionMode(false)}
                    className={cn(
                      "p-2 rounded-lg border text-xs",
                      !interactionMode ? "border-primary bg-primary/5" : "hover:bg-muted"
                    )}
                  >
                    View Only
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Preview Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device:</span>
                    <span>{deviceFrames[device].name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span>{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Answered:</span>
                    <span>{Object.keys(answers).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl overflow-hidden">
            {renderDeviceFrame()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
