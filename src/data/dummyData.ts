// Comprehensive Dummy Data for the Survey Admin Panel

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "field-agent" | "supervisor" | "manager" | "admin";
  status: "active" | "inactive" | "suspended";
  initials: string;
  assignedSurveys: number;
  completedResponses: number;
  avgResponseTime: string;
  lastActive: string;
  createdAt: string;
  department: string;
  location: string;
  performanceScore: number;
  surveysCompleted: number[];
  deviceId: string;
}

export interface Survey {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "completed" | "paused";
  platform: "mobile" | "web" | "both";
  responses: number;
  targetResponses: number;
  createdAt: string;
  updatedAt: string;
  assignedUsers: number;
  questionCount: number;
  avgCompletionTime: string;
  completionRate: number;
  category: string;
  createdBy: string;
}

export interface Device {
  id: string;
  name: string;
  type: "smartphone" | "tablet" | "desktop";
  os: string;
  osVersion: string;
  status: "online" | "offline" | "maintenance";
  battery: number | null;
  lastSeen: string;
  location: string;
  coordinates: { lat: number; lng: number };
  assignedUser: string;
  assignedUserId: string;
  surveysCompleted: number;
  appVersion: string;
  storageUsed: string;
  lastSync: string;
}

export interface GeoFence {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  status: "active" | "inactive";
  assignedSurveys: number;
  activeDevices: number;
  alerts: number;
  createdAt: string;
  color: string;
  description: string;
}

export interface Response {
  id: string;
  surveyId: string;
  surveyName: string;
  respondent: string;
  respondentEmail?: string;
  device: string;
  location: string;
  coordinates: { lat: number; lng: number };
  completedAt: string;
  startedAt: string;
  duration: string;
  status: "complete" | "partial" | "abandoned";
  score: number | null;
  answers: { questionId: string; question: string; answer: string }[];
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "manager" | "supervisor";
  initials: string;
  modules: string[];
  lastLogin: string;
  status: "active" | "inactive";
  phone: string;
  department: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: "login" | "logout" | "create" | "update" | "delete" | "export" | "settings" | "view";
  description: string;
  user: string;
  userId: string;
  initials: string;
  ip: string;
  timestamp: string;
  module: string;
  details?: string;
  severity: "info" | "warning" | "error";
}

