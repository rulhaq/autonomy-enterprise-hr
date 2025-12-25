export interface User {
  id: string;
  email: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  managerId?: string;
  role: 'employee' | 'manager' | 'hr' | 'admin';
  language: string;
  avatar?: string;
  phone?: string;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
  projects?: string[];
  site?: string;
  status?: 'available' | 'on_leave' | 'busy' | 'offline';
}

export interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'emergency' | 'unpaid' | 'maternity' | 'paternity' | 'pilgrimage';
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approverId?: string;
  approverName?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  comments?: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: {
    earned: number;
    used: number;
    available: number;
    pending: number;
  };
  sick: {
    earned: number;
    used: number;
    available: number;
    pending: number;
  };
  emergency: {
    earned: number;
    used: number;
    available: number;
    pending: number;
  };
  lastUpdated: Date;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  breakdown: {
    [key: string]: number;
  };
  pdfUrl?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
  metadata?: {
    actionType?: string;
    referenceId?: string;
    [key: string]: any;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  language: string;
}

export interface HRDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  department?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  sourceUrl?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  cycle: string;
  period: {
    start: Date;
    end: Date;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'completed';
  selfAssessment?: any;
  managerReview?: any;
  rating?: number;
  goals: Array<{
    id: string;
    title: string;
    description: string;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hierarchy {
  employeeId: string;
  directManager?: {
    id: string;
    name: string;
    email: string;
    position: string;
  };
  skipLevelManager?: {
    id: string;
    name: string;
    email: string;
    position: string;
  };
  teamMembers?: Array<{
    id: string;
    name: string;
    email: string;
    position: string;
  }>;
  department: {
    id: string;
    name: string;
    head?: {
      id: string;
      name: string;
    };
  };
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  category: string;
  roles?: string[];
  languages?: Record<string, {
    title: string;
    description: string;
  }>;
}

