import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  X, 
  ArrowLeft,
  Plus,
  Check
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

      {/* Clean Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        
        {/* Suite Name - Priority */}
        <div className="space-y-2">
          <Label htmlFor="suite-name" className="text-base font-medium">Suite Name</Label>
          <Input
            id="suite-name"
            placeholder="e.g., User Authentication Testing"
            value={suiteName}
            onChange={(e) => setSuiteName(e.target.value)}
            className="text-base"
          />
        </div>

        {/* File Upload - Simplified */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Files</Label>
          
          {/* Upload Area */}
          <div
            className="border border-muted rounded-lg p-8 text-center hover:bg-muted/20 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Upload files or select from library</p>
            <p className="text-xs text-muted-foreground">
              PDF, Word, Excel, Text files (max 10MB)
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

          {/* File Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Reference Files */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reference Files</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/reference-files")}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="rounded-lg p-2 max-h-32 overflow-y-auto space-y-1 bg-muted/10">
                {referenceFiles.map((file) => (
                  <label key={file.id} className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded cursor-pointer">
                    <Checkbox
                      checked={selectedReferenceFiles.includes(file.id)}
                      onCheckedChange={() => toggleReferenceFile(file.id)}
                    />
                    <span className="text-xs truncate">{file.name}</span>
                  </label>
                ))}
              </div>
              
              {selectedReferenceFiles.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="h-3 w-3" />
                  {selectedReferenceFiles.length} selected
                </div>
              )}
            </div>

            {/* Standards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Standards</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/standards")}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="rounded-lg p-2 max-h-32 overflow-y-auto space-y-1 bg-muted/10">
                {standardFiles.map((file) => (
                  <label key={file.id} className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded cursor-pointer">
                    <Checkbox
                      checked={selectedStandardFiles.includes(file.id)}
                      onCheckedChange={() => toggleStandardFile(file.id)}
                    />
                    <span className="text-xs truncate">{file.name}</span>
                  </label>
                ))}
              </div>
              
              {selectedStandardFiles.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="h-3 w-3" />
                  {selectedStandardFiles.length} selected
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Uploaded Files</span>
              <div className="space-y-1">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getFileIcon(file.type)}</span>
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Optional Fields - Collapsible */}
        <details className="space-y-4">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
            Optional: Description & Folder
          </summary>
          
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="suite-description">Description</Label>
              <Textarea
                id="suite-description"
                placeholder="Describe what this test suite will cover..."
                value={suiteDescription}
                onChange={(e) => setsuiteDescription(e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folder-select">Folder</Label>
                <select
                id="folder-select"
                className="w-full h-9 px-3 text-sm rounded-md bg-muted/10 border-0 focus:ring-1 focus:ring-primary"
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
        </details>

        {/* AI Instructions - Simplified */}
        <div className="space-y-4">
          <Label className="text-base font-medium">AI Instructions</Label>
          
          <div className="space-y-2">
            <Label htmlFor="ai-template" className="text-sm">Template</Label>
            <select
              id="ai-template"
              className="w-full h-9 px-3 text-sm rounded-md bg-muted/10 border-0 focus:ring-1 focus:ring-primary"
              value={aiTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <option value="">Choose a template or write custom instructions</option>
              {aiTemplates.map(template => (
                <option key={template.value} value={template.value}>{template.label}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai-instructions">Custom Instructions</Label>
            <Textarea
              id="ai-instructions"
              placeholder="Tell the AI how you want your test cases generated..."
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </div>

      </main>
    </div>
  );
}