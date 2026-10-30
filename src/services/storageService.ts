import {
  User,
  Video,
  Comment,
  Transaction,
  WithdrawalRequest,
  DailyActivity,
  NotificationItem,
  AppConfig
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'as_shorts_current_user',
  ALL_USERS: 'as_shorts_all_users',
  VIDEOS: 'as_shorts_videos',
  COMMENTS: 'as_shorts_comments',
  TRANSACTIONS: 'as_shorts_transactions',
  WITHDRAWALS: 'as_shorts_withdrawals',
  DAILY_ACTIVITY: 'as_shorts_daily_activity',
  NOTIFICATIONS: 'as_shorts_notifications',
  APP_CONFIG: 'as_shorts_app_config',
  DARK_MODE: 'as_shorts_dark_mode'
};

export const DEFAULT_CONFIG: AppConfig = {
  coinConversionRate: 5, // 5 Coins = 1 PKR
  minWithdrawalPKR: 500, // 500 PKR
  minWithdrawalCoins: 2500, // 2500 Coins
  dailyCheckInReward: 30, // 30 Coins
  adRewardCoins: 10, // 10 Coins
  videoWatchRewardCoins: 5, // 5 Coins
  referralRewardCoins: 200, // 200 Coins
  creatorRewardPer1000Views: 80, // 80 Coins
  maxDailyAds: 10, // Max 10 ads/day
  maxDailyVideos: 30, // Max 30 rewarded videos/day
  minVideoWatchSeconds: 10 // 10s watch requirement
};

// Seed authentic high-quality vertical videos with Pakistan themes
const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-cricket-in-a-field-42416-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80',
    title: 'Cover Drive Masterclass at Gaddafi Stadium 🏏🇵🇰',
    description: 'Practicing pure classic stroke play in Lahore! What is your favorite cricket shot? Watch till the end to earn coins! #PakistanCricket #BabarAzam #Lahore #TapeBallCricket #ShortsPK',
    hashtags: ['PakistanCricket', 'BabarAzam', 'Lahore', 'ShortsPK'],
    category: 'Cricket',
    creatorId: 'creator-1',
    creatorName: 'Hamza Khan',
    creatorUsername: 'hamzacricket_pk',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    creatorVerified: true,
    views: 18450,
    likes: 3420,
    shares: 412,
    commentsCount: 89,
    duration: 15,
    createdAt: '2026-10-28T14:20:00Z',
    musicTitle: 'Original Sound - PSL Anthem Beat 2026'
  },
  {
    id: 'vid-2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-a-dish-in-a-pan-42526-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    title: 'Secret Lahori Mutton Karahi at Burns Road Karachi 🔥🍲',
    description: 'Desi ghee, pure fresh tomatoes, and secret garma-garam masala! Best food street in Pakistan. #PakistaniFood #Karahi #KarachiFood #DesiKhana #FoodiePK',
    hashtags: ['PakistaniFood', 'Karahi', 'KarachiFood', 'FoodiePK'],
    category: 'Food',
    creatorId: 'creator-2',
    creatorName: 'Ayesha Food Diariez',
    creatorUsername: 'ayesha_eats_pk',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    creatorVerified: true,
    views: 45200,
    likes: 8910,
    shares: 1240,
    commentsCount: 234,
    duration: 18,
    createdAt: '2026-10-27T10:15:00Z',
    musicTitle: 'Desi Spice Beats - Traditional Rabab'
  },
  {
    id: 'vid-3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-mountain-valley-during-sunset-41793-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
    title: 'Passu Cones & Hunza Valley Aerial Sunset 🏔️✨',
    description: 'Heaven on Earth right here in Northern Pakistan! Karakoram Highway at golden hour. #HunzaValley #GilgitBaltistan #PakistanTourism #PassuCones #TravelPK',
    hashtags: ['HunzaValley', 'GilgitBaltistan', 'PakistanTourism', 'PassuCones'],
    category: 'Motivation',
    creatorId: 'creator-3',
    creatorName: 'Bilal Explorers',
    creatorUsername: 'bilal_travels_pk',
    creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    creatorVerified: true,
    views: 89100,
    likes: 19400,
    shares: 3820,
    commentsCount: 512,
    duration: 20,
    createdAt: '2026-10-26T16:45:00Z',
    musicTitle: 'Hunza Folk Flute - Calm Ambient'
  },
  {
    id: 'vid-4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-navigating-a-smartphone-41481-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    title: 'How to Earn Rs 5,000/Month from Home in Pakistan! 💸📱',
    description: 'Watch short videos on AS Shorts, invite your friends, and withdraw instant cash directly into your JazzCash or Easypaisa! 100% verified real earning. #OnlineEarning #JazzCash #Easypaisa #EarnMoneyPK',
    hashtags: ['OnlineEarning', 'JazzCash', 'Easypaisa', 'EarnMoneyPK'],
    category: 'Technology',
    creatorId: 'creator-4',
    creatorName: 'Zubair TechPK',
    creatorUsername: 'zubairtech_official',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorVerified: true,
    views: 120500,
    likes: 24300,
    shares: 9810,
    commentsCount: 1420,
    duration: 16,
    createdAt: '2026-10-25T08:00:00Z',
    musicTitle: 'Tech Vibes - AS Shorts Beat'
  },
  {
    id: 'vid-5',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-friends-laughing-together-outdoors-42861-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    title: 'Desi Rishta Interviews in 2026 be like... 😂🤦‍♂️',
    description: 'When aunty asks how many coins you have on AS Shorts app! Tag that friend who relates! #DesiMemes #PakistaniHumor #UrduComedy #FunnyReels #Shorts',
    hashtags: ['DesiMemes', 'PakistaniHumor', 'UrduComedy', 'Shorts'],
    category: 'Comedy',
    creatorId: 'creator-5',
    creatorName: 'Saad Comedy Vines',
    creatorUsername: 'saad_vines_pk',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creatorVerified: false,
    views: 64200,
    likes: 12890,
    shares: 4320,
    commentsCount: 680,
    duration: 14,
    createdAt: '2026-10-24T18:30:00Z',
    musicTitle: 'Funny Meme Sound FX - Viral Lahori'
  }
];

