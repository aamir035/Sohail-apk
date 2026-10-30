import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Coins } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'coin':
        return <Coins className="w-6 h-6 text-yellow-400 animate-bounce" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 pointer-events-none animate-coin-pop">
      <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 ${
        toast.type === 'coin'
          ? 'bg-gradient-to-r from-yellow-500/90 to-amber-600/90 text-white border-yellow-300/40 shadow-yellow-500/20'
          : toast.type === 'success'
          ? 'bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-500/10'
          : toast.type === 'error'
          ? 'bg-slate-900/95 text-white border-rose-500/40 shadow-rose-500/10'
          : 'bg-slate-900/95 text-white border-slate-700'
      }`}>
        <div className="shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">{toast.message}</p>
          {toast.coins && (
            <p className="text-xs text-yellow-100 font-medium mt-0.5">
              +{toast.coins} Coins credited to your wallet!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
