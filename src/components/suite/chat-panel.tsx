import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Upload, Zap, Target, Plus, Lightbulb, ArrowUp } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        <h2 className="font-semibold text-card-foreground">AI Test Assistant</h2>
        <p className="text-sm text-muted-foreground">Guide test case generation with natural language</p>
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
      <div className="p-4 border-t border-border/50 bg-card">
        <div className="relative flex items-center gap-2 bg-background border border-border/50 rounded-lg p-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask TestVista..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            disabled={isLoading}
          />
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-medium hover:bg-accent text-muted-foreground"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Chat
            </Button>
            
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}