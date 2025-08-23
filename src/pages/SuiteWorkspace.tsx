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

interface TraceabilityLink {
  id: string;
  sourceType: "requirement" | "viewpoint" | "testcase";
  sourceId: string;
  targetType: "requirement" | "viewpoint" | "testcase";
  targetId: string;
  relationship: "covers" | "validates" | "implements" | "derives-from";
  strength: "strong" | "medium" | "weak";
  lastValidated: Date;
  notes?: string;
}

interface ChangeImpact {
  artifactId: string;
  artifactType: "requirement" | "viewpoint" | "testcase";
  impactLevel: "high" | "medium" | "low";
  description: string;
}

interface Requirement {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Parsed" | "Reviewed" | "Approved";
  linkedViewpoints: string[];
  linkedTestCases: string[];
  lastModified: Date;
  changeHistory: Array<{
    timestamp: Date;
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}

interface Viewpoint {
  id: string;
  area: string;
  intent: string;
  dataVariants: string;
  notes: string;
  linkedRequirements: string[];
  linkedTestCases: string[];
  lastModified: Date;
  changeHistory: Array<{
    timestamp: Date;
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}

interface TestCase {
  id: string;
  title: string;
  steps: string;
  expectedResult: string;
  severity: "High" | "Medium" | "Low";
  reqIds: string[];
  viewpointIds: string[];
  tags: string[];
  locked: boolean;
  lastModified: Date;
  changeHistory: Array<{
    timestamp: Date;
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}

// Mock data for demonstration with traceability
const mockRequirements: Requirement[] = [
  {
    id: "R-001",
    description: "User can log in with email and password",
    priority: "High",
    status: "Parsed",
    linkedViewpoints: ["VP-01"],
    linkedTestCases: ["TC-01", "TC-02"],
    lastModified: new Date(),
    changeHistory: []
  },
  {
    id: "R-002", 
    description: "Password reset via email link",
    priority: "Medium",
    status: "Parsed",
    linkedViewpoints: ["VP-02"],
    linkedTestCases: ["TC-03"],
    lastModified: new Date(),
    changeHistory: []
  },
  {
    id: "R-003",
    description: "Multi-factor authentication setup",
    priority: "High",
    status: "Parsed",
    linkedViewpoints: [],
    linkedTestCases: [],
    lastModified: new Date(),
    changeHistory: []
  }
];

const mockViewpoints: Viewpoint[] = [
  {
    id: "VP-01",
    area: "Login",
    intent: "Validate login functionality with various credential combinations",
    dataVariants: "Valid/Invalid credentials, Empty fields, Special characters",
    notes: "Focus on security and error handling",
    linkedRequirements: ["R-001"],
    linkedTestCases: ["TC-01", "TC-02"],
    lastModified: new Date(),
    changeHistory: []
  },
  {
    id: "VP-02",
    area: "Password Reset",
    intent: "Test password reset flow from initiation to completion",
    dataVariants: "Valid/Invalid emails, Expired links, Already used tokens",
    notes: "Verify email delivery and link security",
    linkedRequirements: ["R-002"],
    linkedTestCases: ["TC-03"],
    lastModified: new Date(),
    changeHistory: []
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
    viewpointIds: ["VP-01"],
    tags: ["positive", "smoke"],
    locked: false,
    lastModified: new Date(),
    changeHistory: []
  },
  {
    id: "TC-02",
    title: "Invalid password attempt",
    steps: "1. Open login page\n2. Enter valid email\n3. Enter incorrect password\n4. Click Login button",
    expectedResult: "Error message displayed: 'Invalid credentials'",
    severity: "Medium",
    reqIds: ["R-001"],
    viewpointIds: ["VP-01"],
    tags: ["negative", "security"],
    locked: true,
    lastModified: new Date(),
    changeHistory: []
  },
  {
    id: "TC-03",
    title: "Password reset request with valid email",
    steps: "1. Click 'Forgot Password' link\n2. Enter valid email address\n3. Click 'Reset Password' button",
    expectedResult: "Success message shown and reset email sent",
    severity: "High",
    reqIds: ["R-002"],
    viewpointIds: ["VP-02"],
    tags: ["positive", "functional"],
    locked: false,
    lastModified: new Date(),
    changeHistory: []
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
  const [traceabilityLinks, setTraceabilityLinks] = useState<TraceabilityLink[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<{type: string, id: string} | null>(null);
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
          const newTestCases: TestCase[] = [
            {
              id: `TC-${String(testCases.length + 1).padStart(2, '0')}`,
              title: "Login with maximum length email",
              steps: "1. Open login page\n2. Enter 255-character email\n3. Enter valid password\n4. Click Login",
              expectedResult: "System accepts input and processes login",
              severity: "Low" as const,
              reqIds: ["R-001"],
              viewpointIds: ["VP-01"],
              tags: ["boundary", "edge-case"],
              locked: false,
              lastModified: new Date(),
              changeHistory: []
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
          const newViewpoint: Viewpoint = {
            id: `VP-${String(viewpoints.length + 1).padStart(2, '0')}`,
            area: feature.charAt(0).toUpperCase() + feature.slice(1),
            intent: `Comprehensive testing strategy for ${feature} functionality`,
            dataVariants: "Valid inputs, Invalid inputs, Edge cases, Security scenarios",
            notes: "AI-generated viewpoint - review and refine as needed",
            linkedRequirements: [],
            linkedTestCases: [],
            lastModified: new Date(),
            changeHistory: []
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

  const handleUpdateRequirement = (id: string, data: Partial<Requirement>, field?: string, oldValue?: string) => {
    setRequirements(prev => 
      prev.map(req => {
        if (req.id === id) {
          const updated = { 
            ...req, 
            ...data, 
            lastModified: new Date(),
            changeHistory: field && oldValue ? [
              ...req.changeHistory,
              {
                timestamp: new Date(),
                field,
                oldValue,
                newValue: data[field as keyof Requirement] as string
              }
            ] : req.changeHistory
          };
          
          // Trigger impact analysis
          if (field && oldValue !== data[field as keyof Requirement]) {
            analyzeChangeImpact('requirement', id, field);
          }
          
          return updated;
        }
        return req;
      })
    );
  };

  const handleUpdateViewpoint = (id: string, data: Partial<Viewpoint>, field?: string, oldValue?: string) => {
    setViewpoints(prev =>
      prev.map(vp => {
        if (vp.id === id) {
          const updated = { 
            ...vp, 
            ...data, 
            lastModified: new Date(),
            changeHistory: field && oldValue ? [
              ...vp.changeHistory,
              {
                timestamp: new Date(),
                field,
                oldValue,
                newValue: data[field as keyof Viewpoint] as string
              }
            ] : vp.changeHistory
          };
          
          // Trigger impact analysis
          if (field && oldValue !== data[field as keyof Viewpoint]) {
            analyzeChangeImpact('viewpoint', id, field);
          }
          
          return updated;
        }
        return vp;
      })
    );
  };

  const handleUpdateTestCase = (id: string, data: Partial<TestCase>, field?: string, oldValue?: string) => {
    setTestCases(prev =>
      prev.map(tc => {
        if (tc.id === id) {
          const updated = { 
            ...tc, 
            ...data, 
            lastModified: new Date(),
            changeHistory: field && oldValue ? [
              ...tc.changeHistory,
              {
                timestamp: new Date(),
                field,
                oldValue,
                newValue: data[field as keyof TestCase] as string
              }
            ] : tc.changeHistory
          };
          
          // Trigger impact analysis
          if (field && oldValue !== data[field as keyof TestCase]) {
            analyzeChangeImpact('testcase', id, field);
          }
          
          return updated;
        }
        return tc;
      })
    );
  };

  const analyzeChangeImpact = (artifactType: string, artifactId: string, field: string) => {
    // Get related artifacts based on traceability links
    let impactedArtifacts: string[] = [];
    
    if (artifactType === 'requirement') {
      const req = requirements.find(r => r.id === artifactId);
      if (req) {
        impactedArtifacts = [...req.linkedViewpoints, ...req.linkedTestCases];
      }
    } else if (artifactType === 'viewpoint') {
      const vp = viewpoints.find(v => v.id === artifactId);
      if (vp) {
        impactedArtifacts = [...vp.linkedRequirements, ...vp.linkedTestCases];
      }
    } else if (artifactType === 'testcase') {
      const tc = testCases.find(t => t.id === artifactId);
      if (tc) {
        impactedArtifacts = [...tc.reqIds, ...tc.viewpointIds];
      }
    }

    if (impactedArtifacts.length > 0) {
      toast({
        title: "Change Impact Detected",
        description: `Changes to ${artifactId} may affect ${impactedArtifacts.length} related artifact(s)`,
        variant: "default"
      });
    }
  };

  const handleLinkArtifacts = (sourceType: string, sourceId: string, targetType: string, targetId: string) => {
    // Create bidirectional links
    if (sourceType === 'requirement' && targetType === 'viewpoint') {
      handleUpdateRequirement(sourceId, { 
        linkedViewpoints: [...requirements.find(r => r.id === sourceId)?.linkedViewpoints || [], targetId] 
      });
      handleUpdateViewpoint(targetId, { 
        linkedRequirements: [...viewpoints.find(v => v.id === targetId)?.linkedRequirements || [], sourceId] 
      });
    }
    // Add more linking logic for other combinations...
    
    toast({
      title: "Artifacts Linked",
      description: `Successfully linked ${sourceId} to ${targetId}`
    });
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
            onLinkArtifacts={handleLinkArtifacts}
            selectedArtifact={selectedArtifact}
            onSelectArtifact={setSelectedArtifact}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}