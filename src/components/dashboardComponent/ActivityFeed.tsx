import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MessageSquare, FileText } from "lucide-react";

const activities = [
  {
    icon: CheckCircle,
    title: "Project Completed",
    description: "Scandinavian Bedroom project marked as complete",
    time: "2 hours ago",
    color: "text-primary",
  },
  {
    icon: MessageSquare,
    title: "New Client Message",
    description: "Emma Williams sent a message about revisions",
    time: "4 hours ago",
    color: "text-accent",
  },
  {
    icon: FileText,
    title: "Proposal Sent",
    description: "Sent proposal to Tech Startup Inc for Home Office",
    time: "1 day ago",
    color: "text-secondary",
  },
  {
    icon: Clock,
    title: "Meeting Scheduled",
    description: "Client meeting with The Anderson Family",
    time: "2 days ago",
    color: "text-muted-foreground",
  },
];

export const ActivityFeed = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
