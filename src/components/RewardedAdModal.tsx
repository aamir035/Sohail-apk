import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({ isOpen, onClose }) => {
  const { claimAdReward, dailyActivity, config } = useApp();
  const [countdown, setCountdown] = useState<number>(15);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(15);
      setIsCompleted(false);
      setClaimed(false);
      return;
    }

    setCountdown(15);
    setIsCompleted(false);
    setClaimed(false);

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimReward = () => {
    if (!isCompleted || claimed) return;
    const ok = claimAdReward();
    if (ok) {
      setClaimed(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleEarlyExit = () => {
    if (!isCompleted) {
      const confirmExit = window.confirm(
        'Warning: If you close the ad before the 15s timer completes, you will NOT earn your 10 coins reward! Do you still want to close?'
      );
      if (confirmExit) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* AdMob Header Bar */}
        <div className="p-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-yellow-500 text-slate-950 uppercase tracking-wider">
              Ad
            </span>
            <span className="text-xs font-semibold text-slate-300">Google AdMob Rewarded Video</span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{countdown}s</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            )}

            <button
              onClick={handleEarlyExit}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close Ad"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ad Body Content (Realistic Pakistani high-converting sponsored app/campaign) */}
        <div className="p-4 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 aspect-video flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80"
              alt="Sponsored Ad"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Featured Sponsor</span>
              <h4 className="text-sm font-bold text-white">JazzCash Smart Business Hub 🇵🇰</h4>
              <p className="text-[11px] text-slate-300">Accept QR payments across Pakistan with 0% fee.</p>
            </div>
          </div>

          <div className="space-y-1.5 text-center">
            <h3 className="font-extrabold text-base text-white">
              Watch completely to earn {config.adRewardCoins} Coins!
            </h3>
            <p className="text-xs text-slate-400">
              Progress today: <span className="text-yellow-400 font-bold">{dailyActivity.adsWatchedToday}/{config.maxDailyAds}</span> ads completed.
            </p>
          </div>

          {/* Reward Status Banner */}
          {!isCompleted ? (
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5 text-yellow-400 animate-bounce" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-white">Unskippable Timer in Progress</p>
                <p className="text-[11px] text-slate-400">
                  Reward unlocks automatically in {countdown} seconds.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3 animate-coin-pop">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-emerald-400">Reward Criteria Satisfied!</p>
                <p className="text-[11px] text-slate-300">
                  Tap below to claim your 10 Coins.
                </p>
              </div>
            </div>
          )}

          {/* Claim / Action Button */}
          <button
            disabled={!isCompleted || claimed}
            onClick={handleClaimReward}
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              !isCompleted
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : claimed
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer'
            }`}
          >
            <Coins className="w-4 h-4 text-slate-950" />
            <span>
              {claimed
                ? 'Coins Claimed Successfully!'
                : isCompleted
                ? 'Claim 10 Coins Now'
                : `Please wait ${countdown}s to claim reward`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
