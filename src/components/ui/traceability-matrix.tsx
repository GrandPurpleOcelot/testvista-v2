import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle2, XCircle, ArrowRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Requirement {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Parsed" | "Reviewed" | "Approved";
  linkedViewpoints: string[];
  linkedTestCases: string[];
}

interface TestCase {
  id: string;
  title: string;
  reqIds: string[];
  viewpointIds: string[];
  severity: "High" | "Medium" | "Low";
}

interface Viewpoint {
  id: string;
  area: string;
  linkedRequirements: string[];
  linkedTestCases: string[];
}

interface TraceabilityMatrixProps {
  requirements: Requirement[];
  viewpoints: Viewpoint[];
  testCases: TestCase[];
  onNavigateToArtifact?: (type: string, id: string) => void;
  showViewpointLayer?: boolean;
}

export function TraceabilityMatrix({
  requirements,
  viewpoints,
  testCases,
  onNavigateToArtifact,
  showViewpointLayer = true
}: TraceabilityMatrixProps) {
  const getCoverageStatus = (reqId: string) => {
    const directTestCases = testCases.filter(tc => tc.reqIds.includes(reqId));
    const reqViewpoints = viewpoints.filter(vp => vp.linkedRequirements.includes(reqId));
    const viewpointTestCases = testCases.filter(tc => 
      tc.viewpointIds.some(vpId => reqViewpoints.some(vp => vp.id === vpId))
    );
    
    const totalCoverage = directTestCases.length + viewpointTestCases.length;
    
    if (totalCoverage === 0) return { status: "uncovered", count: 0, color: "bg-destructive/20 text-destructive" };
    if (totalCoverage === 1) return { status: "minimal", count: totalCoverage, color: "bg-warning/20 text-warning" };
    return { status: "covered", count: totalCoverage, color: "bg-success/20 text-success" };
  };

  const getTestCasesByRequirement = (reqId: string) => {
    const directCases = testCases.filter(tc => tc.reqIds.includes(reqId));
    const viaViewpoints = testCases.filter(tc => 
      tc.viewpointIds.some(vpId => 
        viewpoints.some(vp => vp.id === vpId && vp.linkedRequirements.includes(reqId))
      )
    );
    return { direct: directCases, viaViewpoints };
  };

  return (
    <div className="space-y-6">
      {/* Coverage Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Interactive Traceability Matrix
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl">{requirements.length}</div>
              <div className="text-muted-foreground">Requirements</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl">{viewpoints.length}</div>
              <div className="text-muted-foreground">Viewpoints</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl">{testCases.length}</div>
              <div className="text-muted-foreground">Test Cases</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-success">
                {Math.round((requirements.filter(req => getCoverageStatus(req.id).count > 0).length / requirements.length) * 100)}%
              </div>
              <div className="text-muted-foreground">Coverage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Matrix */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50">
              <TableRow>
                <TableHead className="w-24">Req ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">Priority</TableHead>
                {showViewpointLayer && <TableHead className="w-32">Via Viewpoints</TableHead>}
                <TableHead className="w-32">Direct Test Cases</TableHead>
                <TableHead className="w-24">Coverage</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map((req) => {
                const coverage = getCoverageStatus(req.id);
                const testCases = getTestCasesByRequirement(req.id);
                const linkedViewpoints = viewpoints.filter(vp => vp.linkedRequirements.includes(req.id));

                return (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs font-medium">{req.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={req.description}>
                        {req.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {req.priority}
                      </Badge>
                    </TableCell>
                    
                    {showViewpointLayer && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {linkedViewpoints.map((vp) => (
                            <Badge 
                              key={vp.id} 
                              variant="secondary" 
                              className="text-xs cursor-pointer hover:bg-secondary/80"
                              onClick={() => onNavigateToArtifact?.('viewpoint', vp.id)}
                            >
                              {vp.id}
                            </Badge>
                          ))}
                          {testCases.viaViewpoints.map((tc) => (
                            <Badge 
                              key={`${tc.id}-via-vp`} 
                              variant="outline" 
                              className="text-xs cursor-pointer border-primary/50"
                              onClick={() => onNavigateToArtifact?.('testcase', tc.id)}
                            >
                              {tc.id}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {testCases.direct.map((tc) => (
                          <Badge 
                            key={tc.id} 
                            variant="default" 
                            className="text-xs cursor-pointer"
                            onClick={() => onNavigateToArtifact?.('testcase', tc.id)}
                          >
                            {tc.id}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className={cn("px-2 py-1 rounded text-xs font-medium", coverage.color)}>
                        {coverage.status === "uncovered" && <XCircle className="h-3 w-3 inline mr-1" />}
                        {coverage.status !== "uncovered" && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                        {coverage.count}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => onNavigateToArtifact?.('requirement', req.id)}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}