import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Flame, 
  PlusCircle, 
  Users, 
  User, 
  Coins, 
  WalletCards 
} from 'lucide-react';

interface BottomNavProps {
  onOpenCreate: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCreate }) => {
  const { activeTab, setActiveTab, user } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/90 py-1.5 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all ${
            activeTab === 'home'
              ? 'text-white scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-white stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </button>

        {/* 2. Earn */}
        <button
          onClick={() => setActiveTab('earn')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 transition-all ${
            activeTab === 'earn'
              ? 'text-amber-400 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Coins className={`w-5 h-5 ${activeTab === 'earn' ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-emerald-500 text-slate-950 text-[8px] font-black rounded-full uppercase tracking-tighter">
              Earn
            </span>
          </div>
          <span className="text-[10px] font-semibold mt-1">Daily Earn</span>
        </button>

        {/* 3. Create (+) */}
        <button
          onClick={onOpenCreate}
          className="flex flex-col items-center justify-center py-0.5 px-2 group"
          title="Create & Upload Video"
        >
          <div className="w-11 h-8 rounded-xl bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black text-white leading-none">+</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold mt-1 text-slate-300 group-hover:text-white">Create</span>
        </button>

        {/* 4. Following */}
        <button
          onClick={() => setActiveTab('following')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all ${
            activeTab === 'following'
              ? 'text-rose-400 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'following' ? 'text-rose-400 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-semibold mt-1">Following</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all ${
            activeTab === 'profile'
              ? 'text-white scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.fullName}
              className={`w-5 h-5 rounded-full object-cover border ${
                activeTab === 'profile' ? 'border-rose-400' : 'border-slate-600'
              }`}
            />
          </div>
          <span className="text-[10px] font-semibold mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
