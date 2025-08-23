import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Target, 
  TestTube, 
  BarChart3, 
  Edit2, 
  Check, 
  X,
  Plus,
  Download,
  Lock,
  Unlock,
  Link2,
  AlertTriangle,
  Maximize2
} from "lucide-react";
import { RelationshipIndicator } from "@/components/ui/relationship-indicator";
import { TraceabilityMatrix } from "@/components/ui/traceability-matrix";
import { FullScreenModal, FullScreenModalContent, FullScreenModalTrigger } from "@/components/ui/full-screen-modal";
import { cn } from "@/lib/utils";

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

interface ArtifactsPanelProps {
  requirements: Requirement[];
  viewpoints: Viewpoint[];
  testCases: TestCase[];
  onUpdateRequirement: (id: string, data: Partial<Requirement>, field?: string, oldValue?: string) => void;
  onUpdateViewpoint: (id: string, data: Partial<Viewpoint>, field?: string, oldValue?: string) => void;
  onUpdateTestCase: (id: string, data: Partial<TestCase>, field?: string, oldValue?: string) => void;
  onLinkArtifacts: (sourceType: string, sourceId: string, targetType: string, targetId: string) => void;
  selectedArtifact: {type: string, id: string} | null;
  onSelectArtifact: (artifact: {type: string, id: string} | null) => void;
  onExport: (format: string) => void;
  isFullScreen?: boolean;
}

