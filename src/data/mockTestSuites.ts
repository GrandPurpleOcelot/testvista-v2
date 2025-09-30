// Mock test suites data for sidebar navigation
export interface TestSuite {
  id: string;
  name: string;
  projectId: string;
  folderId: string;
  testCases: number;
  coverage: number;
  lastActivity: string;
}

export const mockTestSuites: TestSuite[] = [
  // My Space - Personal Projects
  {
    id: "suite-1",
    name: "Core Testing Suite",
    projectId: "my-space",
    folderId: "1",
    testCases: 45,
    coverage: 85,
    lastActivity: "2 hours ago"
  },
  {
    id: "suite-2",
    name: "User Interface Tests",
    projectId: "my-space",
    folderId: "1",
    testCases: 32,
    coverage: 78,
    lastActivity: "5 hours ago"
  },
  
  // My Space - Learning & Practice
  {
    id: "suite-3",
    name: "API Testing Practice",
    projectId: "my-space",
    folderId: "2",
    testCases: 18,
    coverage: 65,
    lastActivity: "1 day ago"
  },
  
  // My Space - Security Testing
  {
    id: "suite-4",
    name: "Security Audit Suite",
    projectId: "my-space",
    folderId: "3",
    testCases: 28,
    coverage: 90,
    lastActivity: "3 days ago"
  },
  
  // Project A - Core Features
  {
    id: "suite-5",
    name: "Authentication Tests",
    projectId: "p1",
    folderId: "f1",
    testCases: 25,
    coverage: 92,
    lastActivity: "2 hours ago"
  },
  {
    id: "suite-6",
    name: "Data Processing",
    projectId: "p1",
    folderId: "f1",
    testCases: 34,
    coverage: 88,
    lastActivity: "4 hours ago"
  },
  {
    id: "suite-7",
    name: "Business Logic",
    projectId: "p1",
    folderId: "f1",
    testCases: 42,
    coverage: 85,
    lastActivity: "1 day ago"
  },
  
  // Project A - User Interface
  {
    id: "suite-8",
    name: "Component Tests",
    projectId: "p1",
    folderId: "f2",
    testCases: 28,
    coverage: 90,
    lastActivity: "3 hours ago"
  },
  {
    id: "suite-9",
    name: "Layout & Navigation",
    projectId: "p1",
    folderId: "f2",
    testCases: 15,
    coverage: 82,
    lastActivity: "1 day ago"
  },
  {
    id: "suite-10",
    name: "Form Validation",
    projectId: "p1",
    folderId: "f2",
    testCases: 22,
    coverage: 95,
    lastActivity: "2 days ago"
  },
  
  // Project A - Integration
  {
    id: "suite-11",
    name: "API Integration",
    projectId: "p1",
    folderId: "f3",
    testCases: 38,
    coverage: 87,
    lastActivity: "3 days ago"
  },
  {
    id: "suite-12",
    name: "Third-party Services",
    projectId: "p1",
    folderId: "f3",
    testCases: 19,
    coverage: 76,
    lastActivity: "5 days ago"
  },
  
  // Project D (Shared) - Core System
  {
    id: "suite-13",
    name: "System Health Checks",
    projectId: "sp1",
    folderId: "fd1",
    testCases: 52,
    coverage: 94,
    lastActivity: "1 hour ago"
  },
  {
    id: "suite-14",
    name: "Core Functionality",
    projectId: "sp1",
    folderId: "fd1",
    testCases: 67,
    coverage: 91,
    lastActivity: "2 hours ago"
  },
  {
    id: "suite-15",
    name: "System Integration",
    projectId: "sp1",
    folderId: "fd1",
    testCases: 45,
    coverage: 88,
    lastActivity: "4 hours ago"
  },
  
  // Project D - User Management
  {
    id: "suite-16",
    name: "User Authentication",
    projectId: "sp1",
    folderId: "fd2",
    testCases: 38,
    coverage: 96,
    lastActivity: "2 hours ago"
  },
  {
    id: "suite-17",
    name: "Profile Management",
    projectId: "sp1",
    folderId: "fd2",
    testCases: 29,
    coverage: 89,
    lastActivity: "5 hours ago"
  },
  
  // Project E (Shared) - iOS Testing
  {
    id: "suite-18",
    name: "iOS UI Components",
    projectId: "sp2",
    folderId: "fe1",
    testCases: 42,
    coverage: 93,
    lastActivity: "3 hours ago"
  },
  {
    id: "suite-19",
    name: "iOS Performance",
    projectId: "sp2",
    folderId: "fe1",
    testCases: 31,
    coverage: 87,
    lastActivity: "6 hours ago"
  },
  
  // Project G (Shared) - UI Components
  {
    id: "suite-20",
    name: "Button Components",
    projectId: "sp4",
    folderId: "fg1",
    testCases: 24,
    coverage: 98,
    lastActivity: "5 hours ago"
  },
  {
    id: "suite-21",
    name: "Form Controls",
    projectId: "sp4",
    folderId: "fg1",
    testCases: 35,
    coverage: 92,
    lastActivity: "8 hours ago"
  }
];