// Users Data
export const users: User[] = [
  {
    id: "U-001",
    name: "John Doe",
    email: "john.doe@surveyco.com",
    phone: "+1 234 567 8900",
    role: "field-agent",
    status: "active",
    initials: "JD",
    assignedSurveys: 5,
    completedResponses: 234,
    avgResponseTime: "4m 32s",
    lastActive: "2 minutes ago",
    createdAt: "2024-01-05",
    department: "Field Operations",
    location: "New York, NY",
    performanceScore: 92,
    surveysCompleted: [1, 2, 5],
    deviceId: "D-7892",
  },
  {
    id: "U-002",
    name: "Sarah Wilson",
    email: "sarah.wilson@surveyco.com",
    phone: "+1 234 567 8901",
    role: "supervisor",
    status: "active",
    initials: "SW",
    assignedSurveys: 12,
    completedResponses: 567,
    avgResponseTime: "3m 45s",
    lastActive: "5 minutes ago",
    createdAt: "2023-11-15",
    department: "Survey Management",
    location: "Los Angeles, CA",
    performanceScore: 96,
    surveysCompleted: [1, 2, 3, 4, 5],
    deviceId: "D-7893",
  },
  {
    id: "U-003",
    name: "Mike Johnson",
    email: "mike.johnson@surveyco.com",
    phone: "+1 234 567 8902",
    role: "field-agent",
    status: "inactive",
    initials: "MJ",
    assignedSurveys: 3,
    completedResponses: 89,
    avgResponseTime: "5m 12s",
    lastActive: "3 days ago",
    createdAt: "2024-02-20",
    department: "Field Operations",
    location: "Chicago, IL",
    performanceScore: 78,
    surveysCompleted: [3],
    deviceId: "D-7894",
  },
  {
    id: "U-004",
    name: "Emily Davis",
    email: "emily.davis@surveyco.com",
    phone: "+1 234 567 8903",
    role: "field-agent",
    status: "active",
    initials: "ED",
    assignedSurveys: 8,
    completedResponses: 456,
    avgResponseTime: "3m 58s",
    lastActive: "Just now",
    createdAt: "2023-09-10",
    department: "Field Operations",
    location: "Houston, TX",
    performanceScore: 94,
    surveysCompleted: [1, 2, 4, 5],
    deviceId: "D-7895",
  },
  {
    id: "U-005",
    name: "Robert Chen",
    email: "robert.chen@surveyco.com",
    phone: "+1 234 567 8904",
    role: "manager",
    status: "active",
    initials: "RC",
    assignedSurveys: 15,
    completedResponses: 892,
    avgResponseTime: "2m 45s",
    lastActive: "10 minutes ago",
    createdAt: "2023-06-01",
    department: "Operations",
    location: "San Francisco, CA",
    performanceScore: 98,
    surveysCompleted: [1, 2, 3, 4, 5],
    deviceId: "D-7896",
  },
  {
    id: "U-006",
    name: "Amanda Foster",
    email: "amanda.foster@surveyco.com",
    phone: "+1 234 567 8905",
    role: "field-agent",
    status: "active",
    initials: "AF",
    assignedSurveys: 6,
    completedResponses: 312,
    avgResponseTime: "4m 15s",
    lastActive: "1 hour ago",
    createdAt: "2024-01-20",
    department: "Field Operations",
    location: "Miami, FL",
    performanceScore: 88,
    surveysCompleted: [1, 2, 5],
    deviceId: "D-7897",
  },
  {
    id: "U-007",
    name: "David Park",
    email: "david.park@surveyco.com",
    phone: "+1 234 567 8906",
    role: "supervisor",
    status: "suspended",
    initials: "DP",
    assignedSurveys: 0,
    completedResponses: 145,
    avgResponseTime: "6m 30s",
    lastActive: "1 week ago",
    createdAt: "2023-08-15",
    department: "Survey Management",
    location: "Seattle, WA",
    performanceScore: 65,
    surveysCompleted: [2, 3],
    deviceId: "D-7898",
  },
  {
    id: "U-008",
    name: "Lisa Thompson",
    email: "lisa.thompson@surveyco.com",
    phone: "+1 234 567 8907",
    role: "field-agent",
    status: "active",
    initials: "LT",
    assignedSurveys: 7,
    completedResponses: 378,
    avgResponseTime: "3m 50s",
    lastActive: "30 minutes ago",
    createdAt: "2023-12-01",
    department: "Field Operations",
    location: "Boston, MA",
    performanceScore: 91,
    surveysCompleted: [1, 4, 5],
    deviceId: "D-7899",
  },
];

