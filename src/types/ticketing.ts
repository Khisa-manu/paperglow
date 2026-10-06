export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';

export type TicketingModule =
  | 'dashboard'
  | 'tickets'
  | 'ticket_detail'
  | 'customers'
  | 'team'
  | 'categories'
  | 'sla'
  | 'knowledge_base'
  | 'reports'
  | 'notifications';

export interface TicketCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string; // Tailwind color name or hex
  slaResponseHours: number;
  slaResolutionHours: number;
  defaultAssigneeId?: string;
  ticketCount: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Support Lead' | 'Senior Support Engineer' | 'Tier-1 Agent' | 'Billing Specialist' | 'System Admin';
  department: 'Customer Care' | 'Technical Support' | 'Billing & Accounts' | 'Product Operations';
  status: 'online' | 'busy' | 'away' | 'offline';
  activeTicketsCount: number;
  maxCapacity: number;
  resolvedCount: number;
  avgResolutionHours: number;
  phone: string;
}

export interface CustomerNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tier: 'Enterprise VIP' | 'Business Standard' | 'Growth' | 'Starter';
  totalTickets: number;
  openTickets: number;
  satisfactionRating: number; // e.g. 4.8 / 5.0
  notes: CustomerNote[];
  avatar: string;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderType: 'customer' | 'staff' | 'system';
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  message: string;
  isInternalNote: boolean;
  attachments?: TicketAttachment[];
  createdAt: string;
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  actorName: string;
  action: string; // e.g. "Changed status to In Progress", "Assigned to David K."
  details?: string;
  timestamp: string;
}

export interface Ticket {
  id: string; // e.g. "TK-8491"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  subject: string;
  description: string;
  categoryId: string;
  categoryName: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffAvatar?: string;
  assignedStaffRole?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string; // Resolution SLA target
  responseDueTime: string; // First response SLA target
  isOverdue: boolean;
  isResponseOverdue: boolean;
  firstResponseAt?: string;
  resolvedAt?: string;
  tags: string[];
  attachments?: TicketAttachment[];
  source: 'Web Portal' | 'Email' | 'API Gateway' | 'Mobile App';
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  tags: string[];
  updatedAt: string;
}

export interface SLAEscalationPolicy {
  id: string;
  priority: TicketPriority;
  label: string;
  responseHours: number;
  resolutionHours: number;
  escalationRole: string;
  escalationAction: string;
}

export interface TicketNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_ticket' | 'assignment' | 'status_change' | 'customer_reply' | 'overdue';
  ticketId?: string;
  isRead: boolean;
  createdAt: string;
}
