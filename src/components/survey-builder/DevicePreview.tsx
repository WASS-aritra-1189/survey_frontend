import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  Square
} from "lucide-react";
import { SurveyQuestion } from "./SurveyCanvas";
import { cn } from "@/lib/utils";

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DevicePreviewProps {
  questions: SurveyQuestion[];
  surveyTitle: string;
  className?: string;
}

const deviceDimensions = {
  mobile: { width: 375, height: 667, scale: 0.65 },
  tablet: { width: 768, height: 1024, scale: 0.5 },
  desktop: { width: 1280, height: 800, scale: 0.45 },
};

export function DevicePreview({ questions, surveyTitle, className }: DevicePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  
  const dimensions = deviceDimensions[device];
  const actualWidth = isLandscape ? dimensions.height : dimensions.width;
  const actualHeight = isLandscape ? dimensions.width : dimensions.height;

  const renderQuestionPreview = (question: SurveyQuestion) => {
    const { type } = question;
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-sm">
          {question.title || 'Enter your question here...'}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </h3>
        
        {/* Render different input types */}
        {(type.id === 'single-line' || type.id === 'email' || type.id === 'phone') && (
          <input 
            type="text" 
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
            placeholder={`Enter ${type.name.toLowerCase()}...`}
            disabled
          />
        )}
        
        {type.id === 'multi-line' && (
          <textarea 
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none"
            rows={3}
            placeholder="Enter your response..."
            disabled
          />
        )}
        
        {(type.id === 'number' || type.id === 'decimal' || type.id === 'number-auto') && (
          <input 
            type="number" 
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
            placeholder="0"
            disabled
          />
        )}
        
        {(type.id === 'radio' || type.id === 'radio-other') && (
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3'].map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
            {type.id === 'radio-other' && (
              <label className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Other...</span>
              </label>
            )}
          </div>
        )}
        
        {(type.id === 'checkbox' || type.id === 'checkbox-other' || type.id === 'checkbox-2col') && (
          <div className={cn("space-y-2", type.id === 'checkbox-2col' && "grid grid-cols-2 gap-2 space-y-0")}>
            {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <Square className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}
        
        {(type.id === 'dropdown' || type.id === 'dropdown-other') && (
          <select className="w-full px-3 py-2 text-sm border rounded-lg bg-background" disabled>
            <option>Select an option...</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        )}
        
        {type.id === 'rating' && (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-2xl text-muted-foreground hover:text-warning transition-colors">
                ★
              </button>
            ))}
          </div>
        )}
        
        {type.id === 'nps' && (
          <div className="flex justify-between gap-1">
            {[...Array(11)].map((_, i) => (
              <button 
                key={i} 
                className={cn(
                  "flex-1 py-2 text-xs font-medium rounded border transition-colors",
                  i <= 6 ? "hover:bg-destructive/10 hover:border-destructive" :
                  i <= 8 ? "hover:bg-warning/10 hover:border-warning" :
                  "hover:bg-success/10 hover:border-success"
                )}
              >
                {i}
              </button>
            ))}
          </div>
        )}
        
        {(type.id === 'date' || type.id === 'datetime') && (
          <input 
            type="date" 
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
            disabled
          />
        )}
        
        {type.id === 'time' && (
          <input 
            type="time" 
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
            disabled
          />
        )}
        
        {type.id === 'gps' && (
          <div className="h-32 rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto mb-2 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-white text-lg">📍</span>
              </div>
              <p className="text-xs text-muted-foreground">Tap to get location</p>
            </div>
          </div>
        )}
        
        {type.id === 'barcode' && (
          <div className="h-32 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto mb-2">📷</div>
              <p className="text-xs text-muted-foreground">Tap to scan barcode</p>
            </div>
          </div>
        )}
        
        {type.id === 'text-block' && (
          <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            This is a text block for displaying information to the respondent.
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Device Preview</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border p-1">
              {[
                { type: 'mobile' as DeviceType, icon: Smartphone },
                { type: 'tablet' as DeviceType, icon: Tablet },
                { type: 'desktop' as DeviceType, icon: Monitor },
              ].map(({ type, icon: Icon }) => (
                <Button
                  key={type}
                  variant={device === type ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setDevice(type)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            {device !== 'desktop' && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsLandscape(!isLandscape)}
              >
                <RotateCcw className={cn("h-4 w-4 transition-transform", isLandscape && "rotate-90")} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex justify-center pb-6">
        {/* Device Frame */}
        <div 
          className={cn(
            "relative rounded-[2rem] bg-foreground p-3 shadow-2xl transition-all duration-300",
            device === 'mobile' && "rounded-[2rem]",
            device === 'tablet' && "rounded-[1.5rem]",
            device === 'desktop' && "rounded-xl p-2"
          )}
          style={{
            width: actualWidth * dimensions.scale + (device === 'desktop' ? 16 : 24),
            height: actualHeight * dimensions.scale + (device === 'desktop' ? 40 : 24),
          }}
        >
          {/* Screen */}
          <div 
            className={cn(
              "bg-background overflow-hidden",
              device === 'mobile' && "rounded-[1.5rem]",
              device === 'tablet' && "rounded-[1rem]",
              device === 'desktop' && "rounded-lg"
            )}
            style={{
              width: actualWidth * dimensions.scale,
              height: actualHeight * dimensions.scale,
            }}
          >
            {/* Status Bar (mobile/tablet) */}
            {device !== 'desktop' && (
              <div className="h-6 bg-foreground/5 flex items-center justify-between px-4">
                <span className="text-[10px] text-muted-foreground">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-4 rounded-sm bg-muted-foreground/50" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                </div>
              </div>
            )}
            
            {/* Survey Content */}
            <div className="h-full overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b px-4 py-3 z-10">
                <h2 className="font-semibold text-sm truncate">{surveyTitle}</h2>
                {questions.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {currentQuestion + 1}/{questions.length}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Question */}
              <div className="p-4">
                {questions.length > 0 ? (
                  <>
                    <Badge variant="secondary" className="mb-3 text-xs">
                      Question {currentQuestion + 1}
                    </Badge>
                    {renderQuestionPreview(questions[currentQuestion])}
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No questions yet</p>
                    <p className="text-xs mt-1">Add questions to see preview</p>
                  </div>
                )}
              </div>
              
              {/* Navigation */}
              {questions.length > 0 && (
                <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t px-4 py-3 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    {currentQuestion === questions.length - 1 ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Submit
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Home Indicator (mobile) */}
          {device === 'mobile' && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 rounded-full bg-white/50" />
          )}
          
          {/* Desktop Stand */}
          {device === 'desktop' && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-foreground rounded-b-lg" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
