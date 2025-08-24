import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar } from "@/components/layout/sidebar";
import { 
  Search, 
  TestTube, 
  Plus, 
  Calendar,
  User,
  Play,
  Settings,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Link } from "react-router-dom";

interface TestSuite {
  id: string;
  name: string;
  description: string;
  project: string;
  folder: string;
  status: "active" | "draft" | "archived";
  testCases: number;
  coverage: number;
  lastRun: string;
  lastModified: string;
  createdBy: string;
  createdAt: string;
}

const mockTestSuites: TestSuite[] = [
  {
    id: "1",
    name: "User Management",
    description: "User account and profile testing",
    project: "Project A",
    folder: "Core Features",
    status: "active",
    testCases: 45,
    coverage: 92,
    lastRun: "2024-01-20",
    lastModified: "2024-01-20",
    createdBy: "You",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Navigation Tests",
    description: "Menu and routing functionality",
    project: "Project A",
    folder: "User Interface",
    status: "active",
    testCases: 28,
    coverage: 98,
    lastRun: "2024-01-19",
    lastModified: "2024-01-19",
    createdBy: "You",
    createdAt: "2024-01-12"
  },
  {
    id: "3",
    name: "Login Flow",
    description: "User authentication process",
    project: "Project B",
    folder: "Authentication",
    status: "active",
    testCases: 32,
    coverage: 96,
    lastRun: "2024-01-18",
    lastModified: "2024-01-18",
    createdBy: "You",
    createdAt: "2024-01-10"
  },
  {
    id: "4",
    name: "Endpoint Validation",
    description: "API endpoint functionality tests",
    project: "Project C",
    folder: "API Testing",
    status: "draft",
    testCases: 20,
    coverage: 45,
    lastRun: "2024-01-05",
    lastModified: "2024-01-05",
    createdBy: "You",
    createdAt: "2024-01-01"
  },
  {
    id: "5",
    name: "Feature Testing",
    description: "Core feature validation",
    project: "Project D",
    folder: "Core Features",
    status: "active",
    testCases: 34,
    coverage: 87,
    lastRun: "2024-01-21",
    lastModified: "2024-01-21",
    createdBy: "John Doe",
    createdAt: "2024-01-14"
  },
  {
    id: "6",
    name: "UI Components",
    description: "Component library testing",
    project: "Project E",
    folder: "User Interface",
    status: "active",
    testCases: 28,
    coverage: 92,
    lastRun: "2024-01-20",
    lastModified: "2024-01-20",
    createdBy: "Emma Davis",
    createdAt: "2024-01-08"
  }
];

export default function TestSuites() {
  const [testSuites] = useState<TestSuite[]>(mockTestSuites);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof TestSuite>("lastModified");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredAndSortedSuites = testSuites
    .filter(suite => {
      const matchesSearch = suite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           suite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           suite.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           suite.folder.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: keyof TestSuite) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof TestSuite) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-3 w-3" />;
      case "draft": return <Clock className="h-3 w-3" />;
      case "archived": return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "text-green-600 dark:text-green-400";
    if (coverage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="flex h-screen bg-workspace-bg">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border/50 bg-background h-20">
          <div className="flex items-start justify-between px-6 py-5">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground leading-tight">Test Suites</h1>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Manage and execute your test suites across all projects
              </p>
            </div>
            
            <Button asChild className="self-start">
              <Link to="/create-suite" className="gap-2">
                <Plus className="h-4 w-4" />
                New Test Suite
              </Link>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search test suites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Test Suites Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Folder</TableHead>
                  <TableHead className="text-center">Test Cases</TableHead>
                  <TableHead className="text-center">Coverage</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("lastModified")}
                  >
                    <div className="flex items-center gap-2">
                      Last Modified
                      {getSortIcon("lastModified")}
                    </div>
                  </TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSuites.map((suite) => (
                  <TableRow key={suite.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{suite.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {suite.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-primary">{suite.project}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{suite.folder}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{suite.testCases}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium ${getCoverageColor(suite.coverage)}`}>
                        {suite.coverage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(suite.lastModified).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{suite.createdBy}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/suite/${suite.id}`}>
                            Open
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedSuites.length === 0 && (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No test suites found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Try adjusting your search"
                  : "Create your first test suite to get started"
                }
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link to="/create-suite">
                    <Plus className="h-4 w-4 mr-2" />
                    New Test Suite
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}