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
  Unlock
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ArtifactsPanelProps {
  requirements: Requirement[];
  viewpoints: Viewpoint[];
  testCases: TestCase[];
  onUpdateRequirement: (id: string, data: Partial<Requirement>) => void;
  onUpdateViewpoint: (id: string, data: Partial<Viewpoint>) => void;
  onUpdateTestCase: (id: string, data: Partial<TestCase>) => void;
  onExport: (format: string) => void;
}

export function ArtifactsPanel({ 
  requirements, 
  viewpoints, 
  testCases, 
  onUpdateRequirement,
  onUpdateViewpoint,
  onUpdateTestCase,
  onExport 
}: ArtifactsPanelProps) {
  const [activeTab, setActiveTab] = useState("requirements");
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (cellId: string, currentValue: string) => {
    setEditingCell(cellId);
    setEditValue(currentValue);
  };

  const saveEdit = (type: string, id: string, field: string) => {
    if (type === "requirement") {
      onUpdateRequirement(id, { [field]: editValue });
    } else if (type === "viewpoint") {
      onUpdateViewpoint(id, { [field]: editValue });
    } else if (type === "testCase") {
      onUpdateTestCase(id, { [field]: editValue });
    }
    setEditingCell(null);
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

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Tab Headers */}
        <div className="border-b border-border/50 bg-card px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-card-foreground">Test Artifacts</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => onExport("csv")}>
                <Download className="h-4 w-4" />
                Export
              </Button>
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
        <TabsContent value="requirements" className="flex-1 m-0 p-4">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50">
                  <TableRow>
                    <TableHead className="w-20">Req ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Priority</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{req.id}</TableCell>
                      <TableCell>
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
                        <Badge className={getPriorityColor(req.priority)}>
                          {req.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewpoints" className="flex-1 m-0 p-4">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50">
                  <TableRow>
                    <TableHead className="w-20">VP ID</TableHead>
                    <TableHead className="w-32">Feature/Area</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead className="w-40">Data Variants</TableHead>
                    <TableHead className="w-32">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewpoints.map((vp) => (
                    <TableRow key={vp.id} className="hover:bg-muted/50">
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
                      <TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testcases" className="flex-1 m-0 p-4">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50">
                  <TableRow>
                    <TableHead className="w-16"></TableHead>
                    <TableHead className="w-20">TC ID</TableHead>
                    <TableHead className="w-64">Title</TableHead>
                    <TableHead>Steps</TableHead>
                    <TableHead className="w-48">Expected Result</TableHead>
                    <TableHead className="w-20">Severity</TableHead>
                    <TableHead className="w-32">Req IDs</TableHead>
                    <TableHead className="w-32">Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((tc) => (
                    <TableRow key={tc.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onUpdateTestCase(tc.id, { locked: !tc.locked })}
                        >
                          {tc.locked ? (
                            <Lock className="h-3 w-3 text-warning" />
                          ) : (
                            <Unlock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{tc.id}</TableCell>
                      <TableCell>
                        <EditableCell
                          value={tc.title}
                          cellId={`tc-${tc.id}-title`}
                          type="testCase"
                          id={tc.id}
                          field="title"
                          multiline
                        />
                      </TableCell>
                      <TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="flex-1 m-0 p-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Coverage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Requirements Coverage</span>
                    <span className="font-bold">{coveragePercentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${coveragePercentage}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-success">{coveredReqs.size}</div>
                      <div className="text-muted-foreground">Covered</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-destructive">{requirements.length - coveredReqs.size}</div>
                      <div className="text-muted-foreground">Uncovered</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{testCases.length}</div>
                      <div className="text-muted-foreground">Test Cases</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coverage Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requirement</TableHead>
                      <TableHead>Covering Test Cases</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requirements.map((req) => {
                      const coveringTCs = testCases.filter(tc => tc.reqIds.includes(req.id));
                      const isCovered = coveringTCs.length > 0;
                      
                      return (
                        <TableRow key={req.id} className={cn(
                          "hover:bg-muted/50",
                          !isCovered && "bg-destructive/5"
                        )}>
                          <TableCell>
                            <div>
                              <span className="font-mono text-xs text-muted-foreground">{req.id}</span>
                              <p className="text-sm">{req.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {coveringTCs.map((tc) => (
                                <Badge key={tc.id} variant="outline" className="text-xs">
                                  {tc.id}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={isCovered ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                              {isCovered ? "Covered" : "Uncovered"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}