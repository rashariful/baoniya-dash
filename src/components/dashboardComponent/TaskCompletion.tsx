import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const tasks = [
  { category: "Design Concepts", completed: 12, total: 15, percentage: 80 },
  { category: "Client Meetings", completed: 8, total: 10, percentage: 80 },
  { category: "Material Selection", completed: 18, total: 20, percentage: 90 },
  { category: "3D Renderings", completed: 5, total: 8, percentage: 62 },
];

export const TaskCompletion = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Task Completion Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tasks.map((task, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{task.category}</span>
                <span className="text-sm text-muted-foreground">
                  {task.completed}/{task.total}
                </span>
              </div>
              <Progress value={task.percentage} className="h-2" />
              <span className="text-xs text-muted-foreground">{task.percentage}% complete</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
