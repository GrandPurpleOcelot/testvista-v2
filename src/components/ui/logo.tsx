import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto", 
    lg: "h-12 w-auto"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-md",
        size === "sm" && "h-6 w-6",
        size === "md" && "h-8 w-8",
        size === "lg" && "h-12 w-12"
      )}>
        <span className={cn(
          "font-bold text-white",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-lg"
        )}>
          TV
        </span>
      </div>
      <span className={cn(
        "font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl"
      )}>
        TestVista
      </span>
    </div>
  );
}