// Surveys Data
export const surveys: Survey[] = [
  {
    id: "S-001",
    name: "Customer Satisfaction 2024",
    description: "Annual customer satisfaction survey to measure service quality and customer loyalty",
    status: "active",
    platform: "both",
    responses: 1234,
    targetResponses: 2000,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    assignedUsers: 12,
    questionCount: 25,
    avgCompletionTime: "8m 30s",
    completionRate: 87,
    category: "Customer Feedback",
    createdBy: "Admin User",
  },
  {
    id: "S-002",
    name: "Employee Engagement Survey",
    description: "Quarterly employee engagement and workplace satisfaction assessment",
    status: "active",
    platform: "web",
    responses: 856,
    targetResponses: 1000,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    assignedUsers: 8,
    questionCount: 40,
    avgCompletionTime: "12m 15s",
    completionRate: 92,
    category: "Employee Feedback",
    createdBy: "John Manager",
  },
  {
    id: "S-003",
    name: "Product Feedback - Mobile App",
    description: "Collect user feedback on the new mobile application features",
    status: "draft",
    platform: "mobile",
    responses: 0,
    targetResponses: 500,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    assignedUsers: 0,
    questionCount: 15,
    avgCompletionTime: "0m 0s",
    completionRate: 0,
    category: "Product Research",
    createdBy: "Sarah Wilson",
  },
  {
    id: "S-004",
    name: "Market Research Q1",
    description: "First quarter market research survey for new product launch",
    status: "completed",
    platform: "web",
    responses: 500,
    targetResponses: 500,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-05",
    assignedUsers: 5,
    questionCount: 35,
    avgCompletionTime: "15m 45s",
    completionRate: 100,
    category: "Market Research",
    createdBy: "Admin User",
  },
  {
    id: "S-005",
    name: "Field Survey - Region A",
    description: "On-ground field survey for demographic data collection in Region A",
    status: "active",
    platform: "mobile",
    responses: 2345,
    targetResponses: 5000,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20",
    assignedUsers: 25,
    questionCount: 50,
    avgCompletionTime: "18m 20s",
    completionRate: 78,
    category: "Field Research",
    createdBy: "Robert Chen",
  },
  {
    id: "S-006",
    name: "Brand Awareness Study",
    description: "Measure brand recognition and recall among target audience",
    status: "paused",
    platform: "both",
    responses: 423,
    targetResponses: 1500,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-15",
    assignedUsers: 10,
    questionCount: 20,
    avgCompletionTime: "6m 45s",
    completionRate: 82,
    category: "Brand Research",
    createdBy: "Emily Davis",
  },
];

// Devices Data
export const devices: Device[] = [
  {
    id: "D-7892",
    name: "Field Device 1",
    type: "smartphone",
    os: "Android",
    osVersion: "13",
    status: "online",
    battery: 85,
    lastSeen: "2 minutes ago",
    location: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    assignedUser: "John Doe",
    assignedUserId: "U-001",
    surveysCompleted: 234,
    appVersion: "2.5.1",
    storageUsed: "1.2 GB",
    lastSync: "2 minutes ago",
  },
  {
    id: "D-7893",
    name: "Field Device 2",
    type: "tablet",
    os: "iOS",
    osVersion: "17",
    status: "online",
    battery: 42,
    lastSeen: "5 minutes ago",
    location: "Los Angeles, CA",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    assignedUser: "Sarah Wilson",
    assignedUserId: "U-002",
    surveysCompleted: 567,
    appVersion: "2.5.1",
    storageUsed: "2.1 GB",
    lastSync: "5 minutes ago",
  },
  {
    id: "D-7894",
    name: "Office Device 1",
    type: "desktop",
    os: "Windows",
    osVersion: "11",
    status: "offline",
    battery: null,
    lastSeen: "2 hours ago",
    location: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    assignedUser: "Mike Johnson",
    assignedUserId: "U-003",
    surveysCompleted: 89,
    appVersion: "2.4.0",
    storageUsed: "500 MB",
    lastSync: "2 hours ago",
  },
  {
    id: "D-7895",
    name: "Field Device 3",
    type: "smartphone",
    os: "Android",
    osVersion: "14",
    status: "online",
    battery: 98,
    lastSeen: "Just now",
    location: "Houston, TX",
    coordinates: { lat: 29.7604, lng: -95.3698 },
    assignedUser: "Emily Davis",
    assignedUserId: "U-004",
    surveysCompleted: 456,
    appVersion: "2.5.1",
    storageUsed: "1.8 GB",
    lastSync: "Just now",
  },
  {
    id: "D-7896",
    name: "Field Device 4",
    type: "smartphone",
    os: "iOS",
    osVersion: "17.2",
    status: "online",
    battery: 72,
    lastSeen: "10 minutes ago",
    location: "San Francisco, CA",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    assignedUser: "Robert Chen",
    assignedUserId: "U-005",
    surveysCompleted: 892,
    appVersion: "2.5.1",
    storageUsed: "2.4 GB",
    lastSync: "10 minutes ago",
  },
  {
    id: "D-7897",
    name: "Field Device 5",
    type: "tablet",
    os: "Android",
    osVersion: "13",
    status: "online",
    battery: 56,
    lastSeen: "1 hour ago",
    location: "Miami, FL",
    coordinates: { lat: 25.7617, lng: -80.1918 },
    assignedUser: "Amanda Foster",
    assignedUserId: "U-006",
    surveysCompleted: 312,
    appVersion: "2.5.0",
    storageUsed: "1.5 GB",
    lastSync: "1 hour ago",
  },
  {
    id: "D-7898",
    name: "Field Device 6",
    type: "smartphone",
    os: "Android",
    osVersion: "12",
    status: "maintenance",
    battery: 15,
    lastSeen: "1 week ago",
    location: "Seattle, WA",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    assignedUser: "David Park",
    assignedUserId: "U-007",
    surveysCompleted: 145,
    appVersion: "2.3.0",
    storageUsed: "800 MB",
    lastSync: "1 week ago",
  },
  {
    id: "D-7899",
    name: "Field Device 7",
    type: "smartphone",
    os: "iOS",
    osVersion: "16.5",
    status: "online",
    battery: 88,
    lastSeen: "30 minutes ago",
    location: "Boston, MA",
    coordinates: { lat: 42.3601, lng: -71.0589 },
    assignedUser: "Lisa Thompson",
    assignedUserId: "U-008",
    surveysCompleted: 378,
    appVersion: "2.5.1",
    storageUsed: "1.9 GB",
    lastSync: "30 minutes ago",
  },
];

