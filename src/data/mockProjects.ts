import { Project } from "@/types/project";

export const mockProjects: Project[] = [
  // Private projects (My Space)
  {
    id: "p1",
    name: "E-commerce Testing",
    description: "Testing suite for checkout flow",
    type: "private",
    status: "active",
    testSuites: 3,
    testCases: 45,
    coverage: 87,
    lastActivity: "2 hours ago",
    memberCount: 1,
    isFavorite: true,
    tags: ["ecommerce", "checkout"]
  },
  {
    id: "p2",
    name: "Authentication Flow",
    description: "User login and registration tests",
    type: "private",
    status: "completed",
    testSuites: 2,
    testCases: 23,
    coverage: 95,
    lastActivity: "1 day ago",
    memberCount: 1,
    tags: ["auth", "security"]
  },
  {
    id: "p3",
    name: "API Testing Practice",
    description: "Learning REST API testing",
    type: "private",
    status: "draft",
    testSuites: 1,
    testCases: 12,
    coverage: 34,
    lastActivity: "1 week ago",
    memberCount: 1,
    tags: ["api", "learning"]
  },
  
  // Shared projects
  {
    id: "sp1",
    name: "E-commerce Platform",
    description: "Comprehensive testing for the main e-commerce application",
    type: "shared",
    role: "admin",
    status: "active",
    testSuites: 15,
    testCases: 342,
    coverage: 87,
    lastActivity: "1 hour ago",
    memberCount: 8,
    isFavorite: true,
    owner: {
      name: "Sarah Chen",
      initials: "SC"
    },
    members: [
      { name: "John Doe", initials: "JD", role: "collaborator" },
      { name: "Mike Johnson", initials: "MJ", role: "viewer" },
      { name: "Lisa Wang", initials: "LW", role: "collaborator" }
    ],
    tags: ["ecommerce", "production"]
  },
  {
    id: "sp2",
    name: "Mobile App Testing",
    description: "Cross-platform mobile application testing suite",
    type: "shared",
    role: "collaborator",
    status: "active",
    testSuites: 8,
    testCases: 156,
    coverage: 92,
    lastActivity: "3 hours ago",
    memberCount: 5,
    owner: {
      name: "Alex Kumar",
      initials: "AK"
    },
    members: [
      { name: "Emma Davis", initials: "ED", role: "admin" },
      { name: "Tom Wilson", initials: "TW", role: "collaborator" }
    ],
    tags: ["mobile", "cross-platform"]
  },
  {
    id: "sp3",
    name: "API Integration Tests",
    description: "Testing suite for microservices and API endpoints",
    type: "shared",
    role: "viewer",
    status: "completed",
    testSuites: 22,
    testCases: 445,
    coverage: 95,
    lastActivity: "2 days ago",
    memberCount: 12,
    owner: {
      name: "David Rodriguez",
      initials: "DR"
    },
    members: [
      { name: "Anna Lee", initials: "AL", role: "admin" },
      { name: "Chris Brown", initials: "CB", role: "collaborator" }
    ],
    tags: ["api", "microservices"]
  },
  {
    id: "sp4",
    name: "UI Component Library",
    description: "Testing suite for reusable UI components",
    type: "shared",
    role: "owner",
    status: "active",
    testSuites: 12,
    testCases: 89,
    coverage: 78,
    lastActivity: "5 hours ago",
    memberCount: 6,
    isFavorite: true,
    owner: {
      name: "You",
      initials: "YU"
    },
    members: [
      { name: "Maria Garcia", initials: "MG", role: "admin" },
      { name: "James Wilson", initials: "JW", role: "collaborator" },
      { name: "Sophie Chen", initials: "SC", role: "viewer" }
    ],
    tags: ["ui", "components", "library"]
  }
];

// Recent activity across all projects
export const recentActivity = [
  {
    projectId: "sp1",
    projectName: "E-commerce Platform",
    user: "John Doe",
    action: "completed test case 'Payment Flow Validation'",
    timestamp: "1 hour ago"
  },
  {
    projectId: "p1",
    projectName: "E-commerce Testing",
    user: "You",
    action: "updated test suite 'Checkout Process'",
    timestamp: "2 hours ago"
  },
  {
    projectId: "sp2",
    projectName: "Mobile App Testing",
    user: "Emma Davis",
    action: "added new test case 'Biometric Authentication'",
    timestamp: "3 hours ago"
  },
  {
    projectId: "sp4",
    projectName: "UI Component Library",
    user: "Maria Garcia",
    action: "reviewed and approved test results",
    timestamp: "4 hours ago"
  }
];

// Project recommendations based on activity and similarities
export const projectRecommendations = [
  {
    id: "rec1",
    type: "continue",
    title: "Continue working on E-commerce Testing",
    description: "You have 3 pending test cases to review",
    projectId: "p1"
  },
  {
    id: "rec2",
    type: "collaborate",
    title: "Review shared project updates",
    description: "5 new updates in E-commerce Platform",
    projectId: "sp1"
  },
  {
    id: "rec3",
    type: "similar",
    title: "Similar to your API Testing Practice",
    description: "API Integration Tests might interest you",
    projectId: "sp3"
  }
];