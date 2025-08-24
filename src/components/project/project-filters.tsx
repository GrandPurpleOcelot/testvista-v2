import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  FolderOpen,
  Users,
  Clock,
  Star,
  Plus
} from "lucide-react";
import { ProjectFilter, ProjectSort } from "@/types/project";

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  sortBy: ProjectSort;
  onSortChange: (sort: ProjectSort) => void;
  onCreateProject: () => void;
  totalCount: number;
  filteredCount: number;
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  onCreateProject,
  totalCount,
  filteredCount
}: ProjectFiltersProps) {
  const filterOptions = [
    { value: 'all' as ProjectFilter, label: 'All Projects', icon: FolderOpen },
    { value: 'my-projects' as ProjectFilter, label: 'My Space', icon: FolderOpen },
    { value: 'shared-projects' as ProjectFilter, label: 'Shared Projects', icon: Users }
  ];

  const sortOptions = [
    { value: 'lastActivity' as ProjectSort, label: 'Last Activity' },
    { value: 'name' as ProjectSort, label: 'Name' },
    { value: 'coverage' as ProjectSort, label: 'Coverage' },
    { value: 'testCases' as ProjectSort, label: 'Test Cases' }
  ];

  return (
    <div className="space-y-4">
      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreateProject} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilter === option.value;
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(option.value)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Sort and Results Count */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as ProjectSort)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Badge variant="secondary" className="gap-1">
            {filteredCount} of {totalCount} projects
          </Badge>
        </div>
      </div>
    </div>
  );
}