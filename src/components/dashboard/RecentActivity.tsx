import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Smartphone, MapPin } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "survey",
    title: "New survey created",
    description: "Customer Feedback Q1 2024",
    time: "5 minutes ago",
    icon: <FileText className="h-4 w-4" />,
    user: "John Doe",
    initials: "JD",
  },
  {
    id: 2,
    type: "user",
    title: "User assigned to survey",
    description: "Sarah Wilson assigned to Field Survey #42",
    time: "15 minutes ago",
    icon: <User className="h-4 w-4" />,
    user: "Admin",
    initials: "AD",
  },
  {
    id: 3,
    type: "device",
    title: "New device registered",
    description: "Device ID: D-7892 registered successfully",
    time: "1 hour ago",
    icon: <Smartphone className="h-4 w-4" />,
    user: "System",
    initials: "SY",
  },
  {
    id: 4,
    type: "geofence",
    title: "Geo-fence alert triggered",
    description: "Device exited designated survey area",
    time: "2 hours ago",
    icon: <MapPin className="h-4 w-4" />,
    user: "System",
    initials: "SY",
  },
];

export function RecentActivity() {
  return (
    <Card variant="elevated" className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Activity</span>
          <Badge variant="secondary" className="font-normal">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-secondary">
                      {activity.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
