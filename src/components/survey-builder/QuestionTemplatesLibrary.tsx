import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Star,
  MessageSquare,
  BarChart3,
  Users,
  Heart,
  ShoppingCart,
  GraduationCap,
  Stethoscope,
  Briefcase,
  Home,
  Smile,
  ThumbsUp,
  Target,
  Lightbulb,
  Clock,
  CheckCircle,
  ArrowRight,
  GripVertical,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionType, questionTypes } from "./QuestionTypes";

// Question template categories
const templateCategories = [
  { id: "all", name: "All Templates", icon: BarChart3 },
  { id: "customer", name: "Customer Feedback", icon: Heart },
  { id: "employee", name: "Employee Engagement", icon: Users },
  { id: "market", name: "Market Research", icon: Target },
  { id: "product", name: "Product Feedback", icon: ShoppingCart },
  { id: "healthcare", name: "Healthcare", icon: Stethoscope },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "events", name: "Events", icon: Briefcase },
];

// Pre-built question templates
const questionTemplates = [
  // Customer Feedback
  {
    id: "nps-standard",
    category: "customer",
    name: "Net Promoter Score (NPS)",
    description: "How likely are you to recommend us to a friend or colleague?",
    questionType: "nps",
    icon: ThumbsUp,
    popular: true,
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    tags: ["NPS", "Loyalty", "Recommendation"],
  },
  {
    id: "csat-rating",
    category: "customer",
    name: "Customer Satisfaction (CSAT)",
    description: "How satisfied are you with our product/service?",
    questionType: "rating",
    icon: Star,
    popular: true,
    options: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    tags: ["CSAT", "Satisfaction"],
  },
  {
    id: "service-quality",
    category: "customer",
    name: "Service Quality Rating",
    description: "How would you rate the quality of our customer service?",
    questionType: "rating",
    icon: Star,
    popular: false,
    options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    tags: ["Service", "Quality"],
  },
  {
    id: "support-experience",
    category: "customer",
    name: "Support Experience",
    description: "How would you describe your experience with our support team?",
    questionType: "single-choice",
    icon: MessageSquare,
    popular: false,
    options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
    tags: ["Support", "Experience"],
  },
  {
    id: "improvement-feedback",
    category: "customer",
    name: "Improvement Suggestions",
    description: "What could we do to improve your experience?",
    questionType: "long-text",
    icon: Lightbulb,
    popular: true,
    tags: ["Feedback", "Open-ended"],
  },
  {
    id: "purchase-intent",
    category: "customer",
    name: "Purchase Intent",
    description: "How likely are you to purchase from us again?",
    questionType: "rating",
    icon: ShoppingCart,
    popular: false,
    options: ["Very Unlikely", "Unlikely", "Neutral", "Likely", "Very Likely"],
    tags: ["Purchase", "Intent"],
  },

  // Employee Engagement
  {
    id: "enps",
    category: "employee",
    name: "Employee NPS (eNPS)",
    description: "How likely are you to recommend this company as a place to work?",
    questionType: "nps",
    icon: ThumbsUp,
    popular: true,
    tags: ["eNPS", "Employee", "Recommendation"],
  },
  {
    id: "job-satisfaction",
    category: "employee",
    name: "Job Satisfaction",
    description: "How satisfied are you with your current role?",
    questionType: "rating",
    icon: Smile,
    popular: true,
    options: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    tags: ["Job", "Satisfaction"],
  },
  {
    id: "work-life-balance",
    category: "employee",
    name: "Work-Life Balance",
    description: "How would you rate your work-life balance?",
    questionType: "rating",
    icon: Clock,
    popular: false,
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
    tags: ["Work-Life", "Balance"],
  },
  {
    id: "manager-support",
    category: "employee",
    name: "Manager Support",
    description: "My manager provides adequate support and guidance.",
    questionType: "single-choice",
    icon: Users,
    popular: false,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    tags: ["Manager", "Support"],
  },
  {
    id: "career-growth",
    category: "employee",
    name: "Career Growth Opportunities",
    description: "I see opportunities for career growth in this organization.",
    questionType: "single-choice",
    icon: Target,
    popular: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    tags: ["Career", "Growth"],
  },
  {
    id: "team-collaboration",
    category: "employee",
    name: "Team Collaboration",
    description: "How would you rate the collaboration within your team?",
    questionType: "rating",
    icon: Users,
    popular: false,
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
    tags: ["Team", "Collaboration"],
  },

  // Market Research
  {
    id: "brand-awareness",
    category: "market",
    name: "Brand Awareness",
    description: "How did you first hear about our brand?",
    questionType: "single-choice",
    icon: Target,
    popular: true,
    options: ["Social Media", "Search Engine", "Word of Mouth", "Advertisement", "Other"],
    tags: ["Brand", "Awareness"],
  },
  {
    id: "competitor-comparison",
    category: "market",
    name: "Competitor Comparison",
    description: "How do we compare to our competitors?",
    questionType: "single-choice",
    icon: BarChart3,
    popular: true,
    options: ["Much Better", "Somewhat Better", "About the Same", "Somewhat Worse", "Much Worse"],
    tags: ["Competitor", "Comparison"],
  },
  {
    id: "price-perception",
    category: "market",
    name: "Price Perception",
    description: "How do you perceive our pricing compared to the value received?",
    questionType: "single-choice",
    icon: ShoppingCart,
    popular: false,
    options: ["Excellent Value", "Good Value", "Fair Value", "Poor Value", "Very Poor Value"],
    tags: ["Price", "Value"],
  },
  {
    id: "feature-importance",
    category: "market",
    name: "Feature Importance Ranking",
    description: "Rank the following features by importance to you",
    questionType: "ranking",
    icon: BarChart3,
    popular: false,
    options: ["Price", "Quality", "Features", "Support", "Brand"],
    tags: ["Features", "Ranking"],
  },

  // Product Feedback
  {
    id: "product-usability",
    category: "product",
    name: "Product Usability",
    description: "How easy is our product to use?",
    questionType: "rating",
    icon: CheckCircle,
    popular: true,
    options: ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"],
    tags: ["Usability", "UX"],
  },
  {
    id: "feature-request",
    category: "product",
    name: "Feature Request",
    description: "What features would you like to see added?",
    questionType: "long-text",
    icon: Lightbulb,
    popular: true,
    tags: ["Features", "Request"],
  },
  {
    id: "bug-report",
    category: "product",
    name: "Bug/Issue Description",
    description: "Please describe any issues you've encountered",
    questionType: "long-text",
    icon: MessageSquare,
    popular: false,
    tags: ["Bug", "Issue"],
  },
  {
    id: "usage-frequency",
    category: "product",
    name: "Usage Frequency",
    description: "How often do you use our product?",
    questionType: "single-choice",
    icon: Clock,
    popular: false,
    options: ["Daily", "Weekly", "Monthly", "Rarely", "First time"],
    tags: ["Usage", "Frequency"],
  },

  // Healthcare
  {
    id: "patient-satisfaction",
    category: "healthcare",
    name: "Patient Satisfaction",
    description: "How satisfied were you with your visit today?",
    questionType: "rating",
    icon: Heart,
    popular: true,
    options: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    tags: ["Patient", "Satisfaction"],
  },
  {
    id: "wait-time",
    category: "healthcare",
    name: "Wait Time Experience",
    description: "How would you rate your wait time?",
    questionType: "single-choice",
    icon: Clock,
    popular: false,
    options: ["Excellent", "Good", "Acceptable", "Poor", "Unacceptable"],
    tags: ["Wait Time"],
  },
  {
    id: "staff-courtesy",
    category: "healthcare",
    name: "Staff Courtesy",
    description: "How courteous and helpful was our staff?",
    questionType: "rating",
    icon: Smile,
    popular: false,
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
    tags: ["Staff", "Courtesy"],
  },

  // Education
  {
    id: "course-rating",
    category: "education",
    name: "Course Rating",
    description: "How would you rate this course overall?",
    questionType: "rating",
    icon: Star,
    popular: true,
    options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    tags: ["Course", "Rating"],
  },
  {
    id: "instructor-effectiveness",
    category: "education",
    name: "Instructor Effectiveness",
    description: "How effective was the instructor in delivering the material?",
    questionType: "rating",
    icon: GraduationCap,
    popular: true,
    options: ["Not Effective", "Slightly Effective", "Moderately Effective", "Very Effective", "Extremely Effective"],
    tags: ["Instructor", "Teaching"],
  },
  {
    id: "learning-objectives",
    category: "education",
    name: "Learning Objectives Met",
    description: "Were the learning objectives clearly met?",
    questionType: "single-choice",
    icon: Target,
    popular: false,
    options: ["Not at all", "Partially", "Mostly", "Completely"],
    tags: ["Learning", "Objectives"],
  },

  // Events
  {
    id: "event-satisfaction",
    category: "events",
    name: "Event Satisfaction",
    description: "How satisfied were you with the event overall?",
    questionType: "rating",
    icon: Star,
    popular: true,
    options: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    tags: ["Event", "Satisfaction"],
  },
  {
    id: "venue-rating",
    category: "events",
    name: "Venue Rating",
    description: "How would you rate the event venue?",
    questionType: "rating",
    icon: Home,
    popular: false,
    options: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
    tags: ["Venue", "Location"],
  },
  {
    id: "speaker-quality",
    category: "events",
    name: "Speaker Quality",
    description: "How would you rate the quality of the speakers?",
    questionType: "rating",
    icon: Users,
    popular: true,
    options: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
    tags: ["Speakers", "Quality"],
  },
  {
    id: "attend-again",
    category: "events",
    name: "Would Attend Again",
    description: "Would you attend this event again?",
    questionType: "single-choice",
    icon: ThumbsUp,
    popular: false,
    options: ["Definitely Not", "Probably Not", "Maybe", "Probably Yes", "Definitely Yes"],
    tags: ["Attend", "Return"],
  },
];

