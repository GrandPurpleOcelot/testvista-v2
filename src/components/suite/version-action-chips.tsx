import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, GitBranch, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { VersionAction } from "@/types/version";

interface VersionActionChipsProps {
  hasUnsavedChanges: boolean;
  onAction: (action: VersionAction) => void;
  className?: string;
}

export function VersionActionChips({ 
  hasUnsavedChanges, 
  onAction, 
  className 
}: VersionActionChipsProps) {
  if (!hasUnsavedChanges) return null;

  return (
    <div className={cn("flex items-center gap-2 p-3 bg-muted/50 border rounded-lg", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Unsaved changes detected</span>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction({ type: "save" })}
          className="h-7 px-3"
        >
          <Save className="h-3 w-3 mr-1" />
          Save as Version
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction({ type: "create-checkpoint" })}
          className="h-7 px-3"
        >
          <GitBranch className="h-3 w-3 mr-1" />
          Create Checkpoint
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAction({ type: "view-history" })}
          className="h-7 px-3"
        >
          <Eye className="h-3 w-3 mr-1" />
          View Changes
        </Button>
      </div>
    </div>
  );
}