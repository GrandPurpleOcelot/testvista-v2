import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar } from "@/components/layout/sidebar";
import { 
  Search, 
  BookOpen, 
  Plus, 
  Calendar,
  User,
  Edit,
  Eye,
  Trash2,
  FileText,
  Download
} from "lucide-react";

interface StandardTemplate {
  id: string;
  name: string;
  description: string;
  category: "test-case" | "viewpoint" | "requirement" | "coverage" | "other";
  content: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
}

const mockTemplates: StandardTemplate[] = [
  {
    id: "1",
    name: "Test Case Prompt Template.md",
    description: "Standard template for generating comprehensive test cases with steps, expected results, and validation criteria",
    category: "test-case",
    content: `# Test Case Generation Template

## Context
- **Feature/Module**: [Specify the feature or module being tested]
- **User Story**: [Reference to user story or requirement]
- **Test Objective**: [What are we trying to validate]

## Test Case Structure
### Test Case ID: TC-[XXX]
### Title: [Descriptive test case title]
### Priority: [High/Medium/Low]
### Category: [Functional/Non-functional/Integration/etc.]

### Preconditions:
- [List any setup requirements]
- [System state requirements]
- [Data prerequisites]

### Test Steps:
1. [Step 1 - Action to perform]
2. [Step 2 - Action to perform]
3. [Step 3 - Action to perform]

### Expected Results:
- [Expected outcome for each step]
- [Final expected state]
- [Success criteria]

### Test Data:
- [Required test data]
- [Input values]
- [Configuration settings]

## Additional Considerations
- **Edge Cases**: [List edge cases to consider]
- **Negative Scenarios**: [Invalid inputs, error conditions]
- **Performance Criteria**: [If applicable]
- **Security Aspects**: [If applicable]`,
    createdBy: "John Doe",
    createdAt: "2024-01-15",
    lastModified: "2024-01-20",
    tags: ["test-case", "template", "standard"]
  },
  {
    id: "2",
    name: "Domain Common Viewpoint.md", 
    description: "Template for defining common viewpoints across different domains and business contexts",
    category: "viewpoint",
    content: `# Domain Common Viewpoint Template

## Viewpoint Definition
- **Viewpoint ID**: VP-[XXX]
- **Domain**: [Business domain - Banking, E-commerce, Healthcare, etc.]
- **Focus Area**: [Specific area within domain]

## Intent & Purpose
- **Testing Intent**: [What we're trying to achieve]
- **Business Impact**: [Why this viewpoint matters]
- **Risk Mitigation**: [What risks this viewpoint addresses]

## Data Variations
### Valid Data Scenarios:
- [Normal operational data]
- [Boundary conditions]
- [Business rule compliance]

### Invalid Data Scenarios:
- [Format violations]
- [Business rule violations]
- [Security violations]

## Test Conditions
- [Condition 1: Description]
- [Condition 2: Description]
- [Condition 3: Description]

## Domain-Specific Considerations
- [Regulatory requirements]
- [Industry standards]
- [Compliance requirements]
- [Security protocols]`,
    createdBy: "Jane Smith",
    createdAt: "2024-01-12",
    lastModified: "2024-01-18",
    tags: ["viewpoint", "domain", "business"]
  },
  {
    id: "3",
    name: "Requirement Analysis Template.md",
    description: "Template for analyzing and breaking down requirements for test coverage",
    category: "requirement",
    content: `# Requirement Analysis Template

## Requirement Overview
- **Requirement ID**: REQ-[XXX]
- **Source Document**: [Link to original requirement]
- **Priority**: [Must Have/Should Have/Could Have]
- **Complexity**: [Simple/Medium/Complex]

## Functional Breakdown
### Primary Functions:
- [Function 1: Description]
- [Function 2: Description]
- [Function 3: Description]

### Dependencies:
- [System dependencies]
- [Data dependencies]
- [External service dependencies]

## Acceptance Criteria
- [Criteria 1: Specific, measurable condition]
- [Criteria 2: Specific, measurable condition]
- [Criteria 3: Specific, measurable condition]

## Test Coverage Areas
- **Happy Path**: [Normal flow scenarios]
- **Alternative Paths**: [Alternative valid flows]
- **Error Handling**: [Error scenarios to test]
- **Edge Cases**: [Boundary and edge conditions]`,
    createdBy: "Mike Johnson",
    createdAt: "2024-01-10",
    lastModified: "2024-01-16",
    tags: ["requirement", "analysis", "coverage"]
  }
];

const categoryLabels = {
  "test-case": "Test Case",
  "viewpoint": "Viewpoint", 
  "requirement": "Requirement",
  "coverage": "Coverage",
  "other": "Other"
};

export default function Standards() {
  const [templates, setTemplates] = useState<StandardTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<StandardTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "other" as StandardTemplate["category"],
    content: ""
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "test-case": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "viewpoint": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "requirement": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "coverage": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      const template: StandardTemplate = {
        id: Date.now().toString(),
        ...newTemplate,
        name: newTemplate.name.endsWith('.md') ? newTemplate.name : `${newTemplate.name}.md`,
        createdBy: "Current User",
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        tags: []
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: "", description: "", category: "other", content: "" });
      setIsCreateDialogOpen(false);
    }
  };

  const handleViewTemplate = (template: StandardTemplate) => {
    setSelectedTemplate(template);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Standards</h1>
              <p className="text-sm text-muted-foreground">
                Manage prompt templates and standardized documentation
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Create a new prompt template for standardized documentation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Template Name</label>
                    <Input
                      placeholder="e.g., API Testing Template.md"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      placeholder="Brief description of the template purpose"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value as StandardTemplate["category"]})}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="test-case">Test Case</option>
                      <option value="viewpoint">Viewpoint</option>
                      <option value="requirement">Requirement</option>
                      <option value="coverage">Coverage</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Template Content (Markdown)</label>
                    <Textarea
                      placeholder="Enter your template content in Markdown format..."
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                      className="min-h-[300px] font-mono"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Create Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              <option value="test-case">Test Case</option>
              <option value="viewpoint">Viewpoint</option>
              <option value="requirement">Requirement</option>
              <option value="coverage">Coverage</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                      {categoryLabels[template.category]}
                    </Badge>
                  </div>
                  
                  <div>
                    <CardTitle className="text-sm font-medium leading-tight">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{template.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Modified: {new Date(template.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewTemplate(template)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Create your first template to get started"
                }
              </p>
              {(!searchTerm && selectedCategory === "all") && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* View Template Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge className={`${getCategoryColor(selectedTemplate.category)}`}>
                  {categoryLabels[selectedTemplate.category]}
                </Badge>
                <span>Created by {selectedTemplate.createdBy}</span>
                <span>Last modified: {new Date(selectedTemplate.lastModified).toLocaleDateString()}</span>
              </div>
              <div className="border rounded-md p-4 bg-muted/50">
                <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                  {selectedTemplate.content}
                </pre>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}