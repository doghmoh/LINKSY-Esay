// Global type definitions for the LINKSY project
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  accountType: 'developer' | 'normal';
  isCompany: boolean;
  companyName?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'Open' | 'Answered' | 'Closed' | 'Pending';
  priority: 'Low' | 'Medium' | 'High';
  created: string;
  description: string;
  category: string;
  assignee: string;
  chatType: 'live' | 'classic';
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
  group: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  message: string;
  sender: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  stats?: {
    sent: number;
    delivered: number;
    failed: number;
    rate: string;
  };
}

export interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  isActive: boolean;
  requiresActivation?: boolean;
}

export interface NavigationTab {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
}

export type ServiceType = 'SMS Pro' | 'E-mail Marketing' | 'Hosting' | 'Contacts' | 'API' | 'OTP' | 'Settings' | 'Help Desk' | 'Facturation';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}