import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionType } from "./QuestionTypes";
import { cn } from "@/lib/utils";
import { GripVertical, Trash2, Copy, Settings } from "lucide-react";

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  position: number;
  options?: string[];
}

interface SurveyCanvasProps {
  questions: SurveyQuestion[];
  onQuestionsChange: (questions: SurveyQuestion[]) => void;
  onDrop: (type: QuestionType) => void;
  draggedType: QuestionType | null;
  onQuestionSelect?: (id: string) => void;
}

export function SurveyCanvas({
  questions,
  onQuestionsChange,
  onDrop,
  draggedType,
  onQuestionSelect,
}: SurveyCanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedType) {
      onDrop(draggedType);
    } else if (draggedQuestion) {
      // Reorder questions
      const newQuestions = [...questions];
      const draggedIndex = newQuestions.findIndex((q) => q.id === draggedQuestion);
      const [removed] = newQuestions.splice(draggedIndex, 1);
      newQuestions.splice(index, 0, removed);
      
      // Update positions
      newQuestions.forEach((q, i) => {
        q.position = i;
      });
      
      onQuestionsChange(newQuestions);
      setDraggedQuestion(null);
    }
  };

  const handleQuestionDragStart = (questionId: string) => {
    setDraggedQuestion(questionId);
  };

  const updateQuestionTitle = (id: string, title: string) => {
    const newQuestions = questions.map((q) =>
      q.id === id ? { ...q, title } : q
    );
    onQuestionsChange(newQuestions);
  };

  const deleteQuestion = (id: string) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    newQuestions.forEach((q, i) => {
      q.position = i;
    });
    onQuestionsChange(newQuestions);
  };

  const duplicateQuestion = (id: string) => {
    const index = questions.findIndex((q) => q.id === id);
    const question = questions[index];
    const newQuestion: SurveyQuestion = {
      ...question,
      id: `${question.type.id}-${Date.now()}`,
      title: `${question.title} (Copy)`,
      position: index + 1,
    };
    
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    newQuestions.forEach((q, i) => {
      q.position = i;
    });
    onQuestionsChange(newQuestions);
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Survey Canvas</span>
          <span className="text-sm font-normal text-muted-foreground">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {questions.length === 0 ? (
          <div
            className={cn(
              "h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
              draggedType ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            )}
            onDragOver={(e) => handleDragOver(e, 0)}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Drag questions here to build your survey</p>
              <p className="text-sm text-muted-foreground/60">Questions will appear in order</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                draggable
                onDragStart={() => handleQuestionDragStart(question.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={cn(
                  "group relative rounded-xl border bg-card p-4 transition-all",
                  dragOverIndex === index && "border-primary shadow-lg",
                  draggedQuestion === question.id && "opacity-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {question.type.name}
                      </span>
                    </div>
                    
                    <Input
                      value={question.title}
                      onChange={(e) => updateQuestionTitle(question.id, e.target.value)}
                      placeholder="Enter question..."
                      className="border-0 p-0 text-base font-medium h-auto focus-visible:ring-0 bg-transparent"
                    />
                    
                    <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                      {question.type.icon}
                      <span className="text-sm">{question.type.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => duplicateQuestion(question.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onQuestionSelect?.(question.id)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Drop zone at the end */}
            <div
              className={cn(
                "h-20 rounded-xl border-2 border-dashed transition-colors flex items-center justify-center",
                (draggedType || draggedQuestion) && dragOverIndex === questions.length
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              )}
              onDragOver={(e) => handleDragOver(e, questions.length)}
              onDrop={(e) => handleDrop(e, questions.length)}
            >
              <p className="text-sm text-muted-foreground">Drop here to add at the end</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
