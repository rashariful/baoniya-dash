import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  image: string;
  title: string;
  client: string;
  status: "In Progress" | "Completed" | "Planning";
  category: string;
}

export const ProjectCard = ({ image, title, client, status, category }: ProjectCardProps) => {
  const statusColors = {
    "In Progress": "bg-accent text-accent-foreground",
    "Completed": "bg-primary text-primary-foreground",
    "Planning": "bg-secondary text-secondary-foreground",
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer">
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{client}</p>
          </div>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{category}</span>
        </div>
      </CardContent>
    </Card>
  );
};
