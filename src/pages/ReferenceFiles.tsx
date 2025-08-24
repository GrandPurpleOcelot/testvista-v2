import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sidebar } from "@/components/layout/sidebar";
import { 
  Upload, 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  Calendar,
  User,
  ArrowLeft
} from "lucide-react";

interface ReferenceFile {
  id: string;
  name: string;
  type: string;
  category: "system-description" | "design-pattern" | "domain-glossary" | "other";
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  analyzed: boolean;
}

const mockFiles: ReferenceFile[] = [
  {
    id: "1",
    name: "Banking System Architecture.pdf",
    type: "pdf",
    category: "system-description",
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-15",
    size: "2.3 MB",
    analyzed: true
  },
  {
    id: "2", 
    name: "API Design Patterns.docx",
    type: "docx",
    category: "design-pattern",
    uploadedBy: "Jane Smith",
    uploadedAt: "2024-01-12",
    size: "1.8 MB",
    analyzed: true
  },
  {
    id: "3",
    name: "Financial Domain Glossary.xlsx",
    type: "xlsx", 
    category: "domain-glossary",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2024-01-10",
    size: "945 KB",
    analyzed: false
  }
];

const categoryLabels = {
  "system-description": "System Description",
  "design-pattern": "Design Pattern",
  "domain-glossary": "Domain Glossary",
  "other": "Other"
};

export default function ReferenceFiles() {
  const [files] = useState<ReferenceFile[]>(mockFiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Determine which project context we came from
  const fromProject = searchParams.get('from') || 'my-space';
  const getProjectName = (projectId: string) => {
    switch (projectId) {
      case 'my-space': return 'My Space';
      case 'p1': return 'Project A';
      case 'p2': return 'Project B'; 
      case 'p3': return 'Project C';
      case 'p4': return 'Project D';
      default: return 'My Space';
    }
  };
  
  const getBackUrl = () => {
    return `/project/${fromProject}/folders`;
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "system-description": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "design-pattern": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "domain-glossary": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="flex h-screen bg-workspace-bg">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border/50 bg-background">
          <div className="px-6 py-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(getBackUrl())} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to {getProjectName(fromProject)}
              </Button>
              
              <div className="border-l border-border/50 h-6" />
              
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/projects">All Projects</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={getBackUrl()}>{getProjectName(fromProject)}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold">Uploaded Files</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Page Title */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-foreground leading-tight">Reference Files</h1>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Upload and manage system documentation for AI-powered testing insights
                </p>
              </div>
              
              <Button className="gap-2 self-start">
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              <option value="system-description">System Description</option>
              <option value="design-pattern">Design Pattern</option>
              <option value="domain-glossary">Domain Glossary</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Files Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="group relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={file.analyzed ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {file.analyzed ? "Analyzed" : "Pending"}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(file.category)}`}>
                        {categoryLabels[file.category]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-sm font-medium leading-tight">
                      {file.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {file.size} • {file.type.toUpperCase()}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{file.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Upload your first reference file to get started"
                }
              </p>
              {(!searchTerm && selectedCategory === "all") && (
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}