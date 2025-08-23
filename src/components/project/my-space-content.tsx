import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreateSuiteModal } from "@/components/ui/create-suite-modal";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  TestTube,
  Users,
  Calendar,
  Target
} from "lucide-react";

interface TestSuite {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  testCases: number;
  coverage: number;
  lastActivity: string;
}

interface Folder {
  id: string;
  name: string;
  description: string;
  suites: TestSuite[];
  lastActivity: string;
  members: number;
}

const mockFolders: Folder[] = [
  {
    id: "1",
    name: "Personal Projects",
    description: "My personal testing projects and experiments",
    lastActivity: "2 hours ago",
    members: 1,
    suites: [
      {
        id: "s1",
        name: "E-commerce Testing",
        description: "Testing suite for checkout flow",
        status: "active",
        testCases: 45,
        coverage: 87,
        lastActivity: "2 hours ago"
      },
      {
        id: "s2",
        name: "Authentication Flow",
        description: "User login and registration tests",
        status: "completed",
        testCases: 23,
        coverage: 95,
        lastActivity: "1 day ago"
      }
    ]
  },
  {
    id: "2",
    name: "Learning & Practice",
    description: "Test suites for learning new techniques",
    lastActivity: "1 week ago",
    members: 1,
    suites: [
      {
        id: "s3",
        name: "API Testing Practice",
        description: "Learning REST API testing",
        status: "draft",
        testCases: 12,
        coverage: 34,
        lastActivity: "1 week ago"
      }
    ]
  }
];

export function MySpaceContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1"]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [selectedFolderName, setSelectedFolderName] = useState<string | undefined>();
  const navigate = useNavigate();

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      case "draft":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCreateSuite = (suiteName: string, folderId?: string) => {
    navigate("/create-suite", { 
      state: { 
        suiteName, 
        folderId, 
        folderName: selectedFolderName 
      } 
    });
    setIsModalOpen(false);
  };

  const openModalForFolder = (folderId?: string, folderName?: string) => {
    setSelectedFolder(folderId);
    setSelectedFolderName(folderName);
    setIsModalOpen(true);
  };

  const filteredFolders = mockFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.suites.some(suite =>
      suite.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search folders and test suites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => openModalForFolder()}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Test Suite
        </Button>
      </div>

      {/* Folders List */}
      <div className="space-y-4">
        {filteredFolders.map((folder) => (
          <Card key={folder.id} className="border-border/50 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {expandedFolders.has(folder.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{folder.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModalForFolder(folder.id, folder.name)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Suite
                </Button>
              </div>
            </CardHeader>

            {expandedFolders.has(folder.id) && (
              <CardContent className="pt-0">
                <div className="space-y-3 ml-11">
                  {folder.suites.map((suite) => (
                    <div
                      key={suite.id}
                      className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/30 hover:border-primary/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/suite/${suite.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <TestTube className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium text-card-foreground">{suite.name}</h4>
                          <p className="text-sm text-muted-foreground">{suite.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(suite.status)} variant="secondary">
                          {suite.status}
                        </Badge>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="h-3 w-3" />
                            {suite.testCases} cases
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Coverage:</span>
                            <Progress value={suite.coverage} className="w-16 h-2" />
                            <span className="text-xs">{suite.coverage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {folder.suites.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <TestTube className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No test suites in this folder yet.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 gap-2"
                        onClick={() => openModalForFolder(folder.id, folder.name)}
                      >
                        <Plus className="h-4 w-4" />
                        Create your first test suite
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {filteredFolders.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No folders found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search query." : "Start by creating your first test suite."}
            </p>
            {!searchQuery && (
              <Button onClick={() => openModalForFolder()} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Test Suite
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateSuiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSuite={handleCreateSuite}
        selectedFolderId={selectedFolder}
        selectedFolderName={selectedFolderName}
      />
    </div>
  );
}