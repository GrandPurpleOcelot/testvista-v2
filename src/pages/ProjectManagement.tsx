import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MySpaceContent } from "@/components/project/my-space-content";
import { SharedProjectsContent } from "@/components/project/shared-projects-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { 
  FolderOpen, 
  TestTube, 
  Users, 
  Target,
  TrendingUp,
  Clock
} from "lucide-react";

export default function ProjectManagement() {
  const [activeTab, setActiveTab] = useState("my-space");

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
                title="My Folders"
                value="8"
                description="3 active folders"
                icon={FolderOpen}
                trend={{ value: 2, label: "this month" }}
              />
              <StatsCard
                title="Shared Projects"
                value="12"
                description="5 collaborative"
                icon={Users}
                trend={{ value: 3, label: "new invites" }}
              />
              <StatsCard
                title="Total Test Cases"
                value="1,247"
                description="Personal + shared"
                icon={Target}
                trend={{ value: 15, label: "this week" }}
              />
              <StatsCard
                title="Avg Coverage"
                value="89%"
                description="Across all projects"
                icon={TrendingUp}
                trend={{ value: 4, label: "improvement" }}
              />
            </div>

            {/* Project Management Tabs */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="my-space" className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      My Space
                    </TabsTrigger>
                    <TabsTrigger value="shared-projects" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Shared Projects
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="my-space" className="mt-6">
                    <MySpaceContent />
                  </TabsContent>
                  
                  <TabsContent value="shared-projects" className="mt-6">
                    <SharedProjectsContent />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}