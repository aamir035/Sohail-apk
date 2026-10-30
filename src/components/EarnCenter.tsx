import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Tv, 
  PlayCircle, 
  Video as VideoIcon, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Coins, 
  ArrowRight, 
  Flame, 
  TrendingUp, 
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface EarnCenterProps {
  onOpenAdModal: () => void;
  onOpenCreate: () => void;
}

export const EarnCenter: React.FC<EarnCenterProps> = ({ onOpenAdModal, onOpenCreate }) => {
  const { 
    user, 
    dailyActivity, 
    config, 
    claimDailyCheckin, 
    applyReferralCode, 
    setActiveTab, 
    showToast 
  } = useApp();

  const [inputReferral, setInputReferral] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isCheckedInToday = dailyActivity.lastCheckInDate === todayStr;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    showToast(`Referral code ${user.referralCode} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🇵🇰 Watch short videos and earn real money on AS Shorts Pakistan! Withdraw directly to JazzCash & Easypaisa. Use my referral code ${user.referralCode} to get 200 free coins bonus! Download/Join: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleApplyReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputReferral.trim()) return;
    applyReferralCode(inputReferral.trim());
    setInputReferral('');
  };

  // 7-day streak mock schedule
  const streakDays = [
    { day: 1, reward: 30 },
    { day: 2, reward: 30 },
    { day: 3, reward: 35 },
    { day: 4, reward: 40 },
    { day: 5, reward: 50 },
    { day: 6, reward: 60 },
    { day: 7, reward: 100 }
  ];

  const pkrBalance = Math.floor(user.coins / config.coinConversionRate);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 pb-24 space-y-6">
      {/* Header Banner: Earning Center */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border border-emerald-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Rewards Center 🇵🇰</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Watch, Complete Tasks & Earn
            </h1>
            <p className="text-xs text-slate-300">
              All earned coins convert to Pakistani Rupees (5 Coins = 1 PKR).
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-slate-700/80 flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-400">Your Coin Balance</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-black text-yellow-400">{user.coins.toLocaleString()}</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">≈ Rs {pkrBalance.toLocaleString()} PKR</span>
          </div>
        </div>
      </div>

      {/* TASK A: Daily Check-in */}
      <div className="rounded-3xl p-5 bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Calendar className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Daily Check-in
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  +30 Coins
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Claim free coins once every 24 hours. Keep your streak alive!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-rose-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{dailyActivity.checkInStreak} Days Streak</span>
          </div>
        </div>

        {/* 7-day Visual Streak Tracker */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
          {streakDays.map((item) => {
            const isCompleted = item.day <= dailyActivity.checkInStreak;
            const isCurrent = item.day === dailyActivity.checkInStreak + 1;
            return (
              <div
                key={item.day}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : isCurrent
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 ring-1 ring-yellow-400/50'
                    : 'bg-slate-800/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold">Day {item.day}</span>
                <Coins className={`w-3.5 h-3.5 my-1 ${isCompleted ? 'text-emerald-400' : 'text-yellow-400'}`} />
                <span className="text-[10px] font-extrabold">+{item.reward}</span>
              </div>
            );
          })}
        </div>

        {/* Check-in Button */}
        <button
          disabled={isCheckedInToday}
          onClick={claimDailyCheckin}
          className={`w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
            isCheckedInToday
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-yellow-500/20 cursor-pointer'
          }`}
        >
          {isCheckedInToday ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Checked in Today! (Come back tomorrow)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Claim Today's 30 Coins</span>
            </>
          )}
        </button>
      </div>

      {/* TASK B: Watch Rewarded Ads (AdMob) */}
      <div className="rounded-3xl p-5 bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Tv className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Watch Rewarded Ads
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  +10 Coins / Ad
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official Google AdMob Rewarded Ads. Max 10 ads daily.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-white">
              {dailyActivity.adsWatchedToday} / {config.maxDailyAds}
            </span>
            <p className="text-[10px] text-slate-400">Completed today</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(dailyActivity.adsWatchedToday / config.maxDailyAds) * 100}%` }}
          />
        </div>

        <button
          disabled={dailyActivity.adsWatchedToday >= config.maxDailyAds}
          onClick={onOpenAdModal}
          className={`w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
            dailyActivity.adsWatchedToday >= config.maxDailyAds
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
              : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-rose-600/20 cursor-pointer'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>
            {dailyActivity.adsWatchedToday >= config.maxDailyAds
              ? 'Daily Ad Limit Reached (10/10)'
              : 'Watch Ad Now (+10 Coins)'}
          </span>
        </button>
      </div>

      {/* TASK C: Watch Short Videos */}
      <div className="rounded-3xl p-5 bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <PlayCircle className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Watch Short Videos
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  +5 Coins / Video
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Watch at least 10s per video. Max 30 rewarded videos daily.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-white">
              {dailyActivity.videosWatchedToday} / {config.maxDailyVideos}
            </span>
            <p className="text-[10px] text-slate-400">Watched today</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(dailyActivity.videosWatchedToday / config.maxDailyVideos) * 100}%` }}
          />
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="w-full py-3 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Go to Video Feed & Watch (+5 Coins)</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* TASK D: Creator Upload & View Rewards */}
      <div className="rounded-3xl p-5 bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <VideoIcon className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Creator Rewards Studio
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  80 Coins / 1k Views
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Upload engaging Pakistani short videos & monetize verified views.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Your Total Views</span>
            <p className="text-lg font-black text-white">45,200</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Estimated Creator Payout</span>
            <p className="text-lg font-black text-emerald-400">Rs 723 PKR</p>
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="w-full py-3 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <VideoIcon className="w-4 h-4" />
          <span>Upload New Video to Earn</span>
        </button>
      </div>

      {/* TASK E: Refer a Friend (200 Coins) */}
      <div className="rounded-3xl p-5 bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Share2 className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Invite Friends & Earn
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  +200 Coins
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Earn Rs 40 (200 Coins) for every friend who registers with your code.
              </p>
            </div>
          </div>
        </div>

        {/* Unique Referral Code Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Your Unique Invite Code</span>
            <p className="text-xl font-black tracking-wider text-yellow-400">{user.referralCode}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCode}
              className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Input to enter a friend's referral code */}
        {!user.referredBy ? (
          <form onSubmit={handleApplyReferral} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Have a friend's referral code?"
              value={inputReferral}
              onChange={(e) => setInputReferral(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shrink-0"
            >
              Apply (+200)
            </button>
          </form>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Referral code already applied! Welcome bonus claimed.</span>
          </div>
        )}
      </div>

      {/* COIN CONVERSION & WITHDRAWAL METHOD SUMMARY */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official AS Shorts Pakistan Conversion System</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-yellow-400 font-bold">5 Coins</p>
            <p className="text-sm font-extrabold text-white">1 PKR</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-yellow-400 font-bold">500 Coins</p>
            <p className="text-sm font-extrabold text-white">100 PKR</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-yellow-400 font-bold">2,500 Coins</p>
            <p className="text-sm font-extrabold text-white">500 PKR (Min)</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-yellow-400 font-bold">5,000 Coins</p>
            <p className="text-sm font-extrabold text-white">1,000 PKR</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Supported Payouts:</span>
            <span className="px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 text-[10px] font-black border border-red-500/30">
              JazzCash
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-600/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
              Easypaisa
            </span>
          </div>

          <button
            onClick={() => setActiveTab('wallet')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Open Wallet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