const INITIAL_USER: User = {
  id: 'usr-pak-01',
  username: 'as_earner_pk',
  fullName: 'Ali Raza',
  phone: '0304-1234567',
  email: 'as0193695@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Watch, Create & Earn daily on AS Shorts 🇵🇰 | Freelancer & Video Creator from Lahore',
  coins: 2850, // 2850 Coins = 570 PKR (qualifies for first minimum withdrawal test!)
  totalEarningsPKR: 570,
  referralCode: 'AS-PK9201',
  referredBy: null,
  isCreator: true,
  followersCount: 148,
  followingCount: 32,
  likesCount: 1240,
  role: 'user', // can toggle to 'admin'
  status: 'active',
  createdAt: '2026-10-01T10:00:00Z',
  channelName: 'Ali Raza Official',
  channelCover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80'
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    userId: 'usr-pak-01',
    type: 'referral_bonus',
    title: 'Referral Bonus: Tariq Aziz',
    description: 'Friend registered with your code AS-PK9201',
    coins: 200,
    pkrAmount: 40,
    status: 'completed',
    timestamp: '2026-10-29T11:20:00Z'
  },
  {
    id: 'txn-002',
    userId: 'usr-pak-01',
    type: 'daily_checkin',
    title: 'Day 3 Daily Check-in Streak',
    description: 'Earned 30 Coins for checking in today',
    coins: 30,
    pkrAmount: 6,
    status: 'completed',
    timestamp: '2026-10-29T09:15:00Z'
  },
  {
    id: 'txn-003',
    userId: 'usr-pak-01',
    type: 'rewarded_ad',
    title: 'Google AdMob Rewarded Ad #3',
    description: 'Successfully watched 15s sponsored ad',
    coins: 10,
    pkrAmount: 2,
    status: 'completed',
    timestamp: '2026-10-29T08:45:00Z'
  },
  {
    id: 'txn-004',
    userId: 'usr-pak-01',
    type: 'watch_video',
    title: 'Video Watch Reward: Passu Cones',
    description: 'Watched eligible short video for 10+ seconds',
    coins: 5,
    pkrAmount: 1,
    status: 'completed',
    timestamp: '2026-10-29T08:30:00Z'
  }
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wdr-pk-8812',
    userId: 'usr-pak-01',
    userName: 'Ali Raza',
    userPhone: '0304-1234567',
    method: 'JazzCash',
    accountNumber: '0304-1234567',
    accountTitle: 'Ali Raza',
    pkrAmount: 500,
    coinsDeducted: 2500,
    status: 'paid',
    requestedAt: '2026-10-20T14:30:00Z',
    processedAt: '2026-10-21T10:15:00Z',
    transactionRef: 'JC-PK-98124982',
    adminNotes: 'Transferred successfully via JazzCash Corporate Merchant Portal'
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    videoId: 'vid-1',
    userId: 'usr-demo-2',
    userName: 'Kashif Mehmood',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    text: 'Mashallah best cover drive like Babar Azam! Proud of Pakistani youth ❤️🏏',
    likes: 19,
    createdAt: '2026-10-28T15:00:00Z'
  },
  {
    id: 'c-2',
    videoId: 'vid-1',
    userId: 'usr-demo-3',
    userName: 'Zainab Bibi',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    text: 'Watching this gave me 5 coins! Great app for Pakistan!',
    likes: 7,
    createdAt: '2026-10-28T16:10:00Z'
  },
  {
    id: 'c-3',
    videoId: 'vid-2',
    userId: 'usr-demo-4',
    userName: 'Farhan Ali',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    text: 'Burns Road Karachi ki karahi ka koi muqabla nahi hai bhai!',
    likes: 31,
    createdAt: '2026-10-27T12:00:00Z'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-pak-01',
    title: 'Withdrawal of 500 PKR Completed!',
    message: 'Your JazzCash withdrawal (Ref: JC-PK-98124982) was sent to 0304-1234567.',
    type: 'withdrawal',
    read: false,
    timestamp: '2026-10-21T10:16:00Z'
  },
  {
    id: 'notif-2',
    userId: 'usr-pak-01',
    title: 'Daily Check-in Bonus Ready! 🎁',
    message: 'Claim your 30 coins today and keep your streak alive.',
    type: 'reward',
    read: false,
    timestamp: '2026-10-29T08:00:00Z'
  },
  {
    id: 'notif-3',
    userId: 'usr-pak-01',
    title: 'Welcome to AS Shorts Pakistan! 🇵🇰',
    message: 'Watch videos, upload content, and earn real money with JazzCash & Easypaisa.',
    type: 'system',
    read: true,
    timestamp: '2026-10-01T10:00:00Z'
  }
];