// GeoFences Data
export const geoFences: GeoFence[] = [
  {
    id: "GF-001",
    name: "Downtown Survey Area",
    center: { lat: 40.7128, lng: -74.0060 },
    radius: 500,
    status: "active",
    assignedSurveys: 3,
    activeDevices: 5,
    alerts: 2,
    createdAt: "2024-01-10",
    color: "#0EA5E9",
    description: "Primary survey zone for downtown Manhattan area",
  },
  {
    id: "GF-002",
    name: "Mall Region A",
    center: { lat: 34.0522, lng: -118.2437 },
    radius: 200,
    status: "active",
    assignedSurveys: 1,
    activeDevices: 2,
    alerts: 0,
    createdAt: "2024-01-12",
    color: "#14B8A6",
    description: "Shopping mall survey area for customer feedback",
  },
  {
    id: "GF-003",
    name: "Industrial Zone",
    center: { lat: 41.8781, lng: -87.6298 },
    radius: 1000,
    status: "inactive",
    assignedSurveys: 0,
    activeDevices: 0,
    alerts: 0,
    createdAt: "2024-01-05",
    color: "#F59E0B",
    description: "Industrial area survey zone - currently paused",
  },
  {
    id: "GF-004",
    name: "University Campus",
    center: { lat: 37.7749, lng: -122.4194 },
    radius: 350,
    status: "active",
    assignedSurveys: 2,
    activeDevices: 4,
    alerts: 1,
    createdAt: "2024-01-15",
    color: "#8B5CF6",
    description: "University campus for student surveys",
  },
  {
    id: "GF-005",
    name: "Beach Resort Area",
    center: { lat: 25.7617, lng: -80.1918 },
    radius: 800,
    status: "active",
    assignedSurveys: 2,
    activeDevices: 3,
    alerts: 0,
    createdAt: "2024-01-18",
    color: "#EC4899",
    description: "Tourist area for vacation satisfaction surveys",
  },
];