export function ArtifactsPanel({ 
  requirements, 
  viewpoints, 
  testCases, 
  onUpdateRequirement,
  onUpdateViewpoint,
  onUpdateTestCase,
  onLinkArtifacts,
  selectedArtifact,
  onSelectArtifact,
  onExport,
  isFullScreen = false
}: ArtifactsPanelProps) {
  const [activeTab, setActiveTab] = useState("requirements");
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (cellId: string, currentValue: string) => {
    setEditingCell(cellId);
    setEditValue(currentValue);
  };

  const saveEdit = (type: string, id: string, field: string) => {
    const oldValue = getCurrentValue(type, id, field);
    
    if (type === "requirement") {
      onUpdateRequirement(id, { [field]: editValue }, field, oldValue);
    } else if (type === "viewpoint") {
      onUpdateViewpoint(id, { [field]: editValue }, field, oldValue);
    } else if (type === "testCase") {
      onUpdateTestCase(id, { [field]: editValue }, field, oldValue);
    }
    setEditingCell(null);
  };

  const getCurrentValue = (type: string, id: string, field: string): string => {
    if (type === "requirement") {
      const req = requirements.find(r => r.id === id);
      return req ? req[field as keyof Requirement] as string : "";
    } else if (type === "viewpoint") {
      const vp = viewpoints.find(v => v.id === id);
      return vp ? vp[field as keyof Viewpoint] as string : "";
    } else if (type === "testCase") {
      const tc = testCases.find(t => t.id === id);
      return tc ? tc[field as keyof TestCase] as string : "";
    }
    return "";
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const EditableCell = ({ 
    value, 
    cellId, 
    type, 
    id, 
    field, 
    multiline = false 
  }: {
    value: string;
    cellId: string;
    type: string;
    id: string;
    field: string;
    multiline?: boolean;
  }) => {
    const isEditing = editingCell === cellId;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 min-w-0">
          {multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[60px] text-xs"
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-xs"
              autoFocus
            />
          )}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => saveEdit(type, id, field)}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={cancelEdit}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="group cursor-pointer min-h-[24px] flex items-center gap-2"
        onClick={() => startEdit(cellId, value)}
      >
        <span className="flex-1 text-xs">{value}</span>
        <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Parsed": return "bg-warning text-warning-foreground";
      case "Reviewed": return "bg-primary text-primary-foreground";
      case "Approved": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Calculate coverage
  const coveredReqs = new Set(testCases.flatMap(tc => tc.reqIds));
  const coveragePercentage = requirements.length > 0 
    ? Math.round((coveredReqs.size / requirements.length) * 100) 
    : 0;

  const renderArtifactsContent = () => (
    <div className="h-full flex flex-col bg-background min-h-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col min-h-0">
        {/* Tab Headers */}
        <div className="border-b border-border/50 bg-card px-4 pt-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-card-foreground">Test Artifacts</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => onExport("csv")}>
                <Download className="h-4 w-4" />
                Export
              </Button>
              {!isFullScreen && (
                <FullScreenModal>
                  <FullScreenModalTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Maximize2 className="h-4 w-4" />
                      Full Screen
                    </Button>
                  </FullScreenModalTrigger>
                  <FullScreenModalContent title="Test Artifacts - Full Screen View">
                    <ArtifactsPanel
                      requirements={requirements}
                      viewpoints={viewpoints}
                      testCases={testCases}
                      onUpdateRequirement={onUpdateRequirement}
                      onUpdateViewpoint={onUpdateViewpoint}
                      onUpdateTestCase={onUpdateTestCase}
                      onLinkArtifacts={onLinkArtifacts}
                      selectedArtifact={selectedArtifact}
                      onSelectArtifact={onSelectArtifact}
                      onExport={onExport}
                      isFullScreen={true}
                    />
                  </FullScreenModalContent>
                </FullScreenModal>
              )}
            </div>
          </div>
          
          <TabsList className="grid w-full grid-cols-4 mb-0">
            <TabsTrigger value="requirements" className="gap-2">
              <FileText className="h-4 w-4" />
              Requirements ({requirements.length})
            </TabsTrigger>
            <TabsTrigger value="viewpoints" className="gap-2">
              <Target className="h-4 w-4" />
              Viewpoints ({viewpoints.length})
            </TabsTrigger>
            <TabsTrigger value="testcases" className="gap-2">
              <TestTube className="h-4 w-4" />
              Test Cases ({testCases.length})
            </TabsTrigger>
            <TabsTrigger value="coverage" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Coverage ({coveragePercentage}%)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="requirements" className="flex-1 m-0 p-4 min-h-0">
          <Card className="h-full flex flex-col min-h-0">
            <CardContent className="p-0 flex-1 min-h-0">
              <div className="h-full max-h-[calc(100vh-300px)] overflow-hidden border rounded-md">
                <div className="h-full overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted/50 z-10">
                      <TableRow>
                        <TableHead className={isFullScreen ? "w-24" : "w-20"}>Req ID</TableHead>
                        <TableHead className={isFullScreen ? "min-w-[400px]" : ""}>Description</TableHead>
                        <TableHead className={isFullScreen ? "w-48" : "w-32"}>Relationships</TableHead>
                        {isFullScreen && <TableHead className="w-40">Last Modified</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {requirements.map((req) => (
                        <TableRow 
                          key={req.id} 
                          className={cn(
                            "hover:bg-muted/50 cursor-pointer",
                            selectedArtifact?.type === "requirement" && selectedArtifact?.id === req.id 
                              ? "bg-primary/10 border-l-4 border-l-primary" 
                              : ""
                          )}
                          onClick={() => onSelectArtifact({ type: "requirement", id: req.id })}
                        >
                          <TableCell className="font-mono text-xs">{req.id}</TableCell>
                          <TableCell className={isFullScreen ? "max-w-[400px]" : ""}>
                            <EditableCell
                              value={req.description}
                              cellId={`req-${req.id}-desc`}
                              type="requirement"
                              id={req.id}
                              field="description"
                              multiline
                            />
                          </TableCell>
                          <TableCell>
                            <RelationshipIndicator
                              artifactType="requirement"
                              artifactId={req.id}
                              linkedViewpoints={req.linkedViewpoints}
                              linkedTestCases={req.linkedTestCases}
                              onShowRelationships={(type, id) => onSelectArtifact({ type, id })}
                            />
                          </TableCell>
                          {isFullScreen && (
                            <TableCell className="text-xs text-muted-foreground">
                              {req.lastModified.toLocaleDateString()}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewpoints" className="flex-1 m-0 p-4 min-h-0">
          <Card className="h-full flex flex-col min-h-0">
            <CardContent className="p-0 flex-1 min-h-0">
              <div className="h-full max-h-[calc(100vh-300px)] overflow-hidden border rounded-md">
                <div className="h-full overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted/50 z-10">
                      <TableRow>
                        <TableHead className={isFullScreen ? "w-24" : "w-20"}>VP ID</TableHead>
                        <TableHead className={isFullScreen ? "w-48" : "w-32"}>Feature/Area</TableHead>
                        <TableHead className={isFullScreen ? "min-w-[300px]" : ""}>Intent</TableHead>
                        <TableHead className={isFullScreen ? "w-60" : "w-40"}>Data Variants</TableHead>
                        <TableHead className={isFullScreen ? "w-48" : "w-32"}>Notes</TableHead>
                        {isFullScreen && <TableHead className="w-48">Relationships</TableHead>}
                        {isFullScreen && <TableHead className="w-40">Last Modified</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewpoints.map((vp) => (
                        <TableRow 
                          key={vp.id} 
                          className={cn(
                            "hover:bg-muted/50 cursor-pointer",
                            selectedArtifact?.type === "viewpoint" && selectedArtifact?.id === vp.id 
                              ? "bg-primary/10 border-l-4 border-l-primary" 
                              : ""
                          )}
                          onClick={() => onSelectArtifact({ type: "viewpoint", id: vp.id })}
                        >
                          <TableCell className="font-mono text-xs">{vp.id}</TableCell>
                          <TableCell>
                            <EditableCell
                              value={vp.area}
                              cellId={`vp-${vp.id}-area`}
                              type="viewpoint"
                              id={vp.id}
                              field="area"
                            />
                          </TableCell>
                          <TableCell className={isFullScreen ? "max-w-[300px]" : ""}>
                            <EditableCell
                              value={vp.intent}
                              cellId={`vp-${vp.id}-intent`}
                              type="viewpoint"
                              id={vp.id}
                              field="intent"
                              multiline
                            />
                          </TableCell>
                          <TableCell>
                            <EditableCell
                              value={vp.dataVariants}
                              cellId={`vp-${vp.id}-variants`}
                              type="viewpoint"
                              id={vp.id}
                              field="dataVariants"
                            />
                          </TableCell>
                          <TableCell>
                            <EditableCell
                              value={vp.notes}
                              cellId={`vp-${vp.id}-notes`}
                              type="viewpoint"
                              id={vp.id}
                              field="notes"
                            />
                          </TableCell>
                          {isFullScreen && (
                            <TableCell>
                              <RelationshipIndicator
                                artifactType="viewpoint"
                                artifactId={vp.id}
                                linkedViewpoints={[]}
                                linkedTestCases={vp.linkedTestCases}
                                onShowRelationships={(type, id) => onSelectArtifact({ type, id })}
                              />
                            </TableCell>
                          )}
                          {isFullScreen && (
                            <TableCell className="text-xs text-muted-foreground">
                              {vp.lastModified.toLocaleDateString()}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testcases" className="flex-1 m-0 p-4 min-h-0">
          <Card className="h-full flex flex-col min-h-0">
            <CardContent className="p-0 flex-1 min-h-0">
              <div className="h-full max-h-[calc(100vh-300px)] overflow-hidden border rounded-md">
                <div className="h-full overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted/50 z-10">
                      <TableRow>
                        <TableHead className="w-16"></TableHead>
                        <TableHead className={isFullScreen ? "w-24" : "w-20"}>TC ID</TableHead>
                        <TableHead className={isFullScreen ? "w-80" : "w-64"}>Title</TableHead>
                        <TableHead className={isFullScreen ? "min-w-[300px]" : ""}>Steps</TableHead>
                        <TableHead className={isFullScreen ? "w-60" : "w-48"}>Expected Result</TableHead>
                        <TableHead className={isFullScreen ? "w-24" : "w-20"}>Severity</TableHead>
                        <TableHead className={isFullScreen ? "w-40" : "w-32"}>Req IDs</TableHead>
                        <TableHead className={isFullScreen ? "w-40" : "w-32"}>Tags</TableHead>
                        {isFullScreen && <TableHead className="w-40">Last Modified</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testCases.map((tc) => (
                        <TableRow 
                          key={tc.id} 
                          className={cn(
                            "hover:bg-muted/50 cursor-pointer",
                            selectedArtifact?.type === "testcase" && selectedArtifact?.id === tc.id 
                              ? "bg-primary/10 border-l-4 border-l-primary" 
                              : ""
                          )}
                          onClick={() => onSelectArtifact({ type: "testcase", id: tc.id })}
                        >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateTestCase(tc.id, { locked: !tc.locked });
                              }}
                            >
                              {tc.locked ? (
                                <Lock className="h-3 w-3 text-warning" />
                              ) : (
                                <Unlock className="h-3 w-3 text-muted-foreground" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{tc.id}</TableCell>
                          <TableCell className={isFullScreen ? "max-w-[320px]" : ""}>
                            <EditableCell
                              value={tc.title}
                              cellId={`tc-${tc.id}-title`}
                              type="testCase"
                              id={tc.id}
                              field="title"
                              multiline
                            />
                          </TableCell>
                          <TableCell className={isFullScreen ? "max-w-[300px]" : ""}>
                            <EditableCell
                              value={tc.steps}
                              cellId={`tc-${tc.id}-steps`}
                              type="testCase"
                              id={tc.id}
                              field="steps"
                              multiline
                            />
                          </TableCell>
                          <TableCell>
                            <EditableCell
                              value={tc.expectedResult}
                              cellId={`tc-${tc.id}-result`}
                              type="testCase"
                              id={tc.id}
                              field="expectedResult"
                              multiline
                            />
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(tc.severity)}>
                              {tc.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {tc.reqIds.map((reqId) => (
                                <Badge key={reqId} variant="outline" className="text-xs">
                                  {reqId}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {tc.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          {isFullScreen && (
                            <TableCell className="text-xs text-muted-foreground">
                              {tc.lastModified.toLocaleDateString()}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="flex-1 m-0 p-4 min-h-0">
          <div className="h-full max-h-[calc(100vh-300px)] overflow-hidden">
            <TraceabilityMatrix
              requirements={requirements}
              viewpoints={viewpoints}
              testCases={testCases}
              onNavigateToArtifact={(type, id) => {
                onSelectArtifact({ type, id });
                // Switch to appropriate tab
                if (type === "requirement") setActiveTab("requirements");
                else if (type === "viewpoint") setActiveTab("viewpoints");
                else if (type === "testcase") setActiveTab("testcases");
              }}
              showViewpointLayer={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return renderArtifactsContent();
}