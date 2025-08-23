import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProjectFilters } from "@/components/project/project-filters";
import { UnifiedProjectCard } from "@/components/project/unified-project-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  TestTube, 
  Users, 
  Target,
  TrendingUp,
  Clock,
  Zap,
  Calendar,
  Star
} from "lucide-react";
import { ProjectFilter, ProjectSort, Project } from "@/types/project";
import { mockProjects, recentActivity, projectRecommendations } from "@/data/mockProjects";
import { toast } from "@/hooks/use-toast";

export default function ProjectManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");
  const [sortBy, setSortBy] = useState<ProjectSort>("lastActivity");
  const navigate = useNavigate();

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...mockProjects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case "my-projects":
        filtered = filtered.filter(p => p.type === "private");
        break;
      case "shared-projects":
        filtered = filtered.filter(p => p.type === "shared");
        break;
      case "recent":
        // Show projects with activity in last 24 hours
        filtered = filtered.filter(p => 
          p.lastActivity.includes("hour") || p.lastActivity === "1 day ago"
        );
        break;
      case "favorites":
        filtered = filtered.filter(p => p.isFavorite);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "coverage":
          return b.coverage - a.coverage;
        case "testCases":
          return b.testCases - a.testCases;
        case "lastActivity":
        default:
          // Simple sorting by last activity (would need proper date parsing in real app)
          const getActivityWeight = (activity: string) => {
            if (activity.includes("hour")) return 1;
            if (activity.includes("day")) return 2;
            if (activity.includes("week")) return 3;
            return 4;
          };
          return getActivityWeight(a.lastActivity) - getActivityWeight(b.lastActivity);
      }
    });

    return filtered;
  }, [searchQuery, activeFilter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const myProjects = mockProjects.filter(p => p.type === "private");
    const sharedProjects = mockProjects.filter(p => p.type === "shared");
    const totalTestCases = mockProjects.reduce((sum, p) => sum + p.testCases, 0);
    const avgCoverage = Math.round(
      mockProjects.reduce((sum, p) => sum + p.coverage, 0) / mockProjects.length
    );

    return {
      myProjects: myProjects.length,
      sharedProjects: sharedProjects.length,
      totalTestCases,
      avgCoverage
    };
  }, []);

  // Project actions
  const handleToggleFavorite = (projectId: string) => {
    toast({
      title: "Favorite updated",
      description: "Project favorite status has been updated.",
    });
  };

  const handleShareProject = (projectId: string) => {
    toast({
      title: "Share project",
      description: "Project sharing dialog would open here.",
    });
  };

  const handleCloneProject = (projectId: string) => {
    toast({
      title: "Project cloned",
      description: "Project has been cloned to your private space.",
    });
  };

  const handleArchiveProject = (projectId: string) => {
    toast({
      title: "Project archived",
      description: "Project has been moved to archived projects.",
    });
  };

  const handleDeleteProject = (projectId: string) => {
    toast({
      title: "Project deleted",
      description: "Project has been permanently deleted.",
      variant: "destructive"
    });
  };

  const handleCreateProject = () => {
    navigate("/create-suite");
  };

  return (
    <div className="flex h-screen bg-workspace-bg">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="My Projects"
                value={stats.myProjects.toString()}
                description="Private projects"
                icon={FolderOpen}
                trend={{ value: 2, label: "this month" }}
              />
              <StatsCard
                title="Shared Projects"
                value={stats.sharedProjects.toString()}
                description="Collaborative projects"
                icon={Users}
                trend={{ value: 3, label: "new invites" }}
              />
              <StatsCard
                title="Total Test Cases"
                value={stats.totalTestCases.toLocaleString()}
                description="Across all projects"
                icon={Target}
                trend={{ value: 15, label: "this week" }}
              />
              <StatsCard
                title="Avg Coverage"
                value={`${stats.avgCoverage}%`}
                description="All projects"
                icon={TrendingUp}
                trend={{ value: 4, label: "improvement" }}
              />
            </div>

            {/* Quick Recommendations */}
            {activeFilter === "all" && !searchQuery && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projectRecommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-4 bg-card/50 rounded-lg border border-border/30 hover:border-primary/20 transition-colors cursor-pointer"
                        onClick={() => navigate(`/suite/${rec.projectId}`)}
                      >
                        <div className="flex items-start gap-3">
                          {rec.type === "continue" && <Clock className="h-4 w-4 text-warning mt-1" />}
                          {rec.type === "collaborate" && <Users className="h-4 w-4 text-blue-500 mt-1" />}
                          {rec.type === "similar" && <Star className="h-4 w-4 text-primary mt-1" />}
                          <div>
                            <h4 className="font-medium text-sm">{rec.title}</h4>
                            <p className="text-xs text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            {activeFilter === "recent" && !searchQuery && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action} in{" "}
                            <span className="font-medium">{activity.projectName}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Management */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  All Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProjectFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onCreateProject={handleCreateProject}
                  totalCount={mockProjects.length}
                  filteredCount={filteredAndSortedProjects.length}
                />

                {/* Projects Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAndSortedProjects.map((project) => (
                    <UnifiedProjectCard
                      key={project.id}
                      project={project}
                      onToggleFavorite={handleToggleFavorite}
                      onShareProject={handleShareProject}
                      onCloneProject={handleCloneProject}
                      onArchiveProject={handleArchiveProject}
                      onDeleteProject={handleDeleteProject}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {filteredAndSortedProjects.length === 0 && (
                  <div className="text-center py-12">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No projects found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || activeFilter !== "all" 
                        ? "Try adjusting your search or filters." 
                        : "Start by creating your first project."}
                    </p>
                    {(!searchQuery && activeFilter === "all") && (
                      <Button onClick={handleCreateProject} className="gap-2">
                        <TestTube className="h-4 w-4" />
                        Create Your First Project
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}