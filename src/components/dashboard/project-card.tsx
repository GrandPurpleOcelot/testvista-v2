import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TestTube, Users, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: "active" | "completed" | "draft";
    suites: number;
    testCases: number;
    coverage: number;
    lastActivity: string;
    members: number;
  };
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const navigate = useNavigate();
  
  const statusColors = {
    active: "bg-success text-success-foreground",
    completed: "bg-muted text-muted-foreground", 
    draft: "bg-warning text-warning-foreground"
  };

  const handleClick = () => {
    navigate(`/suite/${project.id}`);
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 hover:border-primary/20 hover:bg-card-hover",
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 mr-2">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={statusColors[project.status]}>
              {project.status}
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <TestTube className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Suites:</span>
            <span className="font-medium">{project.suites}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-secondary" />
            <span className="text-muted-foreground">Members:</span>
            <span className="font-medium">{project.members}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Test Cases</span>
            <span className="font-medium">{project.testCases.toLocaleString()}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Coverage</span>
              <span className="font-medium">{project.coverage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.coverage}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Last activity: {project.lastActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}