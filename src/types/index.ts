export type PaymentMethod = 'JazzCash' | 'Easypaisa';

export type WithdrawalStatus = 
  | 'pending' 
  | 'under_review' 
  | 'approved' 
  | 'processing' 
  | 'paid' 
  | 'rejected';

export type TransactionType =
  | 'daily_checkin'
  | 'rewarded_ad'
  | 'watch_video'
  | 'creator_reward'
  | 'referral_bonus'
  | 'withdrawal'
  | 'admin_adjustment';

export interface User {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  bio: string;
  coins: number;
  totalEarningsPKR: number;
  referralCode: string;
  referredBy: string | null;
  isCreator: boolean;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  channelName?: string;
  channelCover?: string;
}

export interface Video {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  hashtags: string[];
  category: 'Entertainment' | 'Cricket' | 'Comedy' | 'Food' | 'Technology' | 'Motivation' | 'Music';
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorVerified: boolean;
  views: number;
  likes: number;
  shares: number;
  commentsCount: number;
  duration: number; // in seconds
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  createdAt: string;
  musicTitle: string;
  reported?: boolean;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  title: string;
  description: string;
  coins: number; // positive for earn, negative for spend
  pkrAmount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  referenceId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  method: PaymentMethod;
  accountNumber: string; // Pakistani 03XX-XXXXXXX format
  accountTitle: string;
  pkrAmount: number;
  coinsDeducted: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
  transactionRef?: string;
  adminNotes?: string;
}

export interface DailyActivity {
  lastCheckInDate: string | null;
  checkInStreak: number;
  adsWatchedToday: number;
  videosWatchedToday: number;
  rewardedVideoIds: string[];
  lastActiveDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reward' | 'withdrawal' | 'social' | 'system';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface AppConfig {
  coinConversionRate: number; // default 5 (5 Coins = 1 PKR)
  minWithdrawalPKR: number; // default 500 PKR
  minWithdrawalCoins: number; // default 2500 Coins
  dailyCheckInReward: number; // default 30 Coins
  adRewardCoins: number; // default 10 Coins
  videoWatchRewardCoins: number; // default 5 Coins
  referralRewardCoins: number; // default 200 Coins
  creatorRewardPer1000Views: number; // default 80 Coins
  maxDailyAds: number; // default 10
  maxDailyVideos: number; // default 30
  minVideoWatchSeconds: number; // default 10 seconds
}
