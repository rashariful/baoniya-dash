import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend }: StatsCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-hover transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {trend && (
              <p className="text-xs text-accent mt-1">{trend}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