// Responses Data
export const responses: Response[] = [
  {
    id: "R-10234",
    surveyId: "S-001",
    surveyName: "Customer Satisfaction 2024",
    respondent: "Anonymous",
    device: "D-7892",
    location: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    completedAt: "2024-01-20 14:32:15",
    startedAt: "2024-01-20 14:24:45",
    duration: "7m 30s",
    status: "complete",
    score: 85,
    answers: [
      { questionId: "Q1", question: "How satisfied are you with our service?", answer: "Very Satisfied" },
      { questionId: "Q2", question: "Would you recommend us to others?", answer: "Definitely" },
      { questionId: "Q3", question: "Rate your overall experience", answer: "8/10" },
    ],
  },
  {
    id: "R-10235",
    surveyId: "S-002",
    surveyName: "Employee Engagement Survey",
    respondent: "John Smith",
    respondentEmail: "john.smith@company.com",
    device: "D-7893",
    location: "Los Angeles, CA",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    completedAt: "2024-01-20 14:28:42",
    startedAt: "2024-01-20 14:15:00",
    duration: "13m 42s",
    status: "complete",
    score: 92,
    answers: [
      { questionId: "Q1", question: "How engaged do you feel at work?", answer: "Highly Engaged" },
      { questionId: "Q2", question: "Do you feel valued by your manager?", answer: "Always" },
      { questionId: "Q3", question: "Work-life balance rating", answer: "9/10" },
    ],
  },
  {
    id: "R-10236",
    surveyId: "S-003",
    surveyName: "Product Feedback - Mobile App",
    respondent: "Anonymous",
    device: "D-7894",
    location: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    completedAt: "2024-01-20 14:15:30",
    startedAt: "2024-01-20 14:10:00",
    duration: "5m 30s",
    status: "partial",
    score: null,
    answers: [
      { questionId: "Q1", question: "How often do you use the app?", answer: "Daily" },
    ],
  },
  {
    id: "R-10237",
    surveyId: "S-001",
    surveyName: "Customer Satisfaction 2024",
    respondent: "Jane Doe",
    respondentEmail: "jane.doe@email.com",
    device: "D-7895",
    location: "Houston, TX",
    coordinates: { lat: 29.7604, lng: -95.3698 },
    completedAt: "2024-01-20 13:45:12",
    startedAt: "2024-01-20 13:37:00",
    duration: "8m 12s",
    status: "complete",
    score: 78,
    answers: [
      { questionId: "Q1", question: "How satisfied are you with our service?", answer: "Satisfied" },
      { questionId: "Q2", question: "Would you recommend us to others?", answer: "Probably" },
      { questionId: "Q3", question: "Rate your overall experience", answer: "7/10" },
    ],
  },
  {
    id: "R-10238",
    surveyId: "S-004",
    surveyName: "Market Research Q1",
    respondent: "Anonymous",
    device: "D-7896",
    location: "Phoenix, AZ",
    coordinates: { lat: 33.4484, lng: -112.0740 },
    completedAt: "2024-01-20 12:30:00",
    startedAt: "2024-01-20 12:14:15",
    duration: "15m 45s",
    status: "complete",
    score: 88,
    answers: [
      { questionId: "Q1", question: "What product features are most important?", answer: "Ease of use" },
      { questionId: "Q2", question: "Price sensitivity", answer: "Moderate" },
      { questionId: "Q3", question: "Purchase likelihood", answer: "Very Likely" },
    ],
  },
  {
    id: "R-10239",
    surveyId: "S-005",
    surveyName: "Field Survey - Region A",
    respondent: "Michael Brown",
    respondentEmail: "m.brown@field.com",
    device: "D-7897",
    location: "Miami, FL",
    coordinates: { lat: 25.7617, lng: -80.1918 },
    completedAt: "2024-01-20 11:22:45",
    startedAt: "2024-01-20 11:04:30",
    duration: "18m 15s",
    status: "complete",
    score: 91,
    answers: [
      { questionId: "Q1", question: "Household size", answer: "4" },
      { questionId: "Q2", question: "Monthly income range", answer: "$5000-$7500" },
      { questionId: "Q3", question: "Primary occupation", answer: "Professional" },
    ],
  },
  {
    id: "R-10240",
    surveyId: "S-006",
    surveyName: "Brand Awareness Study",
    respondent: "Anonymous",
    device: "D-7898",
    location: "Seattle, WA",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    completedAt: "2024-01-20 10:15:00",
    startedAt: "2024-01-20 10:08:15",
    duration: "6m 45s",
    status: "abandoned",
    score: null,
    answers: [],
  },
];