class StorageService {
  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Current User
  getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      this.saveCurrentUser(INITIAL_USER);
      return INITIAL_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USER;
    }
  }

  saveCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    // also sync in all users array
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  }

  getAllUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (!raw) {
      const initial = [
        INITIAL_USER,
        {
          id: 'usr-pak-02',
          username: 'bilal_travels_pk',
          fullName: 'Bilal Ahmed',
          phone: '0312-9876543',
          email: 'bilal.travels@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          bio: 'Exploring Pakistan northern areas & drone photography',
          coins: 14200,
          totalEarningsPKR: 2840,
          referralCode: 'AS-PK7711',
          referredBy: null,
          isCreator: true,
          followersCount: 8900,
          followingCount: 45,
          likesCount: 94000,
          role: 'user',
          status: 'active',
          createdAt: '2026-09-12T00:00:00Z'
        },
        {
          id: 'usr-pak-03',
          username: 'ayesha_eats_pk',
          fullName: 'Ayesha Siddiqui',
          phone: '0333-5551234',
          email: 'ayesha.food@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          bio: 'Pakistani food blogger & home recipes',
          coins: 8400,
          totalEarningsPKR: 1680,
          referralCode: 'AS-PK3322',
          referredBy: null,
          isCreator: true,
          followersCount: 5200,
          followingCount: 120,
          likesCount: 42000,
          role: 'user',
          status: 'active',
          createdAt: '2026-09-20T00:00:00Z'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(initial));
      return initial as User[];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // Videos
  getVideos(): Video[] {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
      return INITIAL_VIDEOS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_VIDEOS;
    }
  }

  saveVideos(videos: Video[]): void {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  }

  addVideo(video: Video): void {
    const videos = this.getVideos();
    videos.unshift(video);
    this.saveVideos(videos);
  }

  toggleLikeVideo(videoId: string, userId: string): { isLiked: boolean; likes: number } {
    const videos = this.getVideos();
    const video = videos.find(v => v.id === videoId);
    if (!video) return { isLiked: false, likes: 0 };

    const wasLiked = !!video.isLiked;
    video.isLiked = !wasLiked;
    video.likes = wasLiked ? Math.max(0, video.likes - 1) : video.likes + 1;
    this.saveVideos(videos);
    return { isLiked: video.isLiked, likes: video.likes };
  }

  incrementVideoViews(videoId: string): number {
    const videos = this.getVideos();
    const video = videos.find(v => v.id === videoId);
    if (!video) return 0;
    video.views += 1;
    this.saveVideos(videos);
    return video.views;
  }

  // Comments
  getComments(videoId: string): Comment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    let allComments: Comment[] = INITIAL_COMMENTS;
    if (raw) {
      try {
        allComments = JSON.parse(raw);
      } catch {
        allComments = INITIAL_COMMENTS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    }
    return allComments.filter(c => c.videoId === videoId);
  }

  addComment(comment: Comment): void {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    let allComments: Comment[] = raw ? JSON.parse(raw) : INITIAL_COMMENTS;
    allComments.unshift(comment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));

    // Update video commentsCount
    const videos = this.getVideos();
    const video = videos.find(v => v.id === comment.videoId);
    if (video) {
      video.commentsCount += 1;
      this.saveVideos(videos);
    }
  }

  // Daily Activity & Anti-Fraud Tracker
  getDailyActivity(): DailyActivity {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
    const today = this.getTodayDateString();

    if (!raw) {
      const initial: DailyActivity = {
        lastCheckInDate: null,
        checkInStreak: 0,
        adsWatchedToday: 0,
        videosWatchedToday: 0,
        rewardedVideoIds: [],
        lastActiveDate: today
      };
      localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(initial));
      return initial;
    }

    try {
      const activity: DailyActivity = JSON.parse(raw);
      // Reset daily counts if day has changed
      if (activity.lastActiveDate !== today) {
        activity.adsWatchedToday = 0;
        activity.videosWatchedToday = 0;
        activity.rewardedVideoIds = [];
        activity.lastActiveDate = today;
        localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(activity));
      }
      return activity;
    } catch {
      return {
        lastCheckInDate: null,
        checkInStreak: 0,
        adsWatchedToday: 0,
        videosWatchedToday: 0,
        rewardedVideoIds: [],
        lastActiveDate: today
      };
    }
  }

  saveDailyActivity(activity: DailyActivity): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(activity));
  }

  // EARNING ACTION 1: Daily Check-in (30 Coins)
  claimDailyCheckin(userId: string): { success: boolean; message: string; coinsEarned: number; newStreak: number } {
    const activity = this.getDailyActivity();
    const today = this.getTodayDateString();
    const config = this.getAppConfig();

    if (activity.lastCheckInDate === today) {
      return {
        success: false,
        message: 'You have already claimed today\'s check-in bonus! Please return tomorrow.',
        coinsEarned: 0,
        newStreak: activity.checkInStreak
      };
    }

    // Check if streak is continuous
    let streak = activity.checkInStreak;
    if (activity.lastCheckInDate) {
      const lastDate = new Date(activity.lastCheckInDate);
      const currDate = new Date(today);
      const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    activity.lastCheckInDate = today;
    activity.checkInStreak = streak;
    this.saveDailyActivity(activity);

    const coins = config.dailyCheckInReward;
    this.addCoins(
      userId,
      coins,
      'daily_checkin',
      `Day ${streak} Daily Check-in Streak`,
      `Successfully claimed 30 daily bonus coins for Day ${streak}`
    );

    return {
      success: true,
      message: `🎉 Mubarakan! You claimed 30 Coins (Day ${streak} Streak)`,
      coinsEarned: coins,
      newStreak: streak
    };
  }

  // EARNING ACTION 2: Watch Rewarded Ad (10 Coins, max 10/day)
  claimAdReward(userId: string): { success: boolean; message: string; coinsEarned: number; remainingAds: number } {
    const activity = this.getDailyActivity();
    const config = this.getAppConfig();

    if (activity.adsWatchedToday >= config.maxDailyAds) {
      return {
        success: false,
        message: `Daily limit reached! You have already watched ${config.maxDailyAds}/${config.maxDailyAds} rewarded ads today.`,
        coinsEarned: 0,
        remainingAds: 0
      };
    }

    activity.adsWatchedToday += 1;
    this.saveDailyActivity(activity);

    const coins = config.adRewardCoins;
    this.addCoins(
      userId,
      coins,
      'rewarded_ad',
      `AdMob Rewarded Ad #${activity.adsWatchedToday}`,
      'Completed verified 15s rewarded video ad'
    );

    return {
      success: true,
      message: `🎉 Great! 10 Coins added! (${activity.adsWatchedToday}/${config.maxDailyAds} ads completed today)`,
      coinsEarned: coins,
      remainingAds: config.maxDailyAds - activity.adsWatchedToday
    };
  }

  // EARNING ACTION 3: Watch Short Video (5 Coins, max 30/day)
  claimVideoWatchReward(userId: string, videoId: string, watchSeconds: number): { success: boolean; message: string; coinsEarned: number } {
    const activity = this.getDailyActivity();
    const config = this.getAppConfig();

    if (watchSeconds < config.minVideoWatchSeconds) {
      return {
        success: false,
        message: `Watch at least ${config.minVideoWatchSeconds} seconds to qualify for coin rewards.`,
        coinsEarned: 0
      };
    }

    if (activity.videosWatchedToday >= config.maxDailyVideos) {
      return {
        success: false,
        message: `Daily video reward cap reached (${config.maxDailyVideos}/${config.maxDailyVideos} videos). You can still enjoy watching!`,
        coinsEarned: 0
      };
    }

    if (activity.rewardedVideoIds.includes(videoId)) {
      return {
        success: false,
        message: 'You have already collected reward coins for this video today.',
        coinsEarned: 0
      };
    }

    activity.videosWatchedToday += 1;
    activity.rewardedVideoIds.push(videoId);
    this.saveDailyActivity(activity);

    const coins = config.videoWatchRewardCoins;
    this.addCoins(
      userId,
      coins,
      'watch_video',
      'Short Video Watch Reward',
      `Watched video (${activity.videosWatchedToday}/${config.maxDailyVideos} today)`
    );

    return {
      success: true,
      message: `+${coins} Coins earned! (${activity.videosWatchedToday}/${config.maxDailyVideos} rewarded videos today)`,
      coinsEarned: coins
    };
  }

  // EARNING ACTION 4: Apply Referral Code (200 Coins)
  applyReferralCode(currentUserId: string, referralCode: string): { success: boolean; message: string } {
    const currentUser = this.getCurrentUser();
    const config = this.getAppConfig();

    if (currentUser.referredBy) {
      return { success: false, message: 'You have already applied a referral code previously.' };
    }

    if (currentUser.referralCode === referralCode.trim().toUpperCase()) {
      return { success: false, message: 'Self-referral is prohibited by anti-fraud policy.' };
    }

    const allUsers = this.getAllUsers();
    const referrer = allUsers.find(u => u.referralCode.toUpperCase() === referralCode.trim().toUpperCase());

    if (!referrer) {
      return { success: false, message: 'Invalid referral code. Please check and try again.' };
    }

    // Award currentUser
    currentUser.referredBy = referrer.id;
    currentUser.coins += config.referralRewardCoins;
    currentUser.totalEarningsPKR += Math.floor(config.referralRewardCoins / config.coinConversionRate);
    this.saveCurrentUser(currentUser);

    this.addTransaction({
      id: `txn-ref-${Date.now()}`,
      userId: currentUser.id,
      type: 'referral_bonus',
      title: 'Welcome Referral Bonus',
      description: `Invited by ${referrer.fullName} (${referrer.referralCode})`,
      coins: config.referralRewardCoins,
      pkrAmount: config.referralRewardCoins / config.coinConversionRate,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    // Award referrer
    referrer.coins += config.referralRewardCoins;
    referrer.totalEarningsPKR += Math.floor(config.referralRewardCoins / config.coinConversionRate);
    const users = this.getAllUsers();
    const refIdx = users.findIndex(u => u.id === referrer.id);
    if (refIdx >= 0) users[refIdx] = referrer;
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));

    this.addTransaction({
      id: `txn-ref-earner-${Date.now()}`,
      userId: referrer.id,
      type: 'referral_bonus',
      title: 'Friend Joined: 200 Coins',
      description: `${currentUser.fullName} registered using your referral code`,
      coins: config.referralRewardCoins,
      pkrAmount: config.referralRewardCoins / config.coinConversionRate,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    this.addNotification({
      id: `notif-ref-${Date.now()}`,
      userId: referrer.id,
      title: '🎉 Referral Bonus: +200 Coins!',
      message: `${currentUser.fullName} joined using your code. 200 Coins added to your wallet!`,
      type: 'reward',
      read: false,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: `🎉 Success! +${config.referralRewardCoins} Coins credited for joining via ${referrer.fullName}'s referral.`
    };
  }

  // Atomic Coin Balance modifier
  private addCoins(userId: string, amount: number, type: any, title: string, description: string): void {
    const user = this.getCurrentUser();
    const config = this.getAppConfig();
    user.coins += amount;
    if (amount > 0) {
      user.totalEarningsPKR += Math.floor(amount / config.coinConversionRate);
    }
    this.saveCurrentUser(user);

    this.addTransaction({
      id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      type,
      title,
      description,
      coins: amount,
      pkrAmount: Math.abs(amount) / config.coinConversionRate,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
  }

  // WITHDRAWALS
  getWithdrawals(): WithdrawalRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(INITIAL_WITHDRAWALS));
      return INITIAL_WITHDRAWALS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_WITHDRAWALS;
    }
  }

  saveWithdrawals(withdrawals: WithdrawalRequest[]): void {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }

  requestWithdrawal(
    method: 'JazzCash' | 'Easypaisa',
    accountNumber: string,
    accountTitle: string,
    pkrAmount: number
  ): { success: boolean; message: string; withdrawal?: WithdrawalRequest } {
    const user = this.getCurrentUser();
    const config = this.getAppConfig();
    const requiredCoins = pkrAmount * config.coinConversionRate;

    // Minimum check
    if (pkrAmount < config.minWithdrawalPKR) {
      return {
        success: false,
        message: `Minimum withdrawal amount is ${config.minWithdrawalPKR} PKR (${config.minWithdrawalCoins} Coins).`
      };
    }

    // Balance check
    if (user.coins < requiredCoins) {
      return {
        success: false,
        message: `Insufficient balance! You need ${requiredCoins} Coins for ${pkrAmount} PKR, but you only have ${user.coins} Coins.`
      };
    }

    // Account validation (Pakistani phone format: 03XX-XXXXXXX or 03XXXXXXXXX)
    const cleanedPhone = accountNumber.replace(/[\s-]/g, '');
    const pakPhoneRegex = /^03[0-9]{9}$/;
    if (!pakPhoneRegex.test(cleanedPhone)) {
      return {
        success: false,
        message: 'Invalid Pakistani mobile account number! Must be 11 digits starting with 03 (e.g. 0300-1234567).'
      };
    }

    if (!accountTitle || accountTitle.trim().length < 3) {
      return {
        success: false,
        message: 'Please provide the exact Account Holder Name registered with ' + method + '.'
      };
    }

    // Check for duplicate pending requests
    const existing = this.getWithdrawals();
    const hasPending = existing.some(
      w => w.userId === user.id && (w.status === 'pending' || w.status === 'under_review' || w.status === 'processing')
    );
    if (hasPending) {
      return {
        success: false,
        message: 'You already have an active withdrawal request under review. Please wait for it to be processed.'
      };
    }

    // Deduct coins securely
    user.coins -= requiredCoins;
    this.saveCurrentUser(user);

    const withdrawal: WithdrawalRequest = {
      id: `WDR-PK-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: cleanedPhone,
      method,
      accountNumber: cleanedPhone,
      accountTitle: accountTitle.trim(),
      pkrAmount,
      coinsDeducted: requiredCoins,
      status: 'under_review',
      requestedAt: new Date().toISOString()
    };

    existing.unshift(withdrawal);
    this.saveWithdrawals(existing);

    // Record debit transaction
    this.addTransaction({
      id: `txn-wdr-${Date.now()}`,
      userId: user.id,
      type: 'withdrawal',
      title: `${method} Withdrawal Request`,
      description: `Withdrawn to ${accountTitle} (${cleanedPhone})`,
      coins: -requiredCoins,
      pkrAmount,
      status: 'pending',
      timestamp: new Date().toISOString(),
      referenceId: withdrawal.id
    });

    this.addNotification({
      id: `notif-wdr-${Date.now()}`,
      userId: user.id,
      title: 'Withdrawal Request Submitted',
      message: `Your request for ${pkrAmount} PKR via ${method} is now Under Review.`,
      type: 'withdrawal',
      read: false,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Your Withdrawal Request Has Been Submitted Successfully! Your request is under review.',
      withdrawal
    };
  }

  // Admin action: Process Withdrawal
  updateWithdrawalStatus(
    withdrawalId: string,
    newStatus: 'approved' | 'processing' | 'paid' | 'rejected',
    referenceId?: string,
    rejectionReason?: string
  ): boolean {
    const list = this.getWithdrawals();
    const req = list.find(w => w.id === withdrawalId);
    if (!req) return false;

    req.status = newStatus;
    req.processedAt = new Date().toISOString();
    if (referenceId) req.transactionRef = referenceId;
    if (rejectionReason) req.rejectionReason = rejectionReason;

    // If rejected, refund the coins back to user
    if (newStatus === 'rejected') {
      const allUsers = this.getAllUsers();
      const targetUser = allUsers.find(u => u.id === req.userId);
      if (targetUser) {
        targetUser.coins += req.coinsDeducted;
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
        if (targetUser.id === this.getCurrentUser().id) {
          this.saveCurrentUser(targetUser);
        }
      }
      this.addTransaction({
        id: `txn-refund-${Date.now()}`,
        userId: req.userId,
        type: 'admin_adjustment',
        title: 'Withdrawal Refund',
        description: `Refund for rejected request ${req.id}: ${rejectionReason || 'Details mismatch'}`,
        coins: req.coinsDeducted,
        pkrAmount: req.pkrAmount,
        status: 'completed',
        timestamp: new Date().toISOString()
      });
    }

    this.saveWithdrawals(list);

    // Send notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: req.userId,
      title: newStatus === 'paid' ? `Payment Sent via ${req.method}!` : `Withdrawal ${newStatus.toUpperCase()}`,
      message: newStatus === 'paid'
        ? `Rs ${req.pkrAmount} has been sent to ${req.accountNumber}. Reference: ${referenceId || 'N/A'}`
        : newStatus === 'rejected'
        ? `Your withdrawal was rejected: ${rejectionReason || 'Please check your account details.'}. Coins refunded.`
        : `Your withdrawal of Rs ${req.pkrAmount} status updated to ${newStatus}.`,
      type: 'withdrawal',
      read: false,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  // TRANSACTIONS
  getTransactions(userId?: string): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    let list: Transaction[] = INITIAL_TRANSACTIONS;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_TRANSACTIONS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    }
    if (userId) {
      return list.filter(t => t.userId === userId);
    }
    return list;
  }

  addTransaction(txn: Transaction): void {
    const list = this.getTransactions();
    list.unshift(txn);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
  }

  // NOTIFICATIONS
  getNotifications(userId: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let list: NotificationItem[] = INITIAL_NOTIFICATIONS;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_NOTIFICATIONS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    return list.filter(n => n.userId === userId);
  }

  addNotification(notif: NotificationItem): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let list: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  markAllNotificationsRead(userId: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return;
    const list: NotificationItem[] = JSON.parse(raw);
    list.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  // APP CONFIG (Admin managed)
  getAppConfig(): AppConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  saveAppConfig(config: AppConfig): void {
    localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(config));
  }

  // Dark Mode
  getDarkMode(): boolean {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved === null) return true; // Default dark mode for TikTok-style video reels
    return saved === 'true';
  }

  saveDarkMode(isDark: boolean): void {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDark));
  }
}

export const storageService = new StorageService();
