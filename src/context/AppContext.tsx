import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Video,
  Comment,
  Transaction,
  WithdrawalRequest,
  DailyActivity,
  NotificationItem,
  AppConfig,
  PaymentMethod,
  WithdrawalStatus
} from '../types';
import { storageService, DEFAULT_CONFIG } from '../services/storageService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'coin';
  coins?: number;
}

interface AppContextType {
  user: User;
  setUser: (u: User) => void;
  videos: Video[];
  activeTab: 'home' | 'earn' | 'create' | 'following' | 'profile' | 'wallet';
  setActiveTab: (tab: 'home' | 'earn' | 'create' | 'following' | 'profile' | 'wallet') => void;
  feedFilter: 'trending' | 'recent' | 'following';
  setFeedFilter: (f: 'trending' | 'recent' | 'following') => void;
  dailyActivity: DailyActivity;
  config: AppConfig;
  updateConfig: (newConfig: AppConfig) => void;
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  selectedChannelUser: User | null;
  setSelectedChannelUser: (u: User | null) => void;
  activeVideoIndex: number;
  setActiveVideoIndex: (idx: number) => void;
  toast: ToastMessage | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'coin', coins?: number) => void;
  
  // Actions
  claimDailyCheckin: () => boolean;
  claimAdReward: () => boolean;
  claimVideoWatchReward: (videoId: string, seconds: number) => boolean;
  applyReferralCode: (code: string) => boolean;
  requestWithdrawal: (method: PaymentMethod, phone: string, title: string, amount: number) => boolean;
  adminProcessWithdrawal: (id: string, status: 'approved' | 'processing' | 'paid' | 'rejected', refId?: string, reason?: string) => boolean;
  toggleLikeVideo: (videoId: string) => void;
  addComment: (videoId: string, text: string) => void;
  getCommentsForVideo: (videoId: string) => Comment[];
  uploadVideo: (video: Omit<Video, 'id' | 'views' | 'likes' | 'shares' | 'commentsCount' | 'createdAt'>) => void;
  deleteVideo: (videoId: string) => void;
  toggleFollowUser: (creatorId: string) => void;
  markNotificationsAsRead: () => void;
  refreshData: () => void;
  // Auth flow
  switchUser: (role: 'user' | 'admin') => void;
  updateProfile: (data: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => storageService.getCurrentUser());
  const [videos, setVideos] = useState<Video[]>(() => storageService.getVideos());
  const [activeTab, setActiveTab] = useState<'home' | 'earn' | 'create' | 'following' | 'profile' | 'wallet'>('home');
  const [feedFilter, setFeedFilter] = useState<'trending' | 'recent' | 'following'>('trending');
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>(() => storageService.getDailyActivity());
  const [config, setConfig] = useState<AppConfig>(() => storageService.getAppConfig());
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getTransactions());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => storageService.getWithdrawals());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.getNotifications(user.id));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => storageService.getDarkMode());
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [selectedChannelUser, setSelectedChannelUser] = useState<User | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    // Sync dark mode class on HTML document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storageService.saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'coin' = 'info', coins?: number) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(),
      message,
      type,
      coins
    };
    setToast(newToast);
    setTimeout(() => {
      setToast(prev => (prev?.id === newToast.id ? null : prev));
    }, 3800);
  };

  const refreshData = () => {
    const updatedUser = storageService.getCurrentUser();
    setUser(updatedUser);
    setVideos(storageService.getVideos());
    setDailyActivity(storageService.getDailyActivity());
    setConfig(storageService.getAppConfig());
    setTransactions(storageService.getTransactions(updatedUser.id));
    setWithdrawals(storageService.getWithdrawals());
    setNotifications(storageService.getNotifications(updatedUser.id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const updateConfig = (newConfig: AppConfig) => {
    storageService.saveAppConfig(newConfig);
    setConfig(newConfig);
    showToast('App configuration updated successfully!', 'success');
  };

  const claimDailyCheckin = (): boolean => {
    const res = storageService.claimDailyCheckin(user.id);
    refreshData();
    if (res.success) {
      showToast(res.message, 'coin', res.coinsEarned);
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const claimAdReward = (): boolean => {
    const res = storageService.claimAdReward(user.id);
    refreshData();
    if (res.success) {
      showToast(res.message, 'coin', res.coinsEarned);
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const claimVideoWatchReward = (videoId: string, seconds: number): boolean => {
    const res = storageService.claimVideoWatchReward(user.id, videoId, seconds);
    if (res.success) {
      refreshData();
      showToast(res.message, 'coin', res.coinsEarned);
      return true;
    }
    return false;
  };

  const applyReferralCode = (code: string): boolean => {
    const res = storageService.applyReferralCode(user.id, code);
    refreshData();
    if (res.success) {
      showToast(res.message, 'coin', config.referralRewardCoins);
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const requestWithdrawal = (
    method: PaymentMethod,
    phone: string,
    title: string,
    amount: number
  ): boolean => {
    const res = storageService.requestWithdrawal(method, phone, title, amount);
    refreshData();
    if (res.success) {
      showToast(res.message, 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const adminProcessWithdrawal = (
    id: string,
    status: 'approved' | 'processing' | 'paid' | 'rejected',
    refId?: string,
    reason?: string
  ): boolean => {
    const ok = storageService.updateWithdrawalStatus(id, status, refId, reason);
    refreshData();
    if (ok) {
      showToast(`Withdrawal #${id} marked as ${status.toUpperCase()}!`, 'success');
      return true;
    } else {
      showToast('Failed to update withdrawal status', 'error');
      return false;
    }
  };

  const toggleLikeVideo = (videoId: string) => {
    const res = storageService.toggleLikeVideo(videoId, user.id);
    setVideos(prev =>
      prev.map(v => (v.id === videoId ? { ...v, isLiked: res.isLiked, likes: res.likes } : v))
    );
  };

  const addComment = (videoId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      videoId,
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.avatar,
      text: text.trim(),
      likes: 0,
      createdAt: new Date().toISOString()
    };
    storageService.addComment(newComment);
    refreshData();
    showToast('Comment posted!', 'success');
  };

  const getCommentsForVideo = (videoId: string): Comment[] => {
    return storageService.getComments(videoId);
  };

  const uploadVideo = (
    videoData: Omit<Video, 'id' | 'views' | 'likes' | 'shares' | 'commentsCount' | 'createdAt'>
  ) => {
    const newVideo: Video = {
      ...videoData,
      id: `vid-pk-${Date.now()}`,
      views: 1,
      likes: 0,
      shares: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    storageService.addVideo(newVideo);
    refreshData();
    showToast('🎉 Your video was uploaded successfully to AS Shorts!', 'success');
    setActiveTab('home');
  };

  const deleteVideo = (videoId: string) => {
    const currentVideos = storageService.getVideos();
    const updated = currentVideos.filter(v => v.id !== videoId);
    storageService.saveVideos(updated);
    refreshData();
    showToast('Video removed', 'info');
  };

  const toggleFollowUser = (creatorId: string) => {
    setVideos(prev =>
      prev.map(v => (v.creatorId === creatorId ? { ...v, isFollowing: !v.isFollowing } : v))
    );
    showToast('Follow status updated!', 'info');
  };

  const markNotificationsAsRead = () => {
    storageService.markAllNotificationsRead(user.id);
    refreshData();
  };

  const switchUser = (role: 'user' | 'admin') => {
    const u = storageService.getCurrentUser();
    u.role = role;
    storageService.saveCurrentUser(u);
    setUser(u);
    setIsAdminMode(role === 'admin');
    showToast(`Switched to ${role.toUpperCase()} mode`, 'info');
  };

  const updateProfile = (data: Partial<User>) => {
    const updated = { ...user, ...data };
    storageService.saveCurrentUser(updated);
    setUser(updated);
    showToast('Profile updated!', 'success');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        videos,
        activeTab,
        setActiveTab,
        feedFilter,
        setFeedFilter,
        dailyActivity,
        config,
        updateConfig,
        transactions,
        withdrawals,
        notifications,
        unreadNotifsCount,
        isDarkMode,
        toggleDarkMode,
        isAdminMode,
        setIsAdminMode,
        selectedChannelUser,
        setSelectedChannelUser,
        activeVideoIndex,
        setActiveVideoIndex,
        toast,
        showToast,
        claimDailyCheckin,
        claimAdReward,
        claimVideoWatchReward,
        applyReferralCode,
        requestWithdrawal,
        adminProcessWithdrawal,
        toggleLikeVideo,
        addComment,
        getCommentsForVideo,
        uploadVideo,
        deleteVideo,
        toggleFollowUser,
        markNotificationsAsRead,
        refreshData,
        switchUser,
        updateProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
