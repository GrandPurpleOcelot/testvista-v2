import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Users, ArrowRight, FileText, User } from "lucide-react";

export default function AllProjects() {
  const navigate = useNavigate();

  const handleMySpaceClick = () => {
    navigate("/my-space");
  };

  const handleSharedProjectsClick = () => {
    navigate("/shared-projects");
  };

  return (
    <div className="min-h-screen bg-workspace-bg flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">All Projects</h1>
          <p className="text-lg text-muted-foreground">
            Choose where you want to work today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* My Space Card */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-card">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-hover/20 transition-colors">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold text-card-foreground">My Space</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Your personal workspace for private projects, test suites, and files
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Private test suites</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>Personal folders</span>
                </div>
              </div>
              <Button 
                onClick={handleMySpaceClick}
                className="w-full mt-6 group-hover:bg-primary-hover transition-colors"
              >
                Enter My Space
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Shared Projects Card */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-card">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-secondary-light rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary-hover/20 transition-colors">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-semibold text-card-foreground">Shared Projects</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Collaborate with your team on shared projects and test suites
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Team collaboration</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>Shared workspaces</span>
                </div>
              </div>
              <Button 
                onClick={handleSharedProjectsClick}
                className="w-full mt-6 bg-secondary hover:bg-secondary-hover transition-colors"
              >
                View Shared Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}