import { useState, useEffect } from "react";
import { ChatPanel } from "@/components/suite/chat-panel";
import { ArtifactsPanel } from "@/components/suite/artifacts-panel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  type?: "command" | "normal";
}

interface Requirement {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Parsed" | "Reviewed" | "Approved";
}

interface Viewpoint {
  id: string;
  area: string;
  intent: string;
  dataVariants: string;
  notes: string;
}

interface TestCase {
  id: string;
  title: string;
  steps: string;
  expectedResult: string;
  severity: "High" | "Medium" | "Low";
  reqIds: string[];
  tags: string[];
  locked: boolean;
}

// Mock data for demonstration
const mockRequirements: Requirement[] = [
  {
    id: "R-001",
    description: "User can log in with email and password",
    priority: "High",
    status: "Parsed"
  },
  {
    id: "R-002", 
    description: "Password reset via email link",
    priority: "Medium",
    status: "Parsed"
  },
  {
    id: "R-003",
    description: "Multi-factor authentication setup",
    priority: "High",
    status: "Parsed"
  }
];

const mockViewpoints: Viewpoint[] = [
  {
    id: "VP-01",
    area: "Login",
    intent: "Validate login functionality with various credential combinations",
    dataVariants: "Valid/Invalid credentials, Empty fields, Special characters",
    notes: "Focus on security and error handling"
  },
  {
    id: "VP-02",
    area: "Password Reset",
    intent: "Test password reset flow from initiation to completion",
    dataVariants: "Valid/Invalid emails, Expired links, Already used tokens",
    notes: "Verify email delivery and link security"
  }
];

const mockTestCases: TestCase[] = [
  {
    id: "TC-01",
    title: "Valid login with email and password",
    steps: "1. Open login page\n2. Enter valid email\n3. Enter valid password\n4. Click Login button",
    expectedResult: "User is logged in and redirected to dashboard",
    severity: "High",
    reqIds: ["R-001"],
    tags: ["positive", "smoke"],
    locked: false
  },
  {
    id: "TC-02",
    title: "Invalid password attempt",
    steps: "1. Open login page\n2. Enter valid email\n3. Enter incorrect password\n4. Click Login button",
    expectedResult: "Error message displayed: 'Invalid credentials'",
    severity: "Medium",
    reqIds: ["R-001"],
    tags: ["negative", "security"],
    locked: true
  },
  {
    id: "TC-03",
    title: "Password reset request with valid email",
    steps: "1. Click 'Forgot Password' link\n2. Enter valid email address\n3. Click 'Reset Password' button",
    expectedResult: "Success message shown and reset email sent",
    severity: "High",
    reqIds: ["R-002"],
    tags: ["positive", "functional"],
    locked: false
  }
];

