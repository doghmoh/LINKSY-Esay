// Application constants
export const APP_NAME = 'LINKSY';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  RESTRICTED: '/restricted',
  HOSTING: {
    MANAGE: '/hosting/manage',
  },
  DOMAINS: {
    MANAGE: '/domains/manage',
  },
} as const;

export const SERVICES = {
  SMS_PRO: 'SMS Pro',
  EMAIL_MARKETING: 'E-mail Marketing',
  HOSTING: 'Hosting',
  CONTACTS: 'Contacts',
  API: 'API',
  OTP: 'OTP',
  SETTINGS: 'Settings',
  HELP_DESK: 'Help Desk',
  FACTURATION: 'Facturation',
} as const;

export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  suspended: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
} as const;

export const MESSAGE_LIMITS = {
  GSM_7BIT: 160,
  UNICODE: 70,
} as const;

export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;