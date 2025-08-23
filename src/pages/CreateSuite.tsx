import { useState, useRef } from "react";
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
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  
  const [suiteName, setSuiteName] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [mentionedFiles, setMentionedFiles] = useState<string[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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
    if (!chatInput.trim() || !suiteName.trim()) return;
    
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
            <h1 className="text-xl font-medium">Create Test Suite</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-64">
              <Input
                placeholder="Suite name"
                value={suiteName}
                onChange={(e) => setSuiteName(e.target.value)}
                className="h-9"
              />
            </div>
            <Button 
              onClick={handleCreateSuite}
              disabled={!suiteName.trim() || !chatInput.trim() || isCreating}
              className="bg-primary hover:bg-primary/90"
            >
              {isCreating ? "Creating..." : "Create Suite"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout: Chat + File Sidebar */}
      <main className="flex max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        
        {/* Chat Section - 80% */}
        <div className="flex-1 flex flex-col p-6">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Describe Your Test Suite
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tell the AI what you want to test. Use @ to mention documents and + to upload files.
              </p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Welcome Message */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Let's create your test suite</h3>
                  <p className="text-muted-foreground">
                    Describe what you want to test, mention any relevant documents, or upload new files to get started.
                  </p>
                  
                  {/* Quick Start Templates */}
                  <div className="space-y-2 pt-4">
                    <p className="text-sm font-medium">Quick start:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["API testing", "Security testing", "User authentication", "Performance testing"].map((template) => (
                        <Button
                          key={template}
                          variant="outline"
                          size="sm"
                          onClick={() => setChatInput(`I want to create a comprehensive test suite for ${template.toLowerCase()}. `)}
                          className="text-xs"
                        >
                          {template}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="relative">
                <div className="flex items-end gap-3 p-4 border rounded-lg bg-muted/20">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMentionClick}
                      className="h-8 w-8 p-0"
                      title="Mention document"
                    >
                      <AtSign className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 w-8 p-0"
                      title="Upload file"
                    >
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Textarea
                    ref={chatInputRef}
                    placeholder="Describe your test suite requirements, mention documents with @, or upload files with +"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-h-[60px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  
                  <Button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || !suiteName.trim() || isCreating}
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mention Dropdown */}
                {showMentionDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    <div className="p-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Available Documents</p>
                      {allAvailableFiles.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => handleMentionFile(file)}
                          className="w-full text-left p-2 hover:bg-muted rounded text-sm flex items-center gap-2"
                        >
                          <span>{getFileIcon('type' in file ? file.type : 'text/markdown')}</span>
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
        </div>

        {/* File Sidebar - 20% */}
        <div className="w-80 p-6 pl-0">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recent Files
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Recently Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">UPLOADED</h4>
                  {uploadedFiles.slice(-5).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs">
                      <span className="text-sm">{getFileIcon(file.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{file.name}</div>
                        <div className="text-muted-foreground">{formatFileSize(file.size)}</div>
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
                  ))}
                </div>
              )}

              {/* Available Files */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">AVAILABLE</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {allAvailableFiles.slice(0, 8).map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleMentionFile(file)}
                      className={cn(
                        "w-full text-left p-2 rounded text-xs hover:bg-muted/50 transition-colors",
                        mentionedFiles.includes(file.id) && "bg-primary/10"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getFileIcon('type' in file ? file.type : 'text/markdown')}</span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{file.name}</div>
                          <div className="text-muted-foreground">{file.category}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
                  isDragOver 
                    ? "border-primary bg-primary/10" 
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Drop files here or click to upload</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />
      </main>

      {/* Drag Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-primary/10 border-4 border-dashed border-primary z-50 flex items-center justify-center">
          <div className="bg-background p-8 rounded-lg shadow-lg text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Drop files to upload</p>
            <p className="text-muted-foreground">PDF, Word, Excel, and Text files supported</p>
          </div>
        </div>
      )}
    </div>
  );
}