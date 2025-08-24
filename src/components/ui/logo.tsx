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
      {/* Logo Image */}
      <img 
        src="/lovable-uploads/8f1b7e00-43c6-40df-9a5a-393392e76de0.png"
        alt="TestVista Logo"
        className={cn(iconSize[size], "object-contain")}
      />
      
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