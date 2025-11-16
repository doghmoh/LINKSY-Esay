import { ReactNode } from 'react';

// --- Data Structures ---
export interface SmsOffer {
  name: string;
  price: number;
  quotaSMS: number;
  quotaEmail: number;
  senderID: number;
  icon: ReactNode;
  recommended?: boolean;
}

export interface HostingOffer {
  name: string;
  description: string;
  price: number;
  period: number;
  domain: boolean;
  cpu: number;
  memory: number;
  io: number;
  php: boolean;
  python: boolean;
  nodeJs: boolean;
  emails: string;
  ssl: boolean;
  storage: string;
  traffic: string;
  backups: string;
  panel: boolean;
  apache: boolean;
  support: string;
  icon: ReactNode;
  recommended?: boolean;
}

export type Offer = SmsOffer | HostingOffer;

export interface PaymentMethod {
  name: string; // e.g., "CIB", "Edahabia", "Cash"
  label: string; // e.g., "Carte CIB", "Carte Edahabia", "Paiement en espèces"
  icon: ReactNode;
  logo: string | null; // URL for logos like CIB/Edahabia
  description: string;
}

// --- API Response ---
export interface PaymentApiResponse {
  respCode: string; // e.g., "00", "05", "PC" (Pending Cash)
  respCode_desc?: string; // e.g., "Approuvé", "Transaction Refusée", "En attente de paiement en espèces"
  actionCodeDescription?: string; // More details on refusal
  orderId?: string;
  orderNumber?: string;
  approvalCode?: string; // Only for successful online payments
  amount?: number;
  currency?: string;
  paymentMethod?: string; // "Cash", "CIB", "Dahabia"
  transactionDate?: string;
  ErrorCode?: string; // e.g., "0", "5"
  OrderStatus?: string; // e.g., "2" (Approved), "3" (Rejected), "0" (Awaiting Payment for Cash)
}

// --- Component Props ---

export interface ServiceSelectionProps {
  smsProOffers: SmsOffer[];
  hostingOffers: HostingOffer[];
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
  onOfferSelect: (offer: Offer) => void;
  onBackToCategories: () => void;
}

export interface OrderSummaryProps {
  selectedCategory: string | null;
  selectedOffer: Offer | null;
  formatCurrency: (amount: number | undefined) => string;
  mobilePaymentSlot?: ReactNode; // Rendered only on mobile, just below billing detail
}

export interface PaymentMethodSelectionProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: string | null; // Should match PaymentMethod['name']
  isProcessingPayment: boolean;
  onMethodSelect: (method: string) => void;
  onConfirmPayment: () => void;
  onChangeMethod: () => void;
}

export interface PaymentStatusProps {
  paymentResponse: PaymentApiResponse | null;
  paymentStatus: 'pending' | 'accepted' | 'rejected' | 'pending_cash'; // Added 'pending_cash'
  formatCurrency: (amount: number | undefined) => string;
  formatDate: (dateString: string | undefined) => string;
  onNewPurchase: () => void;
}

// --- Reports ---
export interface PaymentReport {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string; // e.g., "Cash", "CIB", "Dahabia"
  status: 'accepted' | 'rejected' | 'pending_cash';
  transactionDate: string; // ISO string
  customer?: string;
  invoiceUrl?: string; // URL to invoice PDF or route
}

// --- Subscriptions ---
export interface Subscription {
  id: string;
  service: 'SMS Pro' | 'Hosting';
  planName: string;
  status: 'active' | 'expired' | 'pending_renewal';
  startDate: string; // ISO date
  endDate: string; // ISO date
  autoRenew: boolean;
  quantity: number; // e.g., seats, instances, lines
}