interface QuestionTemplatesLibraryProps {
  onSelectTemplate: (template: typeof questionTemplates[0], questionType: QuestionType) => void;
}

export function QuestionTemplatesLibrary({ onSelectTemplate }: QuestionTemplatesLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTemplates = questionTemplates.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, template: typeof questionTemplates[0]) => {
    e.dataTransfer.setData("template", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "copy";
  };

  const getQuestionType = (typeId: string): QuestionType => {
    return questionTypes.find((q) => q.id === typeId) || questionTypes[0];
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3 space-y-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Question Templates
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
          <div className="px-4 border-b">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="w-max h-auto p-1 bg-transparent gap-1">
                {templateCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs px-3 py-1.5"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {cat.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </ScrollArea>
          </div>

          <TabsContent value={activeCategory} className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No templates found</p>
                  </div>
                ) : (
                  filteredTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <div
                        key={template.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, template)}
                        onClick={() => onSelectTemplate(template, getQuestionType(template.questionType))}
                        className={cn(
                          "p-3 rounded-lg border cursor-grab active:cursor-grabbing",
                          "bg-card hover:bg-muted/50 hover:border-primary/50",
                          "transition-all duration-200 group"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{template.name}</h4>
                              {template.popular && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {template.questionType.replace("-", " ")}
                              </Badge>
                              {template.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { questionTemplates };
