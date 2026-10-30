import React, { useEffect, useState } from 'react';
import { Sparkles, Coins } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        onFinish();
      }, 500);
    }, 1600);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-slate-950 text-white transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full" />

      {/* Center Branding */}
      <div className="flex flex-col items-center text-center space-y-4 animate-coin-pop">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-rose-500 to-amber-500 p-1 shadow-2xl shadow-rose-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <span className="font-black text-4xl tracking-tighter bg-gradient-to-r from-emerald-400 via-rose-400 to-yellow-400 bg-clip-text text-transparent">
              AS
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white">AS Shorts</h1>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🇵🇰 Pakistan
            </span>
          </div>
          <p className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
            Watch, Create & Earn
          </p>
        </div>

        <p className="text-xs text-slate-400 max-w-xs">
          Watch Short Videos, Earn Coins and Withdraw Real Money Through JazzCash & Easypaisa.
        </p>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full flex flex-col items-center space-y-3 pb-6">
        <div className="w-32 bg-slate-800 rounded-full h-1 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-500 h-full w-2/3 animate-[pulse_1.5s_infinite]" />
        </div>
        <span className="text-[10px] text-slate-500 font-medium">Secured with Firebase & JazzCash API</span>
      </div>
    </div>
  );
};
