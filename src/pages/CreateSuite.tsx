import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  ArrowLeft,
  Plus,
  Send,
  FileText,
  MessageSquare,
  AtSign,
  PaperclipIcon
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  
  const [suiteName, setSuiteName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [mentionedFiles, setMentionedFiles] = useState<string[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Get suite name and folder from URL params
  useEffect(() => {
    const nameParam = searchParams.get('name');
    const folderParam = searchParams.get('folder');
    
    if (nameParam) {
      setSuiteName(decodeURIComponent(nameParam));
    } else {
      // If no name param, redirect back to my-space
      navigate('/my-space');
    }
    
    if (folderParam) {
      // You could fetch folder name from ID here
      setFolderName(folderParam);
    }
  }, [searchParams, navigate]);

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

  const allAvailableFiles = [
    ...referenceFiles.map(f => ({ ...f, category: 'Reference' })),
    ...standardFiles.map(f => ({ ...f, category: f.category }))
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

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setIsCreating(true);
    
    // Simulate AI processing and redirect to suite workspace
    setTimeout(() => {
      toast({
        title: "Suite Created",
        description: `"${suiteName}" has been created successfully`
      });
      navigate(`/suite/new-${Date.now()}`);
    }, 1500);
  };

  const handleCreateSuite = () => {
    handleChatSubmit(); // Use the same logic as chat submit
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  const handleMentionClick = () => {
    setShowMentionDropdown(!showMentionDropdown);
    setChatInput(prev => prev + '@');
  };

  const handleMentionFile = (file: ReferenceFile | StandardFile) => {
    setChatInput(prev => prev.replace(/@$/, `@${file.name} `));
    setMentionedFiles(prev => [...prev, file.id]);
    setShowMentionDropdown(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
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
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen bg-background transition-all duration-200",
        isDragOver && "bg-primary/5"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Simplified Header */}
      <header className="bg-background border-b border-border/50 h-16">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/my-space")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-medium">Creating: {suiteName}</h1>
              {folderName && (
                <p className="text-sm text-muted-foreground">in folder: {folderName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleCreateSuite}
              disabled={!chatInput.trim() || isCreating}
              className="bg-primary hover:bg-primary/90"
            >
              {isCreating ? "Creating..." : "Create Suite"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Centered Chat Interface */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Start creating your test cases</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Describe what you want to test, mention relevant documents, or upload files to get started. 
              Our AI will help you create comprehensive test artifacts.
            </p>
          </div>

          {/* Central Chat Input */}
          <Card className="mb-8 shadow-lg border-primary/20">
            <CardContent className="p-8">
              <div className="relative">
                <div className="flex items-end gap-4 p-6 border-2 rounded-xl bg-gradient-to-br from-background to-muted/20 border-primary/20 focus-within:border-primary/40 transition-all">
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMentionClick}
                      className="h-10 w-10 p-0 hover:bg-primary/10"
                      title="Mention document"
                    >
                      <AtSign className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-10 w-10 p-0 hover:bg-primary/10"
                      title="Upload file"
                    >
                      <PaperclipIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <Textarea
                    ref={chatInputRef}
                    placeholder="Describe your test suite requirements, mention documents with @, or upload files..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-h-[80px] max-h-40 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/60"
                  />
                  
                  <Button
                    onClick={handleChatSubmit}
                    disabled={isCreating || !chatInput.trim()}
                    size="lg"
                    className="h-12 w-12 p-0 bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mention Dropdown */}
                {showMentionDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                    <div className="p-3">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Available Documents</p>
                      {allAvailableFiles.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => handleMentionFile(file)}
                          className="w-full text-left p-3 hover:bg-muted rounded-lg text-sm flex items-center gap-3 transition-colors"
                        >
                          <span className="text-lg">{getFileIcon('type' in file ? file.type : 'text/markdown')}</span>
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{file.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Quick Upload Zone */}
            <Card className="border-dashed border-2 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <CardContent className="p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-medium mb-2">Upload Files</h3>
                <p className="text-sm text-muted-foreground">
                  Add documents, specifications, or reference materials
                </p>
              </CardContent>
            </Card>

            {/* Recent Files Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recent Files
                  {uploadedFiles.length > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {uploadedFiles.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.slice(-3).map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg text-sm">
                      <span>{getFileIcon(file.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFiles.indexOf(file))}
                        className="h-6 w-6 p-0 hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-4">
                    No files uploaded yet. Use the upload area above to add files.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Template Configuration - Collapsed by default */}
          <Card className="border-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-muted-foreground">
                Advanced: Template Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Requirements Template */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements</label>
                  <select className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background">
                    <option value="default">Default Requirements Template</option>
                    <option value="functional">Functional Requirements Template</option>
                    <option value="non-functional">Non-Functional Requirements Template</option>
                    <option value="api">API Requirements Template</option>
                  </select>
                </div>

                {/* Viewpoints Template */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Viewpoints</label>
                  <select className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background">
                    <option value="default">Default Viewpoint Template</option>
                    <option value="user">User Viewpoint Template</option>
                    <option value="system">System Viewpoint Template</option>
                    <option value="security">Security Viewpoint Template</option>
                  </select>
                </div>

                {/* Test Cases Template */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Cases</label>
                  <select className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background">
                    <option value="default">Default Test Case Template</option>
                    <option value="integration">Integration Test Template</option>
                    <option value="unit">Unit Test Template</option>
                    <option value="e2e">End-to-End Test Template</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.ppt,.pptx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-primary/10 border-4 border-dashed border-primary/50 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-lg shadow-lg text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Drop your files here</p>
          </div>
        </div>
      )}
    </div>
  );
}