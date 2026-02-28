import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  GitBranch, 
  ArrowRight, 
  Plus, 
  Trash2,
  Eye,
  EyeOff,
  Link2
} from "lucide-react";
import { SurveyQuestion } from "./SurveyCanvas";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface LogicRule {
  id: string;
  type: 'skip' | 'show' | 'require';
  condition: {
    questionId: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
    value: string;
  };
  targetQuestionId: string;
}

export interface QuestionLogicConfig {
  questionId: string;
  rules: LogicRule[];
  dependencies: string[];
}

interface QuestionLogicProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: SurveyQuestion;
  allQuestions: SurveyQuestion[];
  existingLogic?: QuestionLogicConfig;
  onSave: (logic: QuestionLogicConfig) => void;
}

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'is_not_empty', label: 'Is Not Empty' },
];

const ruleTypes = [
  { value: 'skip', label: 'Skip to Question', icon: <ArrowRight className="h-4 w-4" /> },
  { value: 'show', label: 'Show Question', icon: <Eye className="h-4 w-4" /> },
  { value: 'require', label: 'Make Required', icon: <Link2 className="h-4 w-4" /> },
];

export function QuestionLogic({
  open,
  onOpenChange,
  question,
  allQuestions,
  existingLogic,
  onSave,
}: QuestionLogicProps) {
  const [rules, setRules] = useState<LogicRule[]>(existingLogic?.rules || []);
  
  const previousQuestions = allQuestions.filter(q => q.position < question.position);
  const nextQuestions = allQuestions.filter(q => q.position > question.position);

  const addRule = () => {
    const newRule: LogicRule = {
      id: `rule-${Date.now()}`,
      type: 'skip',
      condition: {
        questionId: previousQuestions[0]?.id || '',
        operator: 'equals',
        value: '',
      },
      targetQuestionId: nextQuestions[0]?.id || '',
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (ruleId: string, updates: Partial<LogicRule>) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const updateRuleCondition = (ruleId: string, updates: Partial<LogicRule['condition']>) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, condition: { ...rule.condition, ...updates } }
        : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const handleSave = () => {
    // Validate rules
    const invalidRules = rules.filter(rule => {
      if (!rule.condition.questionId) return true;
      if (!['is_empty', 'is_not_empty'].includes(rule.condition.operator) && !rule.condition.value) return true;
      if (rule.type !== 'require' && !rule.targetQuestionId) return true;
      return false;
    });

    if (invalidRules.length > 0) {
      toast.error('Please complete all logic rule configurations');
      return;
    }

    const dependencies = [...new Set(rules.map(r => r.condition.questionId))];
    
    onSave({
      questionId: question.id,
      rules,
      dependencies,
    });
    
    toast.success('Question logic saved successfully');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Question Logic & Branching
          </DialogTitle>
          <DialogDescription>
            Configure skip logic, conditional display, and dependencies for: "{question.title || question.type.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Question Info */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {question.position + 1}
              </div>
              <div>
                <p className="font-medium">{question.title || 'Untitled Question'}</p>
                <p className="text-sm text-muted-foreground">{question.type.name}</p>
              </div>
            </div>
          </div>

          {/* Logic Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Logic Rules</h4>
              <Button variant="outline" size="sm" onClick={addRule}>
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
              </Button>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No logic rules configured</p>
                <p className="text-sm">Add rules to control question flow</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl border border-border bg-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Rule {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Rule Type */}
                    <div className="space-y-2">
                      <Label>Rule Type</Label>
                      <div className="flex gap-2">
                        {ruleTypes.map(type => (
                          <Button
                            key={type.value}
                            variant={rule.type === type.value ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => updateRule(rule.id, { type: type.value as LogicRule['type'] })}
                          >
                            {type.icon}
                            <span className="ml-1">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>If Question</Label>
                        <Select
                          value={rule.condition.questionId}
                          onValueChange={(value) => updateRuleCondition(rule.id, { questionId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select question" />
                          </SelectTrigger>
                          <SelectContent>
                            {previousQuestions.map((q) => (
                              <SelectItem key={q.id} value={q.id}>
                                Q{q.position + 1}: {q.title || q.type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select
                          value={rule.condition.operator}
                          onValueChange={(value) => updateRuleCondition(rule.id, { operator: value as LogicRule['condition']['operator'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {operators.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={rule.condition.value}
                          onChange={(e) => updateRuleCondition(rule.id, { value: e.target.value })}
                          placeholder="Enter value"
                          disabled={['is_empty', 'is_not_empty'].includes(rule.condition.operator)}
                        />
                      </div>
                    </div>

                    {/* Target Question (for skip/show) */}
                    {rule.type !== 'require' && (
                      <div className="space-y-2">
                        <Label>Then {rule.type === 'skip' ? 'Skip To' : 'Show'}</Label>
                        <Select
                          value={rule.targetQuestionId}
                          onValueChange={(value) => updateRule(rule.id, { targetQuestionId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target question" />
                          </SelectTrigger>
                          <SelectContent>
                            {nextQuestions.map((q) => (
                              <SelectItem key={q.id} value={q.id}>
                                Q{q.position + 1}: {q.title || q.type.name}
                              </SelectItem>
                            ))}
                            {rule.type === 'skip' && (
                              <SelectItem value="end">End of Survey</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dependencies Summary */}
          {rules.length > 0 && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h4 className="font-medium text-primary mb-2">Dependencies</h4>
              <p className="text-sm text-muted-foreground">
                This question depends on answers from:{' '}
                {[...new Set(rules.map(r => {
                  const q = allQuestions.find(q => q.id === r.condition.questionId);
                  return q ? `Q${q.position + 1}` : '';
                }))].filter(Boolean).join(', ') || 'None'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Logic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Logic indicator badge for questions
interface LogicIndicatorProps {
  hasLogic: boolean;
  rulesCount: number;
  onClick?: () => void;
}

export function LogicIndicator({ hasLogic, rulesCount, onClick }: LogicIndicatorProps) {
  if (!hasLogic) return null;
  
  return (
    <Badge 
      variant="secondary" 
      className="cursor-pointer hover:bg-primary/10 transition-colors"
      onClick={onClick}
    >
      <GitBranch className="h-3 w-3 mr-1" />
      {rulesCount} rule{rulesCount !== 1 ? 's' : ''}
    </Badge>
  );
}
