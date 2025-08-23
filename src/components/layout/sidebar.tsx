import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { 
  LayoutDashboard, 
  FolderOpen, 
  TestTube, 
  Settings, 
  Users, 
  BookOpen,
  Plus,
  Bell,
  FileText
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Test Suites", href: "/suites", icon: TestTube },
  { name: "Reference Files", href: "/reference-files", icon: FileText },
  { name: "Standards", href: "/standards", icon: BookOpen },
  { name: "Team", href: "/team", icon: Users },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col h-full bg-workspace-sidebar border-r border-border/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!collapsed && <Logo size="md" />}
        {collapsed && <Logo size="sm" />}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <LayoutDashboard className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* New Test Suite Button */}
        <Button
          variant="outline" 
          className={cn(
            "w-full gap-3 h-10 border-dashed border-primary/50 text-primary hover:bg-primary-light mb-4",
            collapsed && "px-2"
          )}
          asChild
        >
          <Link to="/create-suite">
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>New Test Suite</span>}
          </Link>
        </Button>

        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "px-2",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs"></span>
          </Button>
          {!collapsed && (
            <>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex-1" />
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xs font-medium text-white">JD</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}