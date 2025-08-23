import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  ArrowLeft,
  Plus,
  Check,
  FileText,
  BookOpen,
  Settings2
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
  const [aiTemplate, setAiTemplate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const referenceFiles: ReferenceFile[] = [
    { id: "1", name: "Banking System Architecture.pdf", type: "application/pdf", size: 2411724, uploadedDate: "2024-01-15" },
    { id: "2", name: "API Design Patterns.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 1887436, uploadedDate: "2024-01-12" },
    { id: "3", name: "Financial Domain Glossary.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 967680, uploadedDate: "2024-01-10" }
  ];

  const standardFiles: StandardFile[] = [
    { id: "1", name: "Test Case Prompt Template.md", type: "text/markdown", category: "Test Case", uploadedDate: "2024-01-15" },
    { id: "2", name: "Domain Common Viewpoint.md", type: "text/markdown", category: "Viewpoint", uploadedDate: "2024-01-12" },
    { id: "3", name: "Requirement Analysis Template.md", type: "text/markdown", category: "Requirement", uploadedDate: "2024-01-10" }
  ];

  const folders = [
    { id: "1", name: "E-commerce Platform" },
    { id: "2", name: "Mobile App Testing" },
    { id: "3", name: "API Integration" }
  ];

  const aiTemplates = [
    { value: "comprehensive", label: "Comprehensive Testing", description: "Complete test coverage including positive, negative, and edge cases" },
    { value: "security", label: "Security Focus", description: "Security testing with authentication, authorization, and data protection" },
    { value: "performance", label: "Performance & Load", description: "Performance testing, load testing, and system bottlenecks" }
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

  const handleTemplateChange = (template: string) => {
    setAiTemplate(template);
    const selectedTemplate = aiTemplates.find(t => t.value === template);
    if (selectedTemplate) {
      setAiInstructions(selectedTemplate.description);
    }
  };

  return (
    <div className="min-h-screen bg-workspace-bg">
      {/* Clean Header */}
      <header className="bg-background border-b border-border/50 h-16">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/my-space")}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-medium">Create Test Suite</h1>
          </div>

          <Button 
            onClick={handleCreateSuite}
            disabled={!suiteName.trim() || isCreating}
            className="bg-primary hover:bg-primary/90"
          >
            {isCreating ? "Creating..." : "Create Suite"}
          </Button>
        </div>
      </header>

      {/* Main Content with Clear Sections */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* 1. Essential Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Essential Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="suite-name" className="text-base font-medium">Suite Name *</Label>
              <Input
                id="suite-name"
                placeholder="e.g., User Authentication Testing"
                value={suiteName}
                onChange={(e) => setSuiteName(e.target.value)}
                className="text-base h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. File Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Files & Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto text-primary group-hover:scale-110 transition-transform mb-4" />
              <p className="text-base font-medium mb-2">Upload New Files</p>
              <p className="text-sm text-muted-foreground">
                Click to browse or drag & drop • PDF, Word, Excel, Text files (max 10MB)
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Recently Uploaded</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getFileIcon(file.type)}</span>
                        <div>
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground block">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Library Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Reference Files */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Reference Files
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/reference-files")}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
                
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto bg-muted/20">
                  <div className="space-y-2">
                    {referenceFiles.map((file) => (
                      <label key={file.id} className="flex items-start space-x-3 p-2 hover:bg-background/80 rounded cursor-pointer transition-colors">
                        <Checkbox
                          checked={selectedReferenceFiles.includes(file.id)}
                          onCheckedChange={() => toggleReferenceFile(file.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {selectedReferenceFiles.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 px-3 py-2 rounded">
                    <Check className="h-4 w-4 text-primary" />
                    {selectedReferenceFiles.length} file{selectedReferenceFiles.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>

              {/* Standards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Standards
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/standards")}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
                
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto bg-muted/20">
                  <div className="space-y-2">
                    {standardFiles.map((file) => (
                      <label key={file.id} className="flex items-start space-x-3 p-2 hover:bg-background/80 rounded cursor-pointer transition-colors">
                        <Checkbox
                          checked={selectedStandardFiles.includes(file.id)}
                          onCheckedChange={() => toggleStandardFile(file.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{file.category}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {selectedStandardFiles.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 px-3 py-2 rounded">
                    <Check className="h-4 w-4 text-primary" />
                    {selectedStandardFiles.length} standard{selectedStandardFiles.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Optional Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optional Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="suite-description" className="text-base font-medium">Description</Label>
              <Textarea
                id="suite-description"
                placeholder="Describe what this test suite will cover and its objectives..."
                value={suiteDescription}
                onChange={(e) => setsuiteDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="folder-select" className="text-base font-medium">Folder</Label>
              <select
                id="folder-select"
                className="w-full h-11 px-3 text-base rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
              >
                <option value="">Select a folder (optional)</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 4. AI Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="ai-template" className="text-base font-medium">Template</Label>
              <select
                id="ai-template"
                className="w-full h-11 px-3 text-base rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                value={aiTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="">Choose a template or write custom instructions</option>
                {aiTemplates.map(template => (
                  <option key={template.value} value={template.value}>{template.label}</option>
                ))}
              </select>
              {aiTemplate && (
                <p className="text-sm text-muted-foreground">
                  {aiTemplates.find(t => t.value === aiTemplate)?.description}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="ai-instructions" className="text-base font-medium">Custom Instructions</Label>
              <Textarea
                id="ai-instructions"
                placeholder="Tell the AI how you want your test cases generated. Be specific about testing approaches, edge cases, or particular focus areas..."
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}