import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GitBranch,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  SkipForward,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Play,
  Square,
  Circle,
  Diamond,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SurveyQuestion } from "./SurveyCanvas";
import { QuestionLogicConfig } from "./QuestionLogic";

interface BranchingLogicFlowchartProps {
  questions: SurveyQuestion[];
  logics: Record<string, QuestionLogicConfig>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Flow node types
type NodeType = "start" | "question" | "condition" | "end" | "skip";

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  questionId?: string;
  position: { x: number; y: number };
  branches?: {
    label: string;
    targetId: string;
    condition?: string;
  }[];
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  type: "normal" | "skip" | "conditional";
}

export function BranchingLogicFlowchart({
  questions,
  logics,
  open,
  onOpenChange,
}: BranchingLogicFlowchartProps) {
  const [zoom, setZoom] = useState(100);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightPath, setHighlightPath] = useState<string[]>([]);

  // Build flow data from questions and logic
  const { nodes, edges } = useMemo(() => {
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    // Add start node
    nodes.push({
      id: "start",
      type: "start",
      label: "Survey Start",
      position: { x: 300, y: 50 },
    });

    // Add question nodes
    questions.forEach((q, i) => {
      const logic = logics[q.id];
      const hasLogic = logic && logic.rules.length > 0;

      nodes.push({
        id: q.id,
        type: hasLogic ? "condition" : "question",
        label: q.title || `Question ${i + 1}`,
        questionId: q.id,
        position: { x: 300, y: 150 + i * 120 },
        branches: hasLogic
          ? logic.rules.map((rule) => ({
              label: `If ${rule.condition}`,
              targetId: rule.targetQuestionId || "end",
              condition: typeof rule.condition === 'string' ? rule.condition : `${rule.condition.operator} "${rule.condition.value}"`,
            }))
          : undefined,
      });

      // Add edges
      if (i === 0) {
        edges.push({ from: "start", to: q.id, type: "normal" });
      }

      // Add logic-based edges
      if (hasLogic) {
        logic.rules.forEach((rule) => {
          if (rule.type === "skip") {
            edges.push({
              from: q.id,
              to: rule.targetQuestionId || "end",
              label: `Skip to ${rule.targetQuestionId}`,
              type: "skip",
            });
          } else if (rule.type === "show") {
            edges.push({
              from: q.id,
              to: rule.targetQuestionId || questions[i + 1]?.id || "end",
              label: `${rule.type}: ${rule.condition}`,
              type: "conditional",
            });
          }
        });
      }

      // Add normal flow edge to next question
      if (i < questions.length - 1) {
        edges.push({ from: q.id, to: questions[i + 1].id, type: "normal" });
      }
    });

    // Add end node
    nodes.push({
      id: "end",
      type: "end",
      label: "Survey End",
      position: { x: 300, y: 150 + questions.length * 120 },
    });

    // Connect last question to end
    if (questions.length > 0) {
      edges.push({
        from: questions[questions.length - 1].id,
        to: "end",
        type: "normal",
      });
    } else {
      edges.push({ from: "start", to: "end", type: "normal" });
    }

    return { nodes, edges };
  }, [questions, logics]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 50));
  const handleResetZoom = () => setZoom(100);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);

    // Highlight path from start to this node
    if (nodeId !== selectedNode) {
      const path: string[] = ["start"];
      let currentId = "start";
      for (const edge of edges) {
        if (edge.from === currentId) {
          path.push(edge.to);
          currentId = edge.to;
          if (currentId === nodeId) break;
        }
      }
      setHighlightPath(path);
    } else {
      setHighlightPath([]);
    }
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "start":
        return <Play className="h-4 w-4" />;
      case "end":
        return <Square className="h-4 w-4" />;
      case "condition":
        return <Diamond className="h-4 w-4" />;
      case "skip":
        return <SkipForward className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getNodeStyles = (node: FlowNode) => {
    const isHighlighted = highlightPath.includes(node.id);
    const isSelected = selectedNode === node.id;

    const baseStyles = "p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer";

    switch (node.type) {
      case "start":
        return cn(
          baseStyles,
          "bg-success/10 border-success/50 text-success",
          isHighlighted && "ring-2 ring-success ring-offset-2",
          isSelected && "border-success shadow-lg"
        );
      case "end":
        return cn(
          baseStyles,
          "bg-destructive/10 border-destructive/50 text-destructive",
          isHighlighted && "ring-2 ring-destructive ring-offset-2",
          isSelected && "border-destructive shadow-lg"
        );
      case "condition":
        return cn(
          baseStyles,
          "bg-warning/10 border-warning/50",
          isHighlighted && "ring-2 ring-warning ring-offset-2",
          isSelected && "border-warning shadow-lg"
        );
      default:
        return cn(
          baseStyles,
          "bg-card border-border hover:border-primary/50",
          isHighlighted && "ring-2 ring-primary ring-offset-2",
          isSelected && "border-primary shadow-lg"
        );
    }
  };

  const renderFlowNode = (node: FlowNode, index: number) => {
    const hasLogic = node.type === "condition";
    const question = questions.find((q) => q.id === node.questionId);

    return (
      <div
        key={node.id}
        className="flex flex-col items-center"
        onClick={() => handleNodeClick(node.id)}
      >
        {/* Connector line from previous */}
        {index > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-8 w-0.5 bg-border" />
            <ArrowDown className="h-4 w-4 text-muted-foreground -mt-1" />
          </div>
        )}

        {/* Node */}
        <div className={getNodeStyles(node)}>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-full",
                node.type === "start" && "bg-success/20",
                node.type === "end" && "bg-destructive/20",
                node.type === "condition" && "bg-warning/20",
                node.type === "question" && "bg-primary/20"
              )}
            >
              {getNodeIcon(node.type)}
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">{node.label}</p>
              {question && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {question.type.name}
                  {question.required && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      Required
                    </Badge>
                  )}
                </p>
              )}
            </div>
            {hasLogic && (
              <Badge variant="outline" className="ml-auto text-xs">
                <GitBranch className="h-3 w-3 mr-1" />
                {logics[node.id!]?.rules.length || 0} rules
              </Badge>
            )}
          </div>

          {/* Show branches for condition nodes */}
          {hasLogic && logics[node.questionId!] && (
            <div className="mt-3 pt-3 border-t space-y-2">
              {logics[node.questionId!].rules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs p-2 rounded bg-muted/50"
                >
                  <Badge
                    variant={
                      rule.type === "skip"
                        ? "destructive"
                        : rule.type === "show"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {rule.type}
                  </Badge>
                  <span className="text-muted-foreground">
                    If answer {typeof rule.condition === 'string' ? rule.condition : `${rule.condition.operator} "${rule.condition.value}"`}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="font-medium">
                    {rule.targetQuestionId
                      ? questions.find((q) => q.id === rule.targetQuestionId)?.title ||
                        rule.targetQuestionId
                      : "End"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Survey Flow Visualization
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono w-14 text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetZoom}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden mt-4">
          {/* Legend */}
          <Card className="w-64 shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-success/20 flex items-center justify-center">
                  <Play className="h-2.5 w-2.5 text-success" />
                </div>
                <span>Survey Start</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Circle className="h-2.5 w-2.5 text-primary" />
                </div>
                <span>Question</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-warning/20 flex items-center justify-center">
                  <Diamond className="h-2.5 w-2.5 text-warning" />
                </div>
                <span>Conditional Logic</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Square className="h-2.5 w-2.5 text-destructive" />
                </div>
                <span>Survey End</span>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Edge Types</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-0.5 bg-border" />
                    <span>Normal Flow</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-0.5 bg-warning border-dashed border-t-2 border-warning" />
                    <span>Conditional</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-0.5 bg-destructive/50" />
                    <span>Skip</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Statistics</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>With Logic:</span>
                    <span className="font-medium">{Object.keys(logics).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Rules:</span>
                    <span className="font-medium">
                      {Object.values(logics).reduce((acc, l) => acc + l.rules.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flowchart */}
          <Card className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div
                className="p-8 min-h-full flex flex-col items-center"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              >
                {nodes.map((node, index) => renderFlowNode(node, index))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Selected Node Details */}
        {selectedNode && selectedNode !== "start" && selectedNode !== "end" && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Selected: {questions.find((q) => q.id === selectedNode)?.title || selectedNode}
                </p>
                <p className="text-sm text-muted-foreground">
                  Click on nodes to see the flow path from start
                </p>
              </div>
              {logics[selectedNode] && (
                <Badge variant="outline">
                  {logics[selectedNode].rules.length} logic rule(s) configured
                </Badge>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
