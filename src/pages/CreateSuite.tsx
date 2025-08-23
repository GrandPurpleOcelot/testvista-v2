import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  X, 
  ArrowLeft,
  Sparkles,
  Target,
  Zap,
  Plus,
  Check,
  BookOpen
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
}

interface ReferenceFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedDate: string;
}

interface StandardFile {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadedDate: string;
}

export default function CreateSuite() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [suiteName, setSuiteName] = useState("");
  const [suiteDescription, setsuiteDescription] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedReferenceFiles, setSelectedReferenceFiles] = useState<string[]>([]);
  const [selectedStandardFiles, setSelectedStandardFiles] = useState<string[]>([]);
  const [aiInstructions, setAiInstructions] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const referenceFiles: ReferenceFile[] = [
    { id: "1", name: "API Documentation.pdf", type: "application/pdf", size: 2048576, uploadedDate: "2024-01-15" },
    { id: "2", name: "User Requirements.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 1024000, uploadedDate: "2024-01-10" },
    { id: "3", name: "Database Schema.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 512000, uploadedDate: "2024-01-08" },
    { id: "4", name: "System Architecture.md", type: "text/markdown", size: 256000, uploadedDate: "2024-01-05" }
  ];

  const standardFiles: StandardFile[] = [
    { id: "1", name: "ISO 29119 Test Standard", type: "application/pdf", category: "Testing Standard", uploadedDate: "2024-01-12" },
    { id: "2", name: "OWASP Security Guidelines", type: "application/pdf", category: "Security", uploadedDate: "2024-01-09" },
    { id: "3", name: "API Testing Best Practices", type: "text/markdown", category: "API", uploadedDate: "2024-01-07" },
    { id: "4", name: "Accessibility WCAG 2.1", type: "application/pdf", category: "Accessibility", uploadedDate: "2024-01-03" }
  ];

  const folders = [
    { id: "1", name: "E-commerce Platform" },
    { id: "2", name: "Mobile App Testing" },
    { id: "3", name: "API Integration" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return;
      }

      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type
      };

      setUploadedFiles(prev => [...prev, newFile]);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleReferenceFile = (fileId: string) => {
    setSelectedReferenceFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleStandardFile = (fileId: string) => {
    setSelectedStandardFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
    if (type.includes("text")) return "📋";
    return "📁";
  };

  const handleCreateSuite = async () => {
    if (!suiteName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a suite name",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Simulate suite creation
    setTimeout(() => {
      toast({
        title: "Suite Created",
        description: `"${suiteName}" has been created successfully`
      });
      
      // Navigate to the new suite workspace
      navigate(`/suite/new-${Date.now()}`);
    }, 2000);
  };

  const aiPromptTemplates = [
    {
      icon: Target,
      title: "Comprehensive Testing",
      description: "Generate complete test coverage including positive, negative, and edge cases"
    },
    {
      icon: Zap,
      title: "Security Focus",
      description: "Emphasize security testing with authentication, authorization, and data protection"
    },
    {
      icon: Sparkles,
      title: "Performance & Load",
      description: "Focus on performance testing, load testing, and system bottlenecks"
    }
  ];

  return (
    <div className="min-h-screen bg-workspace-bg">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-background border-b border-border/50">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/my-space")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Space
          </Button>
          <div>
            <h1 className="font-semibold text-xl">Create New Test Suite</h1>
            <p className="text-sm text-muted-foreground">Upload requirements and let AI generate test cases</p>
          </div>
        </div>

        <Button 
          onClick={handleCreateSuite}
          disabled={!suiteName.trim() || isCreating}
          className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover"
        >
          <Sparkles className="h-4 w-4" />
          {isCreating ? "Creating..." : "Create Suite"}
        </Button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports PDF, Word, Excel, and text files (max 10MB each)
                </p>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Reference Files and Standards Section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reference Files */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reference Files
                  </h4>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-border/50 rounded-lg p-3">
                    {/* Upload New Reference Files Item */}
                    <div 
                      className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded-md cursor-pointer border border-dashed border-border/50"
                      onClick={() => navigate("/reference-files")}
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <Plus className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">📁</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary">Upload New Reference Files</p>
                        <p className="text-xs text-muted-foreground">Add new reference files to your library</p>
                      </div>
                    </div>
                    
                    {/* Existing Reference Files */}
                    {referenceFiles.map((file) => (
                      <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded-md">
                        <Checkbox
                          id={`ref-${file.id}`}
                          checked={selectedReferenceFiles.includes(file.id)}
                          onCheckedChange={() => toggleReferenceFile(file.id)}
                        />
                        <span className="text-sm">{getFileIcon(file.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {file.uploadedDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedReferenceFiles.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3" />
                      {selectedReferenceFiles.length} reference file(s) selected
                    </div>
                  )}
                </div>

                {/* Standards */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Standards
                  </h4>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-border/50 rounded-lg p-3">
                    {/* Upload New Standards Item */}
                    <div 
                      className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded-md cursor-pointer border border-dashed border-border/50"
                      onClick={() => navigate("/standards")}
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <Plus className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">📋</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary">Upload New Standards</p>
                        <p className="text-xs text-muted-foreground">Add new standards to your library</p>
                      </div>
                    </div>
                    
                    {/* Existing Standards */}
                    {standardFiles.map((file) => (
                      <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded-md">
                        <Checkbox
                          id={`std-${file.id}`}
                          checked={selectedStandardFiles.includes(file.id)}
                          onCheckedChange={() => toggleStandardFile(file.id)}
                        />
                        <span className="text-sm">📋</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.category} • {file.uploadedDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedStandardFiles.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3" />
                      {selectedStandardFiles.length} standard(s) selected
                    </div>
                  )}
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-sm">Uploaded Files</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getFileIcon(file.type)}</span>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Suite Information */}
          <Card>
            <CardHeader>
              <CardTitle>Test Suite Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suite-name">Suite Name *</Label>
                  <Input
                    id="suite-name"
                    placeholder="e.g., User Authentication Testing"
                    value={suiteName}
                    onChange={(e) => setSuiteName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="folder-select">Folder</Label>
                  <select
                    id="folder-select"
                    className="w-full h-10 px-3 py-2 text-sm border border-border rounded-md bg-background"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                  >
                    <option value="">Select a folder</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suite-description">Description</Label>
                <Textarea
                  id="suite-description"
                  placeholder="Describe what this test suite will cover..."
                  value={suiteDescription}
                  onChange={(e) => setsuiteDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiPromptTemplates.map((template, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer border-border/50 hover:border-primary/50 transition-colors"
                    onClick={() => setAiInstructions(template.description)}
                  >
                    <CardContent className="p-4 text-center">
                      <template.icon className="h-8 w-8 mx-auto text-primary mb-3" />
                      <h4 className="font-medium text-sm mb-2">{template.title}</h4>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-instructions">Custom Instructions for AI</Label>
                <Textarea
                  id="ai-instructions"
                  placeholder="Tell the AI how you want your test cases generated. For example: 'Focus on edge cases and error handling scenarios. Generate both positive and negative test cases. Include boundary value testing for all input fields.'"
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  The more specific your instructions, the better the AI can tailor the test cases to your needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}