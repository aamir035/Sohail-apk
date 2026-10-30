import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Coins, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenNotifications, 
  isMobileFrame, 
  onToggleMobileFrame 
}) => {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    unreadNotifsCount, 
    isDarkMode, 
    toggleDarkMode, 
    isAdminMode, 
    setIsAdminMode, 
    config 
  } = useApp();

  const pkrEquivalent = Math.floor(user.coins / config.coinConversionRate);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 px-3 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Tagline */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-rose-600 to-amber-500 flex items-center justify-center p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-sm tracking-tighter bg-gradient-to-r from-emerald-400 via-rose-400 to-yellow-400 bg-clip-text text-transparent">
                AS
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white group-hover:text-rose-400 transition-colors">
                AS Shorts
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🇵🇰 PK
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:inline">
              Watch, Create & Earn
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Wallet Pill */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeTab === 'wallet'
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-md shadow-yellow-500/10'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80'
            }`}
            title="Open Wallet"
          >
            <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="text-yellow-400 font-bold">{user.coins.toLocaleString()}</span>
            <span className="text-slate-500 text-[10px]">|</span>
            <span className="text-emerald-400 font-bold">Rs {pkrEquivalent.toLocaleString()}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors hidden xs:flex"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Mobile Phone Mockup Frame Toggle (for testing Android viewport) */}
          <button
            onClick={onToggleMobileFrame}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors hidden md:flex"
            title={isMobileFrame ? 'Expand to Full Width' : 'View in Android Phone Frame'}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4 text-slate-300" /> : <Smartphone className="w-4 h-4 text-rose-400" />}
          </button>

          {/* Admin Mode Toggle Pill */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all border ${
              isAdminMode
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-500/20'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
            }`}
            title="Switch between Regular User and Admin Console"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdminMode ? 'text-purple-200' : 'text-slate-400'}`} />
            <span>{isAdminMode ? 'Admin Active' : 'Admin Panel'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
