import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, GitBranch, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VersionAction, ArtifactVersion } from "@/types/version";

interface VersionActionChipsProps {
  latestVersion?: ArtifactVersion;
  onAction: (action: VersionAction) => void;
  className?: string;
}

export function VersionActionChips({ 
  latestVersion, 
  onAction, 
  className 
}: VersionActionChipsProps) {
  if (!latestVersion) return null;

  return (
    <div className={cn("flex items-center gap-2 p-3 bg-muted/50 border rounded-lg animate-in fade-in-0 slide-in-from-bottom-2", className)}>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="h-6">
          <GitBranch className="h-3 w-3 mr-1" />
          Version {latestVersion.versionNumber}
        </Badge>
        <span className="text-sm font-medium">{latestVersion.description}</span>
        <span className="text-xs text-muted-foreground">
          by {latestVersion.author}
        </span>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAction({ type: "view-history" })}
          className="h-7 px-3"
        >
          <Eye className="h-3 w-3 mr-1" />
          View History
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction({ 
            type: "restore", 
            versionId: (latestVersion.versionNumber - 1).toString() 
          })}
          className="h-7 px-3"
          disabled={latestVersion.versionNumber <= 1}
        >
          <Undo2 className="h-3 w-3 mr-1" />
          Revert
        </Button>
      </div>
    </div>
  );
}