// Staff Data
export const staff: Staff[] = [
  {
    id: "ST-001",
    name: "Admin User",
    email: "admin@survey.com",
    role: "super-admin",
    initials: "AU",
    modules: ["all"],
    lastLogin: "Just now",
    status: "active",
    phone: "+1 234 567 8000",
    department: "Administration",
    createdAt: "2023-01-01",
  },
  {
    id: "ST-002",
    name: "John Manager",
    email: "john.m@survey.com",
    role: "manager",
    initials: "JM",
    modules: ["dashboard", "surveys", "users", "reports", "responses"],
    lastLogin: "2 hours ago",
    status: "active",
    phone: "+1 234 567 8001",
    department: "Operations",
    createdAt: "2023-03-15",
  },
  {
    id: "ST-003",
    name: "Sarah Supervisor",
    email: "sarah.s@survey.com",
    role: "supervisor",
    initials: "SS",
    modules: ["dashboard", "surveys", "users", "responses"],
    lastLogin: "1 day ago",
    status: "active",
    phone: "+1 234 567 8002",
    department: "Survey Management",
    createdAt: "2023-06-20",
  },
  {
    id: "ST-004",
    name: "Emily Admin",
    email: "emily.a@survey.com",
    role: "admin",
    initials: "EA",
    modules: ["dashboard", "surveys", "users", "devices", "reports", "master-data", "logs", "settings"],
    lastLogin: "5 hours ago",
    status: "active",
    phone: "+1 234 567 8003",
    department: "IT",
    createdAt: "2023-08-10",
  },
  {
    id: "ST-005",
    name: "David Support",
    email: "david.s@survey.com",
    role: "supervisor",
    initials: "DS",
    modules: ["dashboard", "surveys", "responses", "help"],
    lastLogin: "3 days ago",
    status: "inactive",
    phone: "+1 234 567 8004",
    department: "Support",
    createdAt: "2023-09-05",
  },
];

// Activity Logs Data
export const activityLogs: ActivityLog[] = [
  {
    id: "AL-001",
    action: "login",
    description: "User logged in successfully",
    user: "Admin User",
    userId: "ST-001",
    initials: "AU",
    ip: "192.168.1.100",
    timestamp: "2024-01-20 14:32:15",
    module: "Authentication",
    severity: "info",
  },
  {
    id: "AL-002",
    action: "create",
    description: "Created new survey 'Customer Feedback Q1'",
    user: "John Manager",
    userId: "ST-002",
    initials: "JM",
    ip: "192.168.1.101",
    timestamp: "2024-01-20 14:28:42",
    module: "Surveys",
    details: "Survey ID: S-007, Questions: 20, Platform: Both",
    severity: "info",
  },
  {
    id: "AL-003",
    action: "update",
    description: "Updated user permissions for Sarah Wilson",
    user: "Admin User",
    userId: "ST-001",
    initials: "AU",
    ip: "192.168.1.100",
    timestamp: "2024-01-20 14:15:30",
    module: "Users",
    details: "Changed role from field-agent to supervisor",
    severity: "warning",
  },
  {
    id: "AL-004",
    action: "delete",
    description: "Deleted device D-1234 from registry",
    user: "Admin User",
    userId: "ST-001",
    initials: "AU",
    ip: "192.168.1.100",
    timestamp: "2024-01-20 13:45:12",
    module: "Devices",
    details: "Device was decommissioned due to hardware failure",
    severity: "error",
  },
  {
    id: "AL-005",
    action: "settings",
    description: "Modified system notification settings",
    user: "Admin User",
    userId: "ST-001",
    initials: "AU",
    ip: "192.168.1.100",
    timestamp: "2024-01-20 12:30:00",
    module: "Settings",
    details: "Enabled email notifications for geo-fence alerts",
    severity: "info",
  },
  {
    id: "AL-006",
    action: "logout",
    description: "User logged out",
    user: "Sarah Supervisor",
    userId: "ST-003",
    initials: "SS",
    ip: "192.168.1.102",
    timestamp: "2024-01-20 11:15:45",
    module: "Authentication",
    severity: "info",
  },
  {
    id: "AL-007",
    action: "export",
    description: "Exported survey responses to CSV",
    user: "John Manager",
    userId: "ST-002",
    initials: "JM",
    ip: "192.168.1.101",
    timestamp: "2024-01-20 10:45:00",
    module: "Reports",
    details: "Survey: Customer Satisfaction 2024, Records: 1234",
    severity: "info",
  },
  {
    id: "AL-008",
    action: "create",
    description: "Created new geo-fence zone 'Beach Resort Area'",
    user: "Emily Admin",
    userId: "ST-004",
    initials: "EA",
    ip: "192.168.1.103",
    timestamp: "2024-01-20 09:30:00",
    module: "Geo-Fencing",
    details: "Zone ID: GF-005, Radius: 800m, Location: Miami, FL",
    severity: "info",
  },
  {
    id: "AL-009",
    action: "view",
    description: "Viewed detailed report for Field Survey - Region A",
    user: "Sarah Supervisor",
    userId: "ST-003",
    initials: "SS",
    ip: "192.168.1.102",
    timestamp: "2024-01-20 09:15:00",
    module: "Reports",
    severity: "info",
  },
  {
    id: "AL-010",
    action: "update",
    description: "Updated device D-7897 app version",
    user: "Admin User",
    userId: "ST-001",
    initials: "AU",
    ip: "192.168.1.100",
    timestamp: "2024-01-19 16:45:00",
    module: "Devices",
    details: "Updated from v2.4.0 to v2.5.0",
    severity: "info",
  },
];

