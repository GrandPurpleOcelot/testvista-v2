import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TestTube,
  Target,
  Clock,
  MoreHorizontal,
  Crown,
  Shield,
  Eye,
  Users,
  Lock,
  Share2,
  Copy,
  Star,
  StarOff,
  Archive,
  Trash2
} from "lucide-react";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface UnifiedProjectCardProps {
  project: Project;
  onToggleFavorite?: (projectId: string) => void;
  onShareProject?: (projectId: string) => void;
  onCloneProject?: (projectId: string) => void;
  onArchiveProject?: (projectId: string) => void;
  onDeleteProject?: (projectId: string) => void;
}

export function UnifiedProjectCard({ 
  project, 
  onToggleFavorite,
  onShareProject,
  onCloneProject,
  onArchiveProject,
  onDeleteProject
}: UnifiedProjectCardProps) {
  const navigate = useNavigate();

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3" />;
      case "admin":
        return <Shield className="h-3 w-3" />;
      case "collaborator":
        return <Users className="h-3 w-3" />;
      case "viewer":
        return <Eye className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "owner":
        return "bg-warning text-warning-foreground";
      case "admin":
        return "bg-primary text-primary-foreground";
      case "collaborator":
        return "bg-secondary text-secondary-foreground";
      case "viewer":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      case "draft":
        return "bg-warning text-warning-foreground";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = () => {
    return project.type === 'private' ? (
      <Lock className="h-3 w-3" />
    ) : (
      <Users className="h-3 w-3" />
    );
  };

  const getTypeColor = () => {
    return project.type === 'private' 
      ? "bg-muted text-muted-foreground" 
      : "bg-blue-500/10 text-blue-700 dark:text-blue-300";
  };

  return (
    <Card className="border-border/50 hover:border-primary/20 transition-all duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => navigate(`/project/${project.id}/folders`)}>
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <Badge className={getStatusColor(project.status)} variant="secondary">
                {project.status}
              </Badge>
              <Badge className={getTypeColor()} variant="secondary">
                <span className="flex items-center gap-1">
                  {getTypeIcon()}
                  {project.type}
                </span>
              </Badge>
              {project.isFavorite && (
                <Star className="h-4 w-4 fill-warning text-warning" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleFavorite?.(project.id)}>
                {project.isFavorite ? (
                  <><StarOff className="h-4 w-4 mr-2" /> Remove from favorites</>
                ) : (
                  <><Star className="h-4 w-4 mr-2" /> Add to favorites</>
                )}
              </DropdownMenuItem>
              
              {project.type === 'private' && (
                <DropdownMenuItem onClick={() => onShareProject?.(project.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share project
                </DropdownMenuItem>
              )}
              
              {project.type === 'shared' && (
                <DropdownMenuItem onClick={() => onCloneProject?.(project.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Clone to My Space
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onArchiveProject?.(project.id)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive project
              </DropdownMenuItem>
              
              {(project.type === 'private' || project.role === 'owner') && (
                <DropdownMenuItem 
                  onClick={() => onDeleteProject?.(project.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-medium">
              <TestTube className="h-3 w-3" />
              {project.testSuites}
            </div>
            <p className="text-xs text-muted-foreground">Suites</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-medium">
              <Target className="h-3 w-3" />
              {project.testCases}
            </div>
            <p className="text-xs text-muted-foreground">Cases</p>
          </div>
          <div>
            <div className="text-sm font-medium">{project.coverage}%</div>
            <p className="text-xs text-muted-foreground">Coverage</p>
          </div>
        </div>

        {/* Coverage Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Test Coverage</span>
            <span>{project.coverage}%</span>
          </div>
          <Progress value={project.coverage} className="h-2" />
        </div>

        {/* Team and Role Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project.type === 'shared' && project.members && (
              <>
                <div className="flex -space-x-2">
                  {project.owner && (
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{project.owner.initials}</AvatarFallback>
                    </Avatar>
                  )}
                  {project.members.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.memberCount > 4 && (
                    <div className="h-6 w-6 bg-muted border-2 border-background rounded-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{project.memberCount - 4}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{project.memberCount} members</span>
              </>
            )}
            
            {project.type === 'private' && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private project
              </span>
            )}
          </div>

          {project.role && (
            <Badge className={getRoleColor(project.role)} variant="secondary">
              <span className="flex items-center gap-1">
                {getRoleIcon(project.role)}
                {project.role}
              </span>
            </Badge>
          )}
        </div>

        {/* Last Activity */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <Clock className="h-3 w-3" />
          Last activity {project.lastActivity}
        </div>
      </CardContent>
    </Card>
  );
}