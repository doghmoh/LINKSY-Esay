// Export all email templates
export { default as AccountConfirmationEmail, generateAccountConfirmationEmailHTML } from './AccountConfirmation';
export { default as PasswordResetEmail, generatePasswordResetEmailHTML } from './PasswordReset';
export { default as AccountLockedEmail, generateAccountLockedEmailHTML } from './AccountLocked';

// Types
export interface EmailTemplateProps {
  userName: string;
  [key: string]: any;
}

// Email sending utility (to be implemented by backend)
export interface EmailService {
  sendAccountConfirmation: (email: string, userName: string, confirmationLink: string, expirationTime?: string) => Promise<void>;
  sendPasswordReset: (email: string, userName: string, resetLink: string, expirationTime?: string) => Promise<void>;
  sendAccountLocked: (email: string, userName: string, unlockLink: string, attemptCount?: number, lockDuration?: string, ipAddress?: string, attemptTime?: string) => Promise<void>;
}