// Dashboard Stats
export const dashboardStats = {
  totalSurveys: 156,
  activeSurveys: 24,
  totalResponses: 45234,
  todayResponses: 234,
  totalUsers: 892,
  activeUsers: 678,
  totalDevices: 83,
  onlineDevices: 62,
  avgCompletionRate: 78,
  avgResponseTime: "5m 32s",
  weeklyGrowth: 12,
  monthlyGrowth: 24,
};

// Charts Data
export const weeklyResponsesData = [
  { day: "Mon", responses: 120, target: 150 },
  { day: "Tue", responses: 180, target: 150 },
  { day: "Wed", responses: 150, target: 150 },
  { day: "Thu", responses: 220, target: 150 },
  { day: "Fri", responses: 280, target: 150 },
  { day: "Sat", responses: 190, target: 150 },
  { day: "Sun", responses: 140, target: 150 },
];

export const monthlyTrendData = [
  { month: "Jan", responses: 4500, users: 780 },
  { month: "Feb", responses: 5200, users: 810 },
  { month: "Mar", responses: 4800, users: 795 },
  { month: "Apr", responses: 6100, users: 850 },
  { month: "May", responses: 7200, users: 870 },
  { month: "Jun", responses: 6800, users: 865 },
];

export const platformDistribution = [
  { name: "Mobile", value: 65, color: "hsl(199, 89%, 48%)" },
  { name: "Web", value: 25, color: "hsl(172, 66%, 50%)" },
  { name: "Tablet", value: 10, color: "hsl(38, 92%, 50%)" },
];

export const surveyPerformance = [
  { name: "Customer Satisfaction", completion: 87, responses: 1234 },
  { name: "Employee Engagement", completion: 92, responses: 856 },
  { name: "Market Research", completion: 100, responses: 500 },
  { name: "Field Survey", completion: 78, responses: 2345 },
  { name: "Brand Awareness", completion: 82, responses: 423 },
];

export const userPerformanceData = [
  { name: "Week 1", avgScore: 85, responses: 450 },
  { name: "Week 2", avgScore: 88, responses: 520 },
  { name: "Week 3", avgScore: 92, responses: 610 },
  { name: "Week 4", avgScore: 89, responses: 580 },
];

export const regionData = [
  { region: "Northeast", responses: 12500, users: 234 },
  { region: "Southeast", responses: 9800, users: 187 },
  { region: "Midwest", responses: 8200, users: 156 },
  { region: "Southwest", responses: 7500, users: 143 },
  { region: "West", responses: 11200, users: 212 },
];
