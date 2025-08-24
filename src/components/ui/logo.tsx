import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const iconSize = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const versionSize = {
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Geometric Logo Icon */}
      <div className={cn(iconSize[size], "relative")}>
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
          {/* Main diamond shape */}
          <path 
            d="M16 2 L28 8 L24 16 L16 22 L8 16 L4 8 Z" 
            fill="hsl(var(--primary))" 
            className="opacity-90"
          />
          {/* Inner geometric detail */}
          <path 
            d="M16 6 L22 10 L20 16 L16 18 L12 16 L10 10 Z" 
            fill="hsl(var(--primary))" 
            className="opacity-70"
          />
          {/* Highlight accent */}
          <path 
            d="M16 2 L20 6 L16 10 L12 6 Z" 
            fill="hsl(var(--primary-foreground))" 
            className="opacity-20"
          />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className={cn(
          "font-bold text-foreground",
          textSize[size]
        )}>
          TestVista
        </span>
        <span className={cn(
          "text-muted-foreground font-medium",
          versionSize[size]
        )}>
          Ver 1.3.0
        </span>
      </div>
    </div>
  );
}