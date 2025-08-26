import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, ArrowLeft, Plus, ArrowUp, FileText, MessageSquare, AtSign, PaperclipIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
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
  const {
    toast
  } = useToast();
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
  const referenceFiles: ReferenceFile[] = [{
    id: "1",
    name: "Banking System Architecture.pdf",
    type: "application/pdf",
    size: 2411724,
    uploadedDate: "2024-01-15"
  }, {
    id: "2",
    name: "API Design Patterns.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1887436,
    uploadedDate: "2024-01-12"
  }, {
    id: "3",
    name: "Financial Domain Glossary.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 967680,
    uploadedDate: "2024-01-10"
  }];
  const standardFiles: StandardFile[] = [{
    id: "1",
    name: "Test Case Prompt Template.md",
    type: "text/markdown",
    category: "Test Case",
    uploadedDate: "2024-01-15"
  }, {
    id: "2",
    name: "Domain Common Viewpoint.md",
    type: "text/markdown",
    category: "Viewpoint",
    uploadedDate: "2024-01-12"
  }, {
    id: "3",
    name: "Requirement Analysis Template.md",
    type: "text/markdown",
    category: "Requirement",
    uploadedDate: "2024-01-10"
  }];
  const allAvailableFiles = [...referenceFiles.map(f => ({
    ...f,
    category: 'Reference'
  })), ...standardFiles.map(f => ({
    ...f,
    category: f.category
  }))];
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
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

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (chatInputRef.current) {
      chatInputRef.current.style.height = "56px"; // Reset to minimum height
      const maxHeight = 120; // Maximum height in pixels
      const newHeight = Math.min(chatInputRef.current.scrollHeight, maxHeight);
      chatInputRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [chatInput]);
  const handleMentionClick = () => {
    setShowMentionDropdown(!showMentionDropdown);
  };

  const handleMentionFile = (file: ReferenceFile | StandardFile) => {
    const mentionText = `@${file.name}`;
    setChatInput(prev => prev + mentionText + " ");
    setMentionedFiles(prev => [...prev, file.id]);
    setShowMentionDropdown(false);
    chatInputRef.current?.focus();
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
  return <div className={cn("min-h-screen bg-background transition-all duration-200", isDragOver && "bg-primary/5")} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Simplified Header */}
      <header className="bg-background border-b border-border/50 h-16">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/my-space")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-medium">Creating: {suiteName}</h1>
              {folderName && <p className="text-sm text-muted-foreground">in folder: {folderName}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleCreateSuite} disabled={!chatInput.trim() || isCreating} className="bg-primary hover:bg-primary/90">
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
          <TooltipProvider>
            <div className="relative bg-background/50 border border-border/30 rounded-xl hover:border-border/50 transition-colors duration-200 focus-within:border-primary/50 focus-within:bg-background mb-8 shadow-lg">
              <div className="flex flex-col p-4 gap-3">
                {/* Text input area - now on top and full width */}
                <div className="w-full">
                  <Textarea 
                    ref={chatInputRef} 
                    value={chatInput} 
                    onChange={(e) => {
                      setChatInput(e.target.value);
                      adjustTextareaHeight();
                    }} 
                    onKeyPress={handleKeyPress} 
                    placeholder="Describe your test suite requirements, mention documents with @, or upload files..." 
                    className="min-h-[56px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm p-0 placeholder:text-muted-foreground/60 w-full" 
                    disabled={isCreating}
                    style={{ height: "56px" }}
                  />
                </div>

                {/* Tool buttons row - now below text input */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Popover open={showMentionDropdown} onOpenChange={setShowMentionDropdown}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleMentionClick}
                          className="h-8 w-8 p-0 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <AtSign className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-3 bg-background border shadow-md z-50" align="start" side="bottom">
                        <div className="space-y-3">
                          {/* Header with search and upload */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <Input
                                placeholder="Search documents..."
                                className="h-8 text-sm"
                              />
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="h-8 w-8 p-0 hover:bg-accent/50"
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Upload from device</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          {/* Available Documents */}
                          <div className="space-y-1">
                            <div className="text-xs font-medium px-2 py-1 text-muted-foreground">
                              Available Documents
                            </div>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {allAvailableFiles.map((file) => (
                                <button
                                  key={file.id}
                                  onClick={() => handleMentionFile(file)}
                                  className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-accent rounded-md transition-colors text-left"
                                >
                                  <span className="text-base">{getFileIcon('type' in file ? file.type : 'text/markdown')}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="truncate font-medium">{file.name}</div>
                                    <div className="text-xs text-muted-foreground">{file.category}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 w-8 p-0 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <PaperclipIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload Files</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Send button - positioned on the right */}
                  <Button 
                    onClick={handleChatSubmit} 
                    disabled={!chatInput.trim() || isCreating} 
                    size="sm" 
                    className={cn(
                      "h-8 w-8 p-0 rounded-md transition-all duration-200",
                      chatInput.trim() && !isCreating 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                        : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {isCreating ? (
                      <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TooltipProvider>

        </div>
      </main>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.ppt,.pptx" onChange={handleFileUpload} className="hidden" />

      {/* Drag overlay */}
      {isDragOver && <div className="fixed inset-0 bg-primary/10 border-4 border-dashed border-primary/50 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-lg shadow-lg text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Drop your files here</p>
          </div>
        </div>}
    </div>;
}