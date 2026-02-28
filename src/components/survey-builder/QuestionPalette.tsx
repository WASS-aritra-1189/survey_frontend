import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionTypes, questionCategories, QuestionType } from "./QuestionTypes";
import { cn } from "@/lib/utils";

interface QuestionPaletteProps {
  onDragStart: (type: QuestionType) => void;
}

export function QuestionPalette({ onDragStart }: QuestionPaletteProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Question Types</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto custom-scrollbar h-[calc(100%-4rem)] pb-4">
        {questionCategories.map((category) => {
          const categoryQuestions = questionTypes.filter((q) => q.category === category);
          return (
            <div key={category} className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {category}
              </h4>
              <div className="space-y-1">
                {categoryQuestions.map((question) => (
                  <div
                    key={question.id}
                    draggable
                    onDragStart={() => onDragStart(question)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing",
                      "bg-muted/50 hover:bg-muted border border-transparent hover:border-border",
                      "transition-all duration-200 group"
                    )}
                  >
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      {question.icon}
                    </div>
                    <span className="text-sm font-medium">{question.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
