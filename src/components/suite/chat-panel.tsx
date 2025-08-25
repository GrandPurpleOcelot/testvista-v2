import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Upload, Zap, Target, Plus, Lightbulb, ArrowUp, AtSign, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  type?: "command" | "normal";
}

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading?: boolean;
}

const slashCommands = [
  { cmd: "/upload", desc: "Upload requirements document", icon: Upload },
  { cmd: "/sample", desc: "Generate sample test cases", icon: Zap },
  { cmd: "/viewpoints", desc: "Create testing viewpoints", icon: Target },
  { cmd: "/export", desc: "Export test cases", icon: Send },
];

export function ChatPanel({ onSendMessage, messages, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [isChatMode, setIsChatMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
    setShowCommands(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "56px"; // Reset to minimum height (taller default)
      const maxHeight = 120; // Maximum height in pixels
      const newHeight = Math.min(inputRef.current.scrollHeight, maxHeight);
      inputRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleCommandSelect = (cmd: string) => {
    setInput(cmd + " ");
    setShowCommands(false);
    inputRef.current?.focus();
  };

  const filteredCommands = slashCommands.filter(cmd => 
    input.startsWith("/") && cmd.cmd.includes(input.toLowerCase())
  );

  useEffect(() => {
    setShowCommands(input.startsWith("/") && filteredCommands.length > 0);
  }, [input]);

  return (
    <div className="h-full flex flex-col bg-workspace-chat border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-card-foreground">AI Test Assistant</h2>
            <p className="text-sm text-muted-foreground">Guide test case generation with natural language</p>
          </div>
          
          {/* Tools in header */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Mention"
            >
              <AtSign className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Upload file"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChatMode(!isChatMode)}
              className={cn(
                "h-8 px-3 text-xs font-medium transition-all duration-200 rounded-md",
                isChatMode 
                  ? "bg-primary/10 text-primary hover:bg-primary/15" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              title="Toggle Chat Mode"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p className="text-lg font-medium">Welcome to TestVista</p>
              <p className="text-sm">Start by uploading requirements or asking me to generate test cases</p>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium">Try these commands:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {slashCommands.slice(0, 3).map((cmd) => (
                    <Badge 
                      key={cmd.cmd} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary-light"
                      onClick={() => handleCommandSelect(cmd.cmd)}
                    >
                      {cmd.cmd}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/50 text-card-foreground"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-secondary" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-card border border-border/50 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Command Suggestions */}
      {showCommands && (
        <div className="mx-4 mb-2">
          <Card className="p-2 border-border/50 shadow-md">
            <div className="space-y-1">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.cmd}
                  onClick={() => handleCommandSelect(cmd.cmd)}
                  className="w-full text-left p-2 rounded hover:bg-accent flex items-center gap-3 text-sm"
                >
                  <cmd.icon className="h-4 w-4 text-primary" />
                  <div>
                    <span className="font-medium">{cmd.cmd}</span>
                    <p className="text-xs text-muted-foreground">{cmd.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border/20">
        <div className="relative bg-background/50 border border-border/30 rounded-xl hover:border-border/50 transition-colors duration-200 focus-within:border-primary/50 focus-within:bg-background">
          <div className="flex items-end gap-2 p-3">
            {/* Text input area - now takes full width */}
            <div className="flex-1 min-h-[56px] max-h-[120px]">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ask TestVista anything..."
                className="min-h-[56px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm p-0 placeholder:text-muted-foreground/60"
                disabled={isLoading}
                style={{ height: "56px" }}
              />
            </div>
            
            {/* Send button only */}
            <div className="pb-1">
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                size="sm" 
                className={cn(
                  "h-8 w-8 p-0 rounded-md transition-all duration-200",
                  input.trim() && !isLoading 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}