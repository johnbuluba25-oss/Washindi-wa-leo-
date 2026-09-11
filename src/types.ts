export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Package {
  id: string;
  code: 'ODDS_5' | 'ODDS_10' | 'ODDS_15' | 'ODDS_20' | 'WIKI' | 'MWEZI';
  name: string;
  price: number; // in TZS
  durationDays: number;
  durationLabel: string;
  description: string;
  highlight?: string;
  badge?: string;
  targetOdds: string;
  confidenceRate: number;
  active: boolean;
}

export type PredictionStatus = 'PENDING' | 'ACTIVE' | 'WON' | 'LOST' | 'VOID';
export type PredictionCategory = 'FREE' | 'ODDS_5' | 'ODDS_10' | 'ODDS_15' | 'ODDS_20' | 'WIKI' | 'MWEZI';

export interface Prediction {
  id: string;
  league: string;
  match: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string; // ISO string
  prediction: string;
  odds: number;
  confidence: number; // percentage e.g. 92
  status: PredictionStatus;
  category: PredictionCategory;
  resultScore?: string;
  wonOdds?: number;
  analysis?: string;
  slipCode?: string;
  isLocked?: boolean; // Set server-side if user doesn't have VIP access
}

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  packageId: string;
  packageCode: string;
  packageName: string;
  amount: number;
  transactionId: string; // M-Pesa / Tigo Pesa reference number
  paymentMethod: string;
  status: PaymentStatus;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  expiresAt?: string;
}

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  packageCode: string;
  packageName: string;
  paymentId: string;
  startedAt: string;
  expiresAt: string;
  status: SubscriptionStatus;
  remainingSeconds?: number;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  order: number;
  badgeText?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED' | 'SYSTEM' | 'TIP_WON';
  read: boolean;
  createdAt: string;
}

export interface AppSettings {
  supportPhone: string;
  whatsappGroupUrl: string;
  mpesaRecipientName: string;
  siteNotice: string;
  adminContactEmail: string;
}

export interface AdminStats {
  totalSalesTzs: number;
  pendingPaymentsCount: number;
  approvedPaymentsCount: number;
  activeVipUsersCount: number;
  totalUsersCount: number;
  totalPredictionsCount: number;
  winRatePercentage: number;
}