export default function SuiteWorkspace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [viewpoints, setViewpoints] = useState<Viewpoint[]>(mockViewpoints);
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [suiteStatus, setSuiteStatus] = useState<"idle" | "running" | "paused">("idle");

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "ai",
        content: "Welcome to your test suite workspace! I've loaded some sample requirements and test cases to get you started.\n\nTry these commands:\n• `/sample 5` - Generate 5 sample test cases\n• `/viewpoints login` - Create viewpoints for login feature\n• `/upload` - Upload requirements document\n• `/export testrail` - Export to TestRail format",
        timestamp: new Date(),
        type: "normal"
      }
    ]);
  }, []);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
      type: message.startsWith("/") ? "command" : "normal"
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = "";
      
      if (message.startsWith("/sample")) {
        const count = message.split(" ")[1] || "3";
        aiResponse = `Generating ${count} sample test cases based on your requirements...`;
        
        // Simulate adding new test cases
        setTimeout(() => {
          const newTestCases = [
            {
              id: `TC-${String(testCases.length + 1).padStart(2, '0')}`,
              title: "Login with maximum length email",
              steps: "1. Open login page\n2. Enter 255-character email\n3. Enter valid password\n4. Click Login",
              expectedResult: "System accepts input and processes login",
              severity: "Low" as const,
              reqIds: ["R-001"],
              tags: ["boundary", "edge-case"],
              locked: false
            }
          ];
          setTestCases(prev => [...prev, ...newTestCases]);
          
          toast({
            title: "Test Cases Generated",
            description: `Added ${newTestCases.length} new test cases`
          });
        }, 1500);
        
      } else if (message.startsWith("/viewpoints")) {
        const feature = message.split(" ").slice(1).join(" ") || "authentication";
        aiResponse = `Creating testing viewpoints for ${feature}...`;
        
        setTimeout(() => {
          const newViewpoint = {
            id: `VP-${String(viewpoints.length + 1).padStart(2, '0')}`,
            area: feature.charAt(0).toUpperCase() + feature.slice(1),
            intent: `Comprehensive testing strategy for ${feature} functionality`,
            dataVariants: "Valid inputs, Invalid inputs, Edge cases, Security scenarios",
            notes: "AI-generated viewpoint - review and refine as needed"
          };
          setViewpoints(prev => [...prev, newViewpoint]);
          
          toast({
            title: "Viewpoint Created",
            description: `Added new viewpoint for ${feature}`
          });
        }, 1000);
        
      } else if (message.startsWith("/export")) {
        const format = message.split(" ")[1] || "csv";
        aiResponse = `Preparing export in ${format.toUpperCase()} format...\n\n✅ ${testCases.length} test cases validated\n⚠️ ${requirements.length - new Set(testCases.flatMap(tc => tc.reqIds)).size} uncovered requirements\n\nReady to export!`;
        
      } else if (message.startsWith("/upload")) {
        aiResponse = "Upload functionality will open a file picker to select your requirements document (PDF, Word, or Excel). The AI will parse and extract requirements automatically.";
        
      } else {
        // Handle natural language
        aiResponse = "I understand you want to work on test cases. I can help you:\n\n• Generate test cases for specific features\n• Create testing viewpoints\n• Review coverage gaps\n• Export test cases\n\nWhat would you like to focus on?";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
        type: "normal"
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleUpdateRequirement = (id: string, data: Partial<Requirement>) => {
    setRequirements(prev => 
      prev.map(req => req.id === id ? { ...req, ...data } : req)
    );
  };

  const handleUpdateViewpoint = (id: string, data: Partial<Viewpoint>) => {
    setViewpoints(prev =>
      prev.map(vp => vp.id === id ? { ...vp, ...data } : vp)
    );
  };

  const handleUpdateTestCase = (id: string, data: Partial<TestCase>) => {
    setTestCases(prev =>
      prev.map(tc => tc.id === id ? { ...tc, ...data } : tc)
    );
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${testCases.length} test cases in ${format.toUpperCase()} format`
    });
  };

  const toggleSuiteStatus = () => {
    if (suiteStatus === "idle" || suiteStatus === "paused") {
      setSuiteStatus("running");
      toast({
        title: "Suite Running",
        description: "AI test generation is now active"
      });
    } else {
      setSuiteStatus("paused");
      toast({
        title: "Suite Paused", 
        description: "AI generation paused - you can resume anytime"
      });
    }
  };

  const resetSuite = () => {
    setSuiteStatus("idle");
    setMessages(messages.slice(0, 1)); // Keep welcome message
    toast({
      title: "Suite Reset",
      description: "Workspace reset to initial state"
    });
  };

  return (
    <div className="h-screen flex flex-col bg-workspace-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border/50 h-16">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="font-semibold text-lg">E-commerce Platform Testing</h1>
            <p className="text-sm text-muted-foreground">Suite Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={`text-sm font-medium ${
              suiteStatus === "running" ? "text-success" : 
              suiteStatus === "paused" ? "text-warning" : "text-muted-foreground"
            }`}>
              {suiteStatus.charAt(0).toUpperCase() + suiteStatus.slice(1)}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSuiteStatus}
            className="gap-2"
          >
            {suiteStatus === "running" ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {suiteStatus === "paused" ? "Resume" : "Start"}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetSuite}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/3 min-w-[400px] max-w-[500px] h-full">
          <ChatPanel 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Right Panel - Artifacts */}
        <div className="flex-1 h-full">
          <ArtifactsPanel
            requirements={requirements}
            viewpoints={viewpoints}
            testCases={testCases}
            onUpdateRequirement={handleUpdateRequirement}
            onUpdateViewpoint={handleUpdateViewpoint}
            onUpdateTestCase={handleUpdateTestCase}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}