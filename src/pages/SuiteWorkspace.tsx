import { useState, useEffect } from "react";
import { ChatPanel } from "@/components/suite/chat-panel";
import { ArtifactsPanel } from "@/components/suite/artifacts-panel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { VersionHistoryModal } from "@/components/suite/version-history-modal";
import { SaveVersionDialog } from "@/components/suite/save-version-dialog";
import { VersionActionChips } from "@/components/suite/version-action-chips";
import { useVersionManager } from "@/hooks/use-version-manager";
import { VersionAction, ArtifactVersion } from "@/types/version";
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  type?: "command" | "normal" | "artifact-selection";
  needsImplementation?: boolean;
  implementationPlan?: string;
  versionInfo?: ArtifactVersion;
  hasModifiedArtifacts?: boolean;
}
interface TraceabilityLink {
  id: string;
  sourceType: "requirement" | "viewpoint" | "testcase";
  sourceId: string;
  targetType: "requirement" | "viewpoint" | "testcase";
  targetId: string;
  relationship: "covers" | "validates" | "implements" | "derives-from";
  strength: "strong" | "medium" | "weak";
  lastValidated: Date;
  notes?: string;
}
interface ChangeImpact {
  artifactId: string;
  artifactType: "requirement" | "viewpoint" | "testcase";
  impactLevel: "high" | "medium" | "low";
  description: string;
}
interface Requirement {
  id: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Parsed" | "Reviewed" | "Approved";
  relationshipStatus?: "New" | "Linked" | "Complete";
  linkedViewpoints: string[];
  linkedTestCases: string[];
  sourceDocument?: string;
  sourceSection?: string;
  extractedContent?: string;
  createdAt?: Date;
  lastModified: Date;
  changeHistory: Array<{
    timestamp: Date;
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}
interface Viewpoint {
  id: string;
  area: string;
  intent: string;
  dataVariants: string;
  notes: string;
  linkedRequirements: string[];
  linkedTestCases: string[];
  lastModified: Date;
  changeHistory: Array<{
    timestamp: Date;
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}
interface TestCase {
  id: string;
  title: string;
  steps: string;
  expectedResult: string;
  severity: "High" | "Medium" | "Low";
  reqIds: string[];
  viewpointIds: string[];
  tags: string[];
  locked: boolean;
  lastModified: Date;
  changeHistory: Array<{
    timestamp: Date;
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}

// Mock data for demonstration with traceability
const mockRequirements: Requirement[] = [{
  id: "R-001",
  description: "User can register with email and password",
  priority: "High",
  status: "Parsed",
  relationshipStatus: "Complete",
  linkedViewpoints: ["VP-01"],
  linkedTestCases: ["TC-01", "TC-02", "TC-03"],
  sourceDocument: "User Requirements Specification v2.1",
  sourceSection: "Section 3.1.1 - User Registration",
  extractedContent: "The system shall allow new users to create an account using a valid email address and a password that meets the security policy requirements. The registration process shall include email verification to confirm account ownership.",
  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-002",
  description: "User can log in with email and password",
  priority: "High",
  status: "Parsed",
  relationshipStatus: "Complete",
  linkedViewpoints: ["VP-01", "VP-02"],
  linkedTestCases: ["TC-04", "TC-05", "TC-06"],
  sourceDocument: "User Requirements Specification v2.1",
  sourceSection: "Section 3.1.2 - User Authentication",
  extractedContent: "Registered users shall be able to authenticate themselves using their email address and password. The system shall provide clear feedback for successful and failed login attempts, including appropriate error messages for various failure scenarios.",
  createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-003",
  description: "Password reset via email link",
  priority: "Medium",
  status: "Parsed",
  linkedViewpoints: ["VP-02"],
  linkedTestCases: ["TC-07", "TC-08"],
  sourceDocument: "Security Requirements Document v1.3",
  sourceSection: "Section 4.2 - Password Recovery",
  extractedContent: "Users who have forgotten their password shall be able to reset it through a secure email-based recovery process. The system shall send a time-limited recovery link to the user's registered email address.",
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-004",
  description: "User can view and edit profile information",
  priority: "Medium",
  status: "Reviewed",
  linkedViewpoints: ["VP-10"],
  linkedTestCases: ["TC-25", "TC-26"],
  sourceDocument: "User Interface Specifications v1.5",
  sourceSection: "Section 2.3 - Profile Management",
  extractedContent: "Authenticated users shall have access to a profile management interface where they can view and modify their personal information including name, email address, phone number, and billing address. Changes shall be validated and saved immediately.",
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-005",
  description: "Products can be searched by keyword, category, and price range",
  priority: "High",
  status: "Approved",
  linkedViewpoints: ["VP-07"],
  linkedTestCases: ["TC-15", "TC-16", "TC-17"],
  sourceDocument: "Product Catalog Requirements v3.0",
  sourceSection: "Section 1.2 - Search Functionality",
  extractedContent: "The product catalog shall provide comprehensive search capabilities allowing users to find products using text keywords, category filters, and price range selections. Search results shall be relevant and properly ranked by relevance and popularity.",
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-006",
  description: "Products can be added to shopping cart",
  priority: "High",
  status: "Approved",
  linkedViewpoints: ["VP-03"],
  linkedTestCases: ["TC-09", "TC-10"],
  sourceDocument: "E-commerce Functional Requirements v2.4",
  sourceSection: "Section 5.1 - Shopping Cart Operations",
  extractedContent: "Users shall be able to add products to their shopping cart from product detail pages or search results. The cart shall maintain product selections across user sessions and provide immediate feedback on cart contents and totals.",
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-007",
  description: "Shopping cart quantities can be modified",
  priority: "Medium",
  status: "Reviewed",
  linkedViewpoints: ["VP-03"],
  linkedTestCases: ["TC-11", "TC-12"],
  sourceDocument: "E-commerce Functional Requirements v2.4",
  sourceSection: "Section 5.2 - Cart Management",
  extractedContent: "Users shall be able to modify product quantities in their shopping cart, including increasing, decreasing, or removing items entirely. The system shall update cart totals and availability in real-time and handle inventory limitations gracefully.",
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-008",
  description: "Guest checkout without account creation",
  priority: "High",
  status: "Approved",
  linkedViewpoints: ["VP-04"],
  linkedTestCases: ["TC-13", "TC-14"],
  sourceDocument: "Business Requirements Document v1.8",
  sourceSection: "Section 3.4 - Guest User Experience",
  extractedContent: "To reduce checkout friction, the system shall allow users to complete purchases without creating an account. Guest users shall provide only essential information required for order fulfillment and payment processing.",
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-009",
  description: "Payment processing with credit cards",
  priority: "High",
  status: "Approved",
  linkedViewpoints: ["VP-05"],
  linkedTestCases: ["TC-18", "TC-19", "TC-20"],
  sourceDocument: "Payment Integration Specification v2.0",
  sourceSection: "Section 2.1 - Credit Card Processing",
  extractedContent: "The system shall integrate with certified payment gateways to process credit card transactions securely. Support shall include major card types (Visa, MasterCard, American Express) with proper validation, encryption, and PCI compliance.",
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-010",
  description: "Order confirmation and tracking",
  priority: "Medium",
  status: "Reviewed",
  linkedViewpoints: ["VP-06"],
  linkedTestCases: ["TC-21", "TC-22"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-011",
  description: "Product reviews and ratings",
  priority: "Low",
  status: "Parsed",
  linkedViewpoints: ["VP-08"],
  linkedTestCases: ["TC-23", "TC-24"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-012",
  description: "Admin can manage product inventory",
  priority: "Medium",
  status: "Parsed",
  linkedViewpoints: ["VP-09"],
  linkedTestCases: [],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-013",
  description: "Multi-factor authentication setup",
  priority: "High",
  status: "Parsed",
  linkedViewpoints: [],
  linkedTestCases: [],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-014",
  description: "Email notifications for order updates",
  priority: "Low",
  status: "Parsed",
  linkedViewpoints: ["VP-06"],
  linkedTestCases: [],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-015",
  description: "Wishlist functionality for registered users",
  priority: "Low",
  status: "Parsed",
  relationshipStatus: "Linked",
  linkedViewpoints: ["VP-10"],
  linkedTestCases: [],
  createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-016",
  description: "Multi-factor authentication for enhanced security",
  priority: "High",
  status: "Parsed",
  relationshipStatus: "New",
  linkedViewpoints: [],
  linkedTestCases: [],
  sourceDocument: "Security Requirements Document v2.0",
  sourceSection: "Section 2.1 - Enhanced Authentication",
  extractedContent: "The system shall support multi-factor authentication (MFA) using SMS, email, or authenticator apps for enhanced user account security. Users should be able to enable/disable MFA from their profile settings.",
  createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago (new)
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "R-017",
  description: "Real-time inventory tracking and notifications",
  priority: "Medium",
  status: "Parsed",
  relationshipStatus: "New",
  linkedViewpoints: [],
  linkedTestCases: [],
  sourceDocument: "Business Requirements Document v2.1",
  sourceSection: "Section 4.3 - Inventory Management",
  extractedContent: "The system shall provide real-time inventory tracking with automatic low-stock notifications to administrators and out-of-stock notifications to customers attempting to purchase unavailable items.",
  createdAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago (new)
  lastModified: new Date(),
  changeHistory: []
}];
const mockViewpoints: Viewpoint[] = [{
  id: "VP-01",
  area: "Authentication",
  intent: "Validate user registration and login flows with various input combinations",
  dataVariants: "Valid/Invalid emails, Strong/Weak passwords, Special characters, Existing/New users",
  notes: "Focus on security, validation, and error handling across all authentication flows",
  linkedRequirements: ["R-001", "R-002"],
  linkedTestCases: ["TC-01", "TC-02", "TC-03", "TC-04", "TC-05", "TC-06"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-02",
  area: "Password Management",
  intent: "Test password reset, change, and recovery flows",
  dataVariants: "Valid/Invalid emails, Expired/Valid tokens, Strong/Weak new passwords",
  notes: "Verify email delivery, link security, and password policy enforcement",
  linkedRequirements: ["R-002", "R-003"],
  linkedTestCases: ["TC-06", "TC-07", "TC-08"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-03",
  area: "Shopping Cart",
  intent: "Validate cart operations including add, remove, modify, and persistence",
  dataVariants: "Different product types, Quantities (1, max, overflow), Guest/Logged users",
  notes: "Test cart state persistence across sessions and browser refreshes",
  linkedRequirements: ["R-006", "R-007"],
  linkedTestCases: ["TC-09", "TC-10", "TC-11", "TC-12"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-04",
  area: "Checkout Process",
  intent: "Test complete checkout flow for both guest and registered users",
  dataVariants: "Guest/Registered users, Different shipping addresses, Various payment methods",
  notes: "Focus on form validation, payment integration, and order confirmation",
  linkedRequirements: ["R-008"],
  linkedTestCases: ["TC-13", "TC-14"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-05",
  area: "Payment Gateway",
  intent: "Validate payment processing with different card types and scenarios",
  dataVariants: "Valid/Invalid cards, Declined transactions, Different card types (Visa, MC, Amex)",
  notes: "Test payment security, error handling, and transaction recording",
  linkedRequirements: ["R-009"],
  linkedTestCases: ["TC-18", "TC-19", "TC-20"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-06",
  area: "Order Management",
  intent: "Test order tracking, status updates, and notification systems",
  dataVariants: "Different order statuses, Email/SMS notifications, Order modifications",
  notes: "Verify order lifecycle management and customer communication",
  linkedRequirements: ["R-010", "R-014"],
  linkedTestCases: ["TC-21", "TC-22"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-07",
  area: "Product Search",
  intent: "Validate search functionality across different criteria and filters",
  dataVariants: "Keywords, Categories, Price ranges, Availability filters, Sort options",
  notes: "Test search accuracy, performance, and filter combinations",
  linkedRequirements: ["R-005"],
  linkedTestCases: ["TC-15", "TC-16", "TC-17"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-08",
  area: "Product Reviews",
  intent: "Test review submission, moderation, and display functionality",
  dataVariants: "Star ratings (1-5), Review text (short/long), Verified/Unverified purchases",
  notes: "Focus on content validation, spam prevention, and display accuracy",
  linkedRequirements: ["R-011"],
  linkedTestCases: ["TC-23", "TC-24"],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-09",
  area: "Admin Operations",
  intent: "Validate administrative functions for product and user management",
  dataVariants: "Different admin roles, Bulk operations, Data validation, Audit trails",
  notes: "Test access controls, data integrity, and operational efficiency",
  linkedRequirements: ["R-012"],
  linkedTestCases: [],
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "VP-10",
  area: "User Profile",
  intent: "Test user profile management and personalization features",
  dataVariants: "Profile updates, Preference settings, Wishlist management, Order history",
  notes: "Validate data persistence, privacy controls, and user experience",
  linkedRequirements: ["R-004", "R-015"],
  linkedTestCases: ["TC-25", "TC-26"],
  lastModified: new Date(),
  changeHistory: []
}];
const mockTestCases: TestCase[] = [{
  id: "TC-01",
  title: "User registration with valid information",
  steps: "1. Navigate to registration page\n2. Enter valid email address\n3. Enter strong password\n4. Confirm password\n5. Accept terms and conditions\n6. Click Register button",
  expectedResult: "Account created successfully, confirmation email sent, user redirected to welcome page",
  severity: "High",
  reqIds: ["R-001"],
  viewpointIds: ["VP-01"],
  tags: ["positive", "smoke", "registration"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-02",
  title: "Registration with already existing email",
  steps: "1. Navigate to registration page\n2. Enter email that already exists\n3. Enter valid password\n4. Click Register button",
  expectedResult: "Error message: 'Email already registered. Please use a different email or login.'",
  severity: "Medium",
  reqIds: ["R-001"],
  viewpointIds: ["VP-01"],
  tags: ["negative", "validation", "registration"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-03",
  title: "Registration with weak password",
  steps: "1. Navigate to registration page\n2. Enter valid email\n3. Enter weak password (e.g., '123')\n4. Click Register button",
  expectedResult: "Error message showing password requirements not met",
  severity: "Medium",
  reqIds: ["R-001"],
  viewpointIds: ["VP-01"],
  tags: ["negative", "security", "validation"],
  locked: true,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-04",
  title: "Valid login with email and password",
  steps: "1. Open login page\n2. Enter valid email\n3. Enter correct password\n4. Click Login button",
  expectedResult: "User is logged in and redirected to dashboard",
  severity: "High",
  reqIds: ["R-002"],
  viewpointIds: ["VP-01", "VP-02"],
  tags: ["positive", "smoke", "login"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-05",
  title: "Login with invalid password",
  steps: "1. Open login page\n2. Enter valid email\n3. Enter incorrect password\n4. Click Login button",
  expectedResult: "Error message: 'Invalid credentials. Please try again.'",
  severity: "High",
  reqIds: ["R-002"],
  viewpointIds: ["VP-01"],
  tags: ["negative", "security", "login"],
  locked: true,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-06",
  title: "Login with non-existent email",
  steps: "1. Open login page\n2. Enter non-existent email\n3. Enter any password\n4. Click Login button",
  expectedResult: "Error message: 'Account not found. Please register first.'",
  severity: "Medium",
  reqIds: ["R-002"],
  viewpointIds: ["VP-01", "VP-02"],
  tags: ["negative", "validation", "login"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-07",
  title: "Password reset with valid email",
  steps: "1. Click 'Forgot Password' link\n2. Enter valid registered email\n3. Click 'Reset Password' button\n4. Check email for reset link",
  expectedResult: "Success message displayed and password reset email sent",
  severity: "High",
  reqIds: ["R-003"],
  viewpointIds: ["VP-02"],
  tags: ["positive", "password-reset"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-08",
  title: "Password reset with invalid email",
  steps: "1. Click 'Forgot Password' link\n2. Enter unregistered email\n3. Click 'Reset Password' button",
  expectedResult: "Error message: 'Email not found in our records'",
  severity: "Medium",
  reqIds: ["R-003"],
  viewpointIds: ["VP-02"],
  tags: ["negative", "validation", "password-reset"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-09",
  title: "Add product to cart",
  steps: "1. Navigate to product page\n2. Select product options (size, color)\n3. Choose quantity\n4. Click 'Add to Cart' button",
  expectedResult: "Product added to cart, cart counter updated, success notification shown",
  severity: "High",
  reqIds: ["R-006"],
  viewpointIds: ["VP-03"],
  tags: ["positive", "cart", "product"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-10",
  title: "Add out-of-stock product to cart",
  steps: "1. Navigate to out-of-stock product page\n2. Attempt to click 'Add to Cart' button",
  expectedResult: "'Add to Cart' button is disabled with 'Out of Stock' message",
  severity: "Medium",
  reqIds: ["R-006"],
  viewpointIds: ["VP-03"],
  tags: ["negative", "inventory", "cart"],
  locked: true,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-11",
  title: "Increase product quantity in cart",
  steps: "1. Open shopping cart\n2. Click '+' button next to product quantity\n3. Verify quantity increase",
  expectedResult: "Quantity increased by 1, subtotal updated, total cart value recalculated",
  severity: "Medium",
  reqIds: ["R-007"],
  viewpointIds: ["VP-03"],
  tags: ["positive", "cart", "quantity"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-12",
  title: "Remove product from cart",
  steps: "1. Open shopping cart\n2. Click 'Remove' button next to product\n3. Confirm removal if prompted",
  expectedResult: "Product removed from cart, cart counter updated, total recalculated",
  severity: "Medium",
  reqIds: ["R-007"],
  viewpointIds: ["VP-03"],
  tags: ["positive", "cart", "removal"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-13",
  title: "Guest checkout with valid information",
  steps: "1. Add products to cart\n2. Proceed to checkout as guest\n3. Fill shipping information\n4. Select payment method\n5. Complete order",
  expectedResult: "Order placed successfully, confirmation email sent, order number provided",
  severity: "High",
  reqIds: ["R-008"],
  viewpointIds: ["VP-04"],
  tags: ["positive", "checkout", "guest"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-14",
  title: "Guest checkout with invalid shipping address",
  steps: "1. Add products to cart\n2. Proceed to checkout as guest\n3. Enter invalid shipping address\n4. Attempt to proceed",
  expectedResult: "Validation errors shown for invalid address fields",
  severity: "Medium",
  reqIds: ["R-008"],
  viewpointIds: ["VP-04"],
  tags: ["negative", "validation", "checkout"],
  locked: true,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-15",
  title: "Search products by keyword",
  steps: "1. Enter search term in search box\n2. Press Enter or click Search button\n3. Review search results",
  expectedResult: "Relevant products displayed based on search term, results paginated if needed",
  severity: "High",
  reqIds: ["R-005"],
  viewpointIds: ["VP-07"],
  tags: ["positive", "search", "keyword"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-16",
  title: "Filter products by price range",
  steps: "1. Navigate to product category\n2. Use price range filter\n3. Apply filter\n4. Review filtered results",
  expectedResult: "Only products within selected price range are displayed",
  severity: "Medium",
  reqIds: ["R-005"],
  viewpointIds: ["VP-07"],
  tags: ["positive", "filter", "price"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-17",
  title: "Search with no results",
  steps: "1. Enter search term that has no matching products\n2. Press Enter or click Search\n3. Review search results page",
  expectedResult: "'No results found' message displayed with suggestions for alternative searches",
  severity: "Low",
  reqIds: ["R-005"],
  viewpointIds: ["VP-07"],
  tags: ["negative", "search", "empty-results"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-18",
  title: "Payment with valid credit card",
  steps: "1. Complete checkout process\n2. Enter valid credit card details\n3. Submit payment\n4. Wait for processing",
  expectedResult: "Payment processed successfully, order confirmed, receipt generated",
  severity: "High",
  reqIds: ["R-009"],
  viewpointIds: ["VP-05"],
  tags: ["positive", "payment", "critical"],
  locked: true,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-19",
  title: "Payment with declined credit card",
  steps: "1. Complete checkout process\n2. Enter credit card that will be declined\n3. Submit payment\n4. Handle decline response",
  expectedResult: "Payment declined message shown, user redirected to payment page to try again",
  severity: "High",
  reqIds: ["R-009"],
  viewpointIds: ["VP-05"],
  tags: ["negative", "payment", "decline"],
  locked: true,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-20",
  title: "Payment with invalid card details",
  steps: "1. Complete checkout process\n2. Enter invalid credit card number\n3. Attempt to submit payment",
  expectedResult: "Validation error shown for invalid card details before submission",
  severity: "Medium",
  reqIds: ["R-009"],
  viewpointIds: ["VP-05"],
  tags: ["negative", "validation", "payment"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-21",
  title: "View order status and tracking",
  steps: "1. Login to account\n2. Navigate to 'My Orders'\n3. Click on specific order\n4. View order details and tracking",
  expectedResult: "Order details displayed with current status and tracking information",
  severity: "Medium",
  reqIds: ["R-010"],
  viewpointIds: ["VP-06"],
  tags: ["positive", "order-tracking"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-22",
  title: "Order status email notification",
  steps: "1. Place an order\n2. Wait for order status change\n3. Check email for notification\n4. Verify notification content",
  expectedResult: "Email notification received with correct order status update and tracking info",
  severity: "Medium",
  reqIds: ["R-010"],
  viewpointIds: ["VP-06"],
  tags: ["positive", "email", "notification"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-23",
  title: "Submit product review with rating",
  steps: "1. Navigate to purchased product page\n2. Click 'Write Review'\n3. Select star rating\n4. Write review text\n5. Submit review",
  expectedResult: "Review submitted successfully, displayed after moderation approval",
  severity: "Low",
  reqIds: ["R-011"],
  viewpointIds: ["VP-08"],
  tags: ["positive", "review", "rating"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-24",
  title: "Submit review without purchase verification",
  steps: "1. Navigate to product page (not purchased)\n2. Attempt to write review\n3. Try to submit review",
  expectedResult: "Message displayed: 'Only verified purchasers can leave reviews'",
  severity: "Low",
  reqIds: ["R-011"],
  viewpointIds: ["VP-08"],
  tags: ["negative", "review", "verification"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-25",
  title: "Update user profile information",
  steps: "1. Login to account\n2. Navigate to Profile settings\n3. Update personal information\n4. Save changes\n5. Verify updates",
  expectedResult: "Profile information updated successfully, changes reflected immediately",
  severity: "Medium",
  reqIds: ["R-004"],
  viewpointIds: ["VP-10"],
  tags: ["positive", "profile", "update"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}, {
  id: "TC-26",
  title: "Add products to wishlist",
  steps: "1. Login to account\n2. Navigate to product page\n3. Click 'Add to Wishlist' button\n4. View wishlist page\n5. Verify product added",
  expectedResult: "Product added to wishlist, wishlist counter updated, product visible in wishlist",
  severity: "Low",
  reqIds: ["R-004"],
  viewpointIds: ["VP-10"],
  tags: ["positive", "wishlist", "save"],
  locked: false,
  lastModified: new Date(),
  changeHistory: []
}];
export default function SuiteWorkspace() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [viewpoints, setViewpoints] = useState<Viewpoint[]>(mockViewpoints);
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [traceabilityLinks, setTraceabilityLinks] = useState<TraceabilityLink[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<{
    type: string;
    id: string;
  } | null>(null);
  const [suiteStatus, setSuiteStatus] = useState<"idle" | "running" | "paused">("idle");
  // Removed chatMode - AI always asks for permission now
  
  // Mock uploaded files
  const uploadedFiles = [
    { id: "file1", name: "requirements-doc.pdf", type: "application/pdf" },
    { id: "file2", name: "user-stories.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { id: "file3", name: "test-plan.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { id: "file4", name: "api-specification.json", type: "application/json" }
  ];
  
  // Version management state
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showSaveVersionDialog, setShowSaveVersionDialog] = useState(false);
  const [saveAsCheckpoint, setSaveAsCheckpoint] = useState(false);
  
  // Initialize version manager
  const versionManager = useVersionManager({
    requirements,
    viewpoints,
    testCases
  });

  // Initialize with context-aware continuation from suite creation
  useEffect(() => {
    setMessages([
      {
        id: "context-acknowledgment",
        role: "ai",
        content: "Perfect! I've received your test suite description and I'm ready to help you generate comprehensive test artifacts. Let me set up your workspace with the initial structure.",
        timestamp: new Date(),
        type: "normal"
      },
      {
        id: "artifact-selection",
        role: "ai",
        content: "Now, let's configure what artifacts you'd like me to generate for your test suite.",
        timestamp: new Date(),
        type: "artifact-selection"
      }
    ]);
  }, []);

  const handleGenerateArtifacts = async (requirementId: string) => {
    const requirement = requirements.find(req => req.id === requirementId);
    if (!requirement) return;

    setIsLoading(true);
    
    // Add AI message indicating generation started
    const generationMessage: Message = {
      id: `generation-${Date.now()}`,
      role: "ai",
      content: `🚀 **Generating Related Artifacts for ${requirementId}**\n\nAnalyzing requirement: "${requirement.description}"\n\nGenerating:\n• Testing viewpoints based on requirement scope\n• Initial test cases for validation\n• Establishing traceability links\n\nThis will take a moment...`,
      timestamp: new Date(),
      type: "normal"
    };
    setMessages(prev => [...prev, generationMessage]);

    // Simulate AI processing time
    setTimeout(() => {
      // Generate new viewpoint
      const newViewpointId = `VP-${String(viewpoints.length + 1).padStart(2, '0')}`;
      const newViewpoint: Viewpoint = {
        id: newViewpointId,
        area: requirement.description.includes('security') || requirement.description.includes('authentication') 
          ? 'Security & Authentication' 
          : requirement.description.includes('inventory') 
          ? 'Data Management' 
          : 'Functional Testing',
        intent: `Validate requirements related to: ${requirement.description}`,
        dataVariants: 'Valid/Invalid inputs, Edge cases, Boundary conditions',
        notes: `Auto-generated viewpoint for requirement ${requirementId}`,
        linkedRequirements: [requirementId],
        linkedTestCases: [],
        lastModified: new Date(),
        changeHistory: []
      };

      // Generate test cases
      const newTestCases: TestCase[] = [];
      for (let i = 0; i < 2; i++) {
        const tcId = `TC-${String(testCases.length + newTestCases.length + 1).padStart(2, '0')}`;
        newTestCases.push({
          id: tcId,
          title: `Test ${requirement.description} - Scenario ${i + 1}`,
          steps: `1. Navigate to relevant feature\n2. Execute test scenario for ${requirement.description}\n3. Verify expected behavior`,
          expectedResult: `Feature behaves as specified in ${requirementId}`,
          severity: requirement.priority as "High" | "Medium" | "Low",
          reqIds: [requirementId],
          viewpointIds: [newViewpointId],
          tags: ['auto-generated', 'functional'],
          locked: false,
          lastModified: new Date(),
          changeHistory: []
        });
      }

      // Update viewpoint with test case links
      newViewpoint.linkedTestCases = newTestCases.map(tc => tc.id);

      // Update requirement status and links
      const updatedRequirements = requirements.map(req => 
        req.id === requirementId 
          ? { 
              ...req, 
              relationshipStatus: 'Complete' as const,
              linkedViewpoints: [...req.linkedViewpoints, newViewpointId],
              linkedTestCases: [...req.linkedTestCases, ...newTestCases.map(tc => tc.id)],
              lastModified: new Date()
            }
          : req
      );

      // Update states
      setRequirements(updatedRequirements);
      setViewpoints(prev => [...prev, newViewpoint]);
      setTestCases(prev => [...prev, ...newTestCases]);

      // Mark as having unsaved changes for version management
      versionManager.markUnsavedChanges();

      // Add completion message
      const completionMessage: Message = {
        id: `completion-${Date.now()}`,
        role: "ai",
        content: `✅ **Artifacts Generated Successfully!**\n\n**Created for ${requirementId}: "${requirement.description}"**\n\n🎯 **New Viewpoint:** ${newViewpointId} - ${newViewpoint.area}\n📋 **Test Cases:** ${newTestCases.map(tc => tc.id).join(', ')}\n🔗 **Traceability:** Full coverage established\n\nRequirement status updated to "Complete". All artifacts are now linked and ready for review.`,
        timestamp: new Date(),
        type: "normal",
        hasModifiedArtifacts: true
      };
      setMessages(prev => [...prev, completionMessage]);

      // Show success toast
      toast({
        title: "Artifacts Generated",
        description: `Created viewpoint and test cases for ${requirementId}`,
      });

      setIsLoading(false);
    }, 2000);
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
      type: message.startsWith("/") ? "command" : "normal"
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = "";
      let hasModifiedArtifacts = false;
      const lowerMessage = message.toLowerCase();
      
      // Handle implementation permission
      if (message.startsWith("IMPLEMENT_PLAN:")) {
        const messageId = message.replace("IMPLEMENT_PLAN:", "");
        const planMessage = messages.find(msg => msg.id === messageId);
        
        if (planMessage && planMessage.implementationPlan) {
          aiResponse = `✅ **Implementation Started**\n\nExecuting the planned changes:\n${planMessage.implementationPlan}\n\n📝 Artifacts have been generated and updated accordingly.`;
          hasModifiedArtifacts = true;
        } else {
          aiResponse = "I couldn't find the implementation plan. Please try again.";
        }
      }
      // Handle artifact selection
      else if (message.startsWith("ARTIFACT_SELECTION:")) {
        const selectedArtifacts = message.replace("ARTIFACT_SELECTION:", "").split(",");
        const artifactNames = selectedArtifacts.map(id => {
          switch(id) {
            case "requirements": return "Requirements";
            case "viewpoints": return "Testing Viewpoints";
            case "testcases": return "Test Cases";
            case "traceability": return "Traceability Matrix";
            default: return id;
          }
        }).join(", ");
        
        aiResponse = `Perfect! I'll plan to generate ${artifactNames} for your test suite. This will provide comprehensive coverage of your testing needs.\n\n📋 **Implementation Plan:**\n• Analyze existing requirements\n• Generate ${artifactNames.toLowerCase()}\n• Establish traceability links\n• Validate coverage completeness`;
        hasModifiedArtifacts = false; // AI always provides plans first, never immediate modifications
      }
      // Handle new requirement detection from chat
      else if (message.toLowerCase().includes("new requirement") || 
               message.toLowerCase().includes("add requirement") ||
               message.toLowerCase().includes("requirement:") ||
               message.toLowerCase().includes("upload") && message.toLowerCase().includes("requirement")) {
        
        // Simulate detecting new requirements from user input
        const newReqId = `R-${String(requirements.length + 1).padStart(3, '0')}`;
        const newRequirement: Requirement = {
          id: newReqId,
          description: message.toLowerCase().includes("requirement:") 
            ? message.split("requirement:")[1].trim() 
            : "User-defined requirement from chat discussion",
          priority: "Medium",
          status: "Parsed",
          relationshipStatus: "New",
          linkedViewpoints: [],
          linkedTestCases: [],
          createdAt: new Date(), // Mark as just created
          lastModified: new Date(),
          changeHistory: []
        };

        aiResponse = `✅ **New Requirement Detected!**\n\n**${newReqId}**: "${newRequirement.description}"\n\n📋 **Implementation Plan:**\n• Add requirement to workspace with "New" status\n• Generate related testing viewpoints\n• Create foundational test cases\n• Establish traceability links\n\nThis will provide a complete foundation for testing this requirement.`;
        hasModifiedArtifacts = false;
        versionManager.markUnsavedChanges();
      }
      // Handle specific artifact generation commands
      else if (message.includes("/sample")) {
        aiResponse = "📋 **Sample Test Cases Plan**\n\nI can generate comprehensive sample test cases for your suite:\n\n**Planned Test Cases:**\n• Functional authentication tests\n• Edge case scenarios\n• Integration test scenarios\n• Error handling tests\n\nEach test case will include detailed steps, expected outcomes, and traceability links.";
        hasModifiedArtifacts = false;
      }
      else if (message.includes("/viewpoints")) {
        aiResponse = "📋 **Testing Viewpoints Plan**\n\nI can create comprehensive testing viewpoints:\n\n**Planned Viewpoints:**\n• Functional Testing Viewpoint\n• Security Testing Viewpoint\n• Performance Testing Viewpoint\n• Usability Testing Viewpoint\n\nEach viewpoint will provide targeted testing strategies for comprehensive coverage.";
        hasModifiedArtifacts = false;
      }
      else if (message.toLowerCase().includes("generating artifacts") || 
               (message.toLowerCase().includes("generate") && message.toLowerCase().includes("viewpoints")) ||
               (message.toLowerCase().includes("generate") && message.toLowerCase().includes("requirements"))) {
        aiResponse = "📋 **Comprehensive Test Suite Plan**\n\nI can create a complete test suite structure:\n\n**Planned Requirements:**\n• 8 functional requirements covering core functionality\n• 3 non-functional requirements for performance and security\n• 2 integration requirements for system compatibility\n\n**Planned Testing Viewpoints:**\n• Functional Testing Viewpoint\n• Security Testing Viewpoint\n• Performance Testing Viewpoint\n• Usability Testing Viewpoint\n• Integration Testing Viewpoint\n\nThis will provide comprehensive coverage for your testing needs.";
        hasModifiedArtifacts = false;
      }
      // Handle specific commands
      else if (message.startsWith("/sample")) {
        aiResponse = "📋 **Sample Test Cases Plan**\n\nI can generate sample test cases for authentication scenarios:\n\n**Planned Test Cases:**\n• Valid registration flows\n• Password validation scenarios\n• Email verification processes\n• Error handling cases\n\nEach test case will include detailed steps, expected results, and traceability links to requirements.";
        hasModifiedArtifacts = false;
      }
      else if (message.startsWith("/viewpoints")) {
        aiResponse = "📋 **Testing Viewpoints Plan**\n\nI can create comprehensive testing viewpoints:\n\n**Planned Viewpoints:**\n• **Functional Testing Viewpoint**: Core authentication features\n• **Security Testing Viewpoint**: Password policies and data protection\n• **Usability Testing Viewpoint**: User-friendly registration experience\n• **Performance Testing Viewpoint**: System behavior under load\n\nThese viewpoints will ensure no critical testing areas are overlooked.";
        hasModifiedArtifacts = false;
      }
      else if (message.startsWith("/export")) {
        aiResponse = "I'm preparing your test cases for export. You can choose from several formats:\n\n📄 **Excel (.xlsx)** - Structured spreadsheet with all test details\n📋 **CSV** - Simple comma-separated format for easy import\n📝 **Word (.docx)** - Formatted document ready for documentation\n🔗 **TestRail** - Direct import format for TestRail integration\n\nWhich format would you prefer?";
        hasModifiedArtifacts = false;
      }
      else if (message.startsWith("/upload")) {
        aiResponse = "I'm ready to analyze your requirements document. Please upload your file and I'll:\n\n🔍 **Extract Requirements** - Identify and parse all functional requirements\n📊 **Generate Test Cases** - Create comprehensive test cases for each requirement\n🎯 **Create Viewpoints** - Develop testing perspectives for thorough coverage\n🔗 **Build Traceability** - Link everything together for complete visibility\n\nSupported formats: PDF, Word (.docx), Excel (.xlsx), and plain text files.";
        hasModifiedArtifacts = false;
      }
      // Handle general AI responses
      else {
        const responses = [
          "I'm here to help you create comprehensive test suites. I can analyze requirements, create testing viewpoints, generate test cases, and establish traceability links. What would you like to work on?",
          "I can assist with building structured test artifacts based on your requirements. Feel free to describe your testing needs or use commands like /sample, /viewpoints, or /upload.",
          "Let me know what testing artifacts you need and I'll create an implementation plan. I can generate requirements, viewpoints, test cases, and ensure proper coverage.",
          "I'm ready to help with test suite development. Describe your testing objectives and I'll plan the appropriate artifacts and traceability links.",
          "Feel free to describe your testing requirements or upload documents. I'll analyze them and propose a structured approach for comprehensive test coverage."
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
        hasModifiedArtifacts = false;
      }

      // Auto-save version for AI modifications
      let command = '';
      let versionInfo: ArtifactVersion | undefined = undefined;
      
      if (message.includes('/sample')) command = '/sample';
      else if (message.includes('/viewpoints')) command = '/viewpoints';
      else if (message.includes('ARTIFACT_SELECTION')) command = 'ARTIFACT_SELECTION';
      else if (lowerMessage.includes('generating artifacts') || 
               (lowerMessage.includes('generate') && lowerMessage.includes('viewpoints')) ||
               (lowerMessage.includes('generate') && lowerMessage.includes('requirements'))) {
        command = '/viewpoints'; // Treat as viewpoints generation
        console.log('🎯 Matched artifact generation pattern, command set to:', command);
      }
      
      
      
      if (command && hasModifiedArtifacts) {
        console.log('🚀 Creating auto-save version with command:', command);
        const currentArtifacts = { requirements, viewpoints, testCases };
        versionInfo = versionManager.autoSaveVersion(currentArtifacts, command);
        console.log('📦 Version created:', versionInfo);
      }

      // Check if AI response needs implementation permission
      let needsImplementation = false;
      let implementationPlan = "";
      
      if (lowerMessage.includes('generate') || lowerMessage.includes('/sample') || lowerMessage.includes('/viewpoints')) {
        needsImplementation = true;
        implementationPlan = aiResponse;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
        type: "normal",
        needsImplementation: needsImplementation,
        implementationPlan: implementationPlan,
        versionInfo: versionInfo,
        hasModifiedArtifacts: hasModifiedArtifacts
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  const handleUpdateRequirement = (id: string, data: Partial<Requirement>, field?: string, oldValue?: string) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === id) {
        const updated = {
          ...req,
          ...data,
          lastModified: new Date(),
          changeHistory: field && oldValue ? [...req.changeHistory, {
            timestamp: new Date(),
            field,
            oldValue,
            newValue: data[field as keyof Requirement] as string
          }] : req.changeHistory
        };

        // Trigger impact analysis
        if (field && oldValue !== data[field as keyof Requirement]) {
          analyzeChangeImpact('requirement', id, field);
        }
        return updated;
      }
      return req;
    }));
    
    // Mark as having unsaved changes
    versionManager.markUnsavedChanges();
  };
  const handleUpdateViewpoint = (id: string, data: Partial<Viewpoint>, field?: string, oldValue?: string) => {
    setViewpoints(prev => prev.map(vp => {
      if (vp.id === id) {
        const updated = {
          ...vp,
          ...data,
          lastModified: new Date(),
          changeHistory: field && oldValue ? [...vp.changeHistory, {
            timestamp: new Date(),
            field,
            oldValue,
            newValue: data[field as keyof Viewpoint] as string
          }] : vp.changeHistory
        };

        // Trigger impact analysis
        if (field && oldValue !== data[field as keyof Viewpoint]) {
          analyzeChangeImpact('viewpoint', id, field);
        }
        return updated;
      }
      return vp;
    }));
    
    // Mark as having unsaved changes
    versionManager.markUnsavedChanges();
  };
  const handleUpdateTestCase = (id: string, data: Partial<TestCase>, field?: string, oldValue?: string) => {
    setTestCases(prev => prev.map(tc => {
      if (tc.id === id) {
        const updated = {
          ...tc,
          ...data,
          lastModified: new Date(),
          changeHistory: field && oldValue ? [...tc.changeHistory, {
            timestamp: new Date(),
            field,
            oldValue,
            newValue: data[field as keyof TestCase] as string
          }] : tc.changeHistory
        };

        // Trigger impact analysis
        if (field && oldValue !== data[field as keyof TestCase]) {
          analyzeChangeImpact('testcase', id, field);
        }
        return updated;
      }
      return tc;
    }));
    
    // Mark as having unsaved changes
    versionManager.markUnsavedChanges();
  };
  const analyzeChangeImpact = (artifactType: string, artifactId: string, field: string) => {
    // Get related artifacts based on traceability links
    let impactedArtifacts: string[] = [];
    if (artifactType === 'requirement') {
      const req = requirements.find(r => r.id === artifactId);
      if (req) {
        impactedArtifacts = [...req.linkedViewpoints, ...req.linkedTestCases];
      }
    } else if (artifactType === 'viewpoint') {
      const vp = viewpoints.find(v => v.id === artifactId);
      if (vp) {
        impactedArtifacts = [...vp.linkedRequirements, ...vp.linkedTestCases];
      }
    } else if (artifactType === 'testcase') {
      const tc = testCases.find(t => t.id === artifactId);
      if (tc) {
        impactedArtifacts = [...tc.reqIds, ...tc.viewpointIds];
      }
    }
    if (impactedArtifacts.length > 0) {
      toast({
        title: "Change Impact Detected",
        description: `Changes to ${artifactId} may affect ${impactedArtifacts.length} related artifact(s)`,
        variant: "default"
      });
    }
  };
  const handleLinkArtifacts = (sourceType: string, sourceId: string, targetType: string, targetId: string) => {
    // Create bidirectional links
    if (sourceType === 'requirement' && targetType === 'viewpoint') {
      handleUpdateRequirement(sourceId, {
        linkedViewpoints: [...(requirements.find(r => r.id === sourceId)?.linkedViewpoints || []), targetId]
      });
      handleUpdateViewpoint(targetId, {
        linkedRequirements: [...(viewpoints.find(v => v.id === targetId)?.linkedRequirements || []), sourceId]
      });
    }
    // Add more linking logic for other combinations...

    toast({
      title: "Artifacts Linked",
      description: `Successfully linked ${sourceId} to ${targetId}`
    });
  };
  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${testCases.length} test cases in ${format.toUpperCase()} format`
    });
  };
  const toggleSuiteStatus = () => {
    if (suiteStatus === "idle" || suiteStatus === "paused") {
      setSuiteStatus("running");
      toast({
        title: "Suite Running",
        description: "AI test generation is now active"
      });
    } else {
      setSuiteStatus("paused");
      toast({
        title: "Suite Paused",
        description: "AI generation paused - you can resume anytime"
      });
    }
  };
  const resetSuite = () => {
    setSuiteStatus("idle");
    setMessages(messages.slice(0, 1)); // Keep welcome message
    toast({
      title: "Suite Reset",
      description: "Workspace reset to initial state"
    });
  };

  // Version action handlers
  const handleVersionAction = (action: VersionAction) => {
    if (action.type === 'view-history') {
      setShowVersionHistory(true);
    } else if (action.type === 'restore' && action.versionId) {
      const versionNumber = parseInt(action.versionId);
      const version = versionManager.versions.find(v => v.versionNumber === versionNumber);
      if (version) {
        versionManager.restoreVersion(version, (data) => {
          setRequirements(data.requirements);
          setViewpoints(data.viewpoints);
          setTestCases(data.testCases);
        });
        toast({
          title: "Version Restored",
          description: `Successfully restored to version ${version.versionNumber}`
        });
      }
    }
  };

  const handleSaveVersion = (description: string) => {
    const currentArtifacts = { requirements, viewpoints, testCases };
    const newVersion = versionManager.saveVersion(currentArtifacts, description);
    setShowSaveVersionDialog(false);
    toast({
      title: "Version Saved",
      description: `Version ${newVersion.versionNumber} saved successfully`
    });
  };

  const getChangedArtifacts = () => {
    // Return empty array since we're not using this for manual saves anymore
    return [];
  };
  const {
    id
  } = useParams();

  // Mock data for breadcrumb navigation based on suite ID
  const getSuiteInfo = (suiteId: string) => {
    const suiteMap: Record<string, {
      projectName: string;
      projectId: string;
      folderName: string;
      suiteName: string;
    }> = {
      "s1": {
        projectName: "My Space",
        projectId: "my-space",
        folderName: "Personal Projects",
        suiteName: "E-commerce Platform Testing"
      },
      "s2": {
        projectName: "Project A",
        projectId: "p1",
        folderName: "Core Features",
        suiteName: "User Authentication Suite"
      },
      "s3": {
        projectName: "Project D",
        projectId: "sp1",
        folderName: "Core System",
        suiteName: "Payment Processing Tests"
      }
    };
    return suiteMap[suiteId || "s1"] || suiteMap["s1"];
  };
  const suiteInfo = getSuiteInfo(id || "s1");
  return <div className="h-screen flex flex-col bg-workspace-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border/50 h-16">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate("/projects")} className="cursor-pointer">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate(`/project/${suiteInfo.projectId}/folders`)} className="cursor-pointer">
                    {suiteInfo.projectName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-muted-foreground">
                    {suiteInfo.folderName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    {suiteInfo.suiteName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
          </div>
        </div>

      </header>


      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/3 min-w-[400px] max-w-[500px] h-full">
          <ChatPanel 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            hasUnsavedChanges={versionManager.hasUnsavedChanges}
            onVersionAction={handleVersionAction}
            onViewHistory={() => setShowVersionHistory(true)}
            uploadedFiles={uploadedFiles}
          />
        </div>

        {/* Right Panel - Artifacts */}
        <div className="flex-1 h-full">
          <ArtifactsPanel requirements={requirements} viewpoints={viewpoints} testCases={testCases} onUpdateRequirement={handleUpdateRequirement} onUpdateViewpoint={handleUpdateViewpoint} onUpdateTestCase={handleUpdateTestCase} onLinkArtifacts={handleLinkArtifacts} selectedArtifact={selectedArtifact} onSelectArtifact={setSelectedArtifact} onExport={handleExport} onGenerateArtifacts={handleGenerateArtifacts} />
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        open={showVersionHistory}
        onOpenChange={setShowVersionHistory}
        versions={versionManager.versions}
        currentVersion={versionManager.currentVersion}
        onAction={handleVersionAction}
      />

      {/* Save Version Dialog */}
      <SaveVersionDialog
        open={showSaveVersionDialog}
        onOpenChange={setShowSaveVersionDialog}
        onSave={handleSaveVersion}
        isCheckpoint={saveAsCheckpoint}
        changedArtifacts={getChangedArtifacts()}
      />
    </div>;
}