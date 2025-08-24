import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between p-6 bg-background border-b border-border/50">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your test folders and suites</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="h-9 w-9 p-0 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
        </Button>

        <Button className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover shadow-sm">
          <Plus className="h-4 w-4" />
          New Folder
        </Button>
      </div>
    </header>
  );
}