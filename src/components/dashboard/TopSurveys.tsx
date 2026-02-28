import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const surveys = [
  {
    id: 1,
    name: "Customer Satisfaction 2024",
    responses: 1234,
    target: 1500,
    status: "active",
    platform: "web",
  },
  {
    id: 2,
    name: "Employee Engagement Survey",
    responses: 856,
    target: 1000,
    status: "active",
    platform: "both",
  },
  {
    id: 3,
    name: "Product Feedback - Mobile App",
    responses: 2450,
    target: 2500,
    status: "active",
    platform: "mobile",
  },
  {
    id: 4,
    name: "Market Research Q1",
    responses: 500,
    target: 500,
    status: "completed",
    platform: "web",
  },
];

export function TopSurveys() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Top Surveys</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {surveys.map((survey) => {
            const progress = (survey.responses / survey.target) * 100;
            return (
              <div
                key={survey.id}
                className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{survey.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {survey.responses.toLocaleString()} / {survey.target.toLocaleString()} responses
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={survey.status === "active" ? "default" : "secondary"}
                      className={survey.status === "active" ? "gradient-success" : ""}
                    >
                      {survey.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {survey.platform}
                    </Badge>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
