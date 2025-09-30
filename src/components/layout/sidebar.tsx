import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Settings, 
  Users, 
  BookOpen,
  Plus,
  Bell,
  FileText,
  User,
  ChevronDown,
  ChevronRight,
  Share2,
  Folder
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { mockProjects } from "@/data/mockProjects";
import { mockTestSuites } from "@/data/mockTestSuites";

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  children?: NavigationItem[];
  level?: number;
}

// Build navigation from mock data
const buildNavigation = (): NavigationItem[] => {
  const mySpaceProject = mockProjects.find(p => p.id === "my-space");
  const sharedProjects = mockProjects.filter(p => p.type === "shared");
  
  const mySpaceNav: NavigationItem = {
    name: "My Space",
    href: "/project/my-space/folders",
    icon: User,
    level: 1,
    children: mySpaceProject?.folders?.map(folder => ({
      name: folder.name,
      href: "", // Container for suites
      icon: Folder,
      level: 2,
      children: mockTestSuites
        .filter(suite => suite.projectId === "my-space" && suite.folderId === folder.id)
        .map(suite => ({
          name: suite.name,
          href: `/suite/${suite.id}`,
          icon: CheckSquare,
          level: 3
        }))
    })) || []
  };
  
  const sharedProjectsNav: NavigationItem = {
    name: "Shared Projects",
    href: "",
    icon: Share2,
    level: 1,
    children: sharedProjects.map(project => ({
      name: project.name,
      href: `/project/${project.id}/folders`,
      icon: FolderOpen,
      level: 2,
      children: project.folders?.map(folder => ({
        name: folder.name,
        href: "",
        icon: Folder,
        level: 3,
        children: mockTestSuites
          .filter(suite => suite.projectId === project.id && suite.folderId === folder.id)
          .map(suite => ({
            name: suite.name,
            href: `/suite/${suite.id}`,
            icon: CheckSquare,
            level: 4
          }))
      })) || []
    }))
  };
  
  return [
    { 
      name: "All Projects", 
      href: "",
      icon: Users,
      level: 0,
      children: [mySpaceNav, sharedProjectsNav]
    }
  ];
};

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["All Projects", "My Space"]);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const location = useLocation();
  
  useEffect(() => {
    setNavigation(buildNavigation());
  }, []);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    // For leaf items (no children), check exact match or extended path
    if (!item.children || item.children.length === 0) {
      if (!item.href) return false; // Empty href items are never active
      if (location.pathname === item.href) return true;
      // Check for suite workspace
      if (item.href.startsWith("/suite/") && location.pathname === item.href) return true;
      // Check for project folders
      if (item.href.startsWith("/project/") && location.pathname.startsWith(item.href)) return true;
      return false;
    }
    
    // For parent items with children, never highlight them - only highlight leaf items
    return false;
  };
  
  // Auto-expand parent items when child is active
  useEffect(() => {
    const findParentPath = (items: NavigationItem[], targetHref: string, path: string[] = []): string[] | null => {
      for (const item of items) {
        const currentPath = [...path, item.name];
        if (item.href === targetHref) {
          return currentPath;
        }
        if (item.children) {
          const found = findParentPath(item.children, targetHref, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    // Find and expand all parents of active item
    for (const item of navigation) {
      const activePath = findParentPath([item], location.pathname);
      if (activePath) {
        setExpandedItems(prev => {
          const newExpanded = new Set([...prev, ...activePath]);
          return Array.from(newExpanded);
        });
        break;
      }
    }
  }, [location.pathname, navigation]);

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;
    const isLeaf = !hasChildren && item.href;

    // Calculate indentation based on actual level
    const indentClass = level === 0 ? "" : level === 1 ? "ml-4" : level === 2 ? "ml-8" : level === 3 ? "ml-12" : "ml-16";

    return (
      <div key={`${item.name}-${level}`}>
        {hasChildren ? (
          <Button
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 h-9 text-sm",
              collapsed && "px-2",
              !collapsed && indentClass,
              isActive && "bg-primary text-primary-foreground shadow-sm"
            )}
            onClick={() => !collapsed && toggleExpanded(item.name)}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">{item.name}</span>
                {isExpanded ? 
                  <ChevronDown className="h-3 w-3 flex-shrink-0" /> : 
                  <ChevronRight className="h-3 w-3 flex-shrink-0" />
                }
              </>
            )}
          </Button>
        ) : isLeaf ? (
          <Button
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 h-9 text-sm",
              collapsed && "px-2",
              !collapsed && indentClass,
              isActive && "bg-primary text-primary-foreground shadow-sm"
            )}
            asChild
          >
            <Link to={item.href}>
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          </Button>
        ) : null}

        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-workspace-sidebar border-r border-border/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-border/50 p-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && <Logo size="md" />}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 flex-shrink-0",
            collapsed && "mx-auto"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <LayoutDashboard className="h-4 w-4" />
          ) : (
            <LayoutDashboard className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => renderNavigationItem(item, 0))}
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
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium text-foreground">John Doe</span>
                  <span className="text-xs text-muted-foreground">john.doe@example.com</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-xs font-medium text-white">JD</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}