import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TestTube, Eye, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ArtifactSelectionChipsProps {
  onSelectionChange: (selectedArtifacts: string[]) => void;
}

const artifacts = [
  {
    id: "requirements",
    name: "Requirements & Test Cases",
    description: "Functional and non-functional requirements with corresponding test cases",
    icon: TestTube,
    defaultSelected: true,
    disabled: true // Always selected by default
  },
  {
    id: "viewpoints",
    name: "Viewpoints",
    description: "Different perspectives and stakeholder views on the system",
    icon: Eye,
    defaultSelected: false,
    disabled: false
  },
  {
    id: "scenarios",
    name: "Scenarios",
    description: "User journey and use case scenarios for comprehensive testing",
    icon: Users,
    defaultSelected: false,
    disabled: false
  }
];

export function ArtifactSelectionChips({ onSelectionChange }: ArtifactSelectionChipsProps) {
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>(
    artifacts.filter(a => a.defaultSelected).map(a => a.id)
  );

  const handleArtifactToggle = (artifactId: string) => {
    let newSelection: string[];
    
    if (selectedArtifacts.includes(artifactId)) {
      // Don't allow deselecting if it's disabled (requirements)
      const artifact = artifacts.find(a => a.id === artifactId);
      if (artifact?.disabled) return;
      
      newSelection = selectedArtifacts.filter(id => id !== artifactId);
    } else {
      newSelection = [...selectedArtifacts, artifactId];
    }
    
    setSelectedArtifacts(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className="w-full">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-foreground mb-1">Select artifacts to generate:</h3>
        <p className="text-xs text-muted-foreground">Choose which artifacts you'd like me to generate for your test suite.</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {artifacts.map((artifact) => {
          const Icon = artifact.icon;
          const isSelected = selectedArtifacts.includes(artifact.id);
          
          return (
            <Tooltip key={artifact.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleArtifactToggle(artifact.id)}
                  disabled={artifact.disabled}
                  className={cn(
                    "transition-all duration-200 hover:scale-105",
                    artifact.disabled && "cursor-default"
                  )}
                >
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      isSelected 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "bg-background hover:bg-accent/50 text-muted-foreground hover:text-foreground border-border",
                      artifact.disabled && "opacity-90"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {artifact.name}
                    {artifact.disabled && <span className="text-[10px] ml-1">(Default)</span>}
                  </Badge>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs">{artifact.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}