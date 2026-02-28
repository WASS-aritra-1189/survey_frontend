import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Monitor, Smartphone } from "lucide-react";

interface SurveySettingsProps {
  title: string;
  onTitleChange: (title: string) => void;
  platform: string;
  onPlatformChange: (platform: string) => void;
}

export function SurveySettings({
  title,
  onTitleChange,
  platform,
  onPlatformChange,
}: SurveySettingsProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Survey Settings</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto custom-scrollbar space-y-6 h-[calc(100%-4rem)] pb-4">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="survey-title">Survey Title</Label>
            <Input
              id="survey-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter survey title..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="survey-desc">Description</Label>
            <Textarea
              id="survey-desc"
              placeholder="Enter survey description..."
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* Platform */}
        <div className="space-y-4">
          <Label>Target Platform</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "web", label: "Web", icon: <Monitor className="h-4 w-4" /> },
              { value: "mobile", label: "Mobile", icon: <Smartphone className="h-4 w-4" /> },
              { value: "both", label: "Both", icon: (
                <div className="flex gap-0.5">
                  <Monitor className="h-3 w-3" />
                  <Smartphone className="h-3 w-3" />
                </div>
              )},
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onPlatformChange(option.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                  platform === option.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {option.icon}
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Options */}
        <div className="space-y-4">
          <Label>Survey Options</Label>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Track Device</p>
              <p className="text-xs text-muted-foreground">Capture device ID</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">GPS Location</p>
              <p className="text-xs text-muted-foreground">Track respondent location</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Geo-Fencing</p>
              <p className="text-xs text-muted-foreground">Restrict survey area</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Anonymous Responses</p>
              <p className="text-xs text-muted-foreground">Hide respondent info</p>
            </div>
            <Switch />
          </div>
        </div>

        <Separator />

        {/* Assign Users */}
        <div className="space-y-4">
          <Label>Assign Users</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select users to assign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="field-team-a">Field Team A</SelectItem>
              <SelectItem value="field-team-b">Field Team B</SelectItem>
              <SelectItem value="specific">Specific Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
