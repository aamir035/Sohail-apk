import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Settings, 
  Coins, 
  WalletCards, 
  Edit3, 
  Share2, 
  ShieldCheck, 
  LogOut, 
  HelpCircle, 
  Lock, 
  FileText, 
  Check, 
  Heart, 
  Eye, 
  Sparkles,
  Phone,
  Mail,
  Grid
} from 'lucide-react';
import { Video } from '../types';

interface ProfileScreenProps {
  onOpenWithdraw: () => void;
  onOpenCreate: () => void;
  onSelectVideo: (video: Video) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onOpenWithdraw, 
  onOpenCreate,
  onSelectVideo 
}) => {
  const { 
    user, 
    videos, 
    config, 
    setActiveTab, 
    isAdminMode, 
    setIsAdminMode, 
    updateProfile, 
    showToast,
    switchUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'settings'>('videos');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFullName, setEditFullName] = useState<string>(user.fullName);
  const [editBio, setEditBio] = useState<string>(user.bio);
  const [editPhone, setEditPhone] = useState<string>(user.phone);

  const myVideos = videos.filter(v => v.creatorId === user.id);
  const pkrEquivalent = Math.floor(user.coins / config.coinConversionRate);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editFullName.trim(),
      bio: editBio.trim(),
      phone: editPhone.trim()
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 pb-24 space-y-6">
      {/* Header Profile Cover & Details */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 w-full bg-gradient-to-r from-emerald-900 via-slate-900 to-rose-900 relative">
          {user.channelCover && (
            <img
              src={user.channelCover}
              alt="Channel Cover"
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>

        {/* Avatar & Key Actions */}
        <div className="px-6 pb-6 relative -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-900 shadow-2xl"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-900">
                ✓
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-yellow-500/20"
              >
                <WalletCards className="w-3.5 h-3.5" />
                <span>Wallet (Rs {pkrEquivalent})</span>
              </button>
            </div>
          </div>

          {/* Profile Name & Stats */}
          <div className="mt-4 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-xl font-black text-white">{user.fullName}</h2>
              <span className="text-xs text-rose-400 font-bold">@{user.username}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ID: {user.id}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-lg">{user.bio}</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 mt-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div>
              <p className="text-base font-black text-white">{user.followersCount.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Followers</p>
            </div>
            <div>
              <p className="text-base font-black text-white">{user.followingCount.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Following</p>
            </div>
            <div>
              <p className="text-base font-black text-rose-400">{user.likesCount.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Likes</p>
            </div>
            <div>
              <p className="text-base font-black text-yellow-400">{user.coins.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Coins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer/Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white">Edit Your Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Bio / Tagline</label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Mobile Number (Pakistan)</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Profile Tabs: Videos vs Settings */}
      <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('videos')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'videos'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>My Videos ({myVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'settings'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings & Support</span>
        </button>
      </div>

      {/* SUBTAB 1: UPLOADED VIDEOS */}
      {activeSubTab === 'videos' && (
        <div className="space-y-4">
          {myVideos.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 text-rose-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Videos Uploaded Yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Share your short videos on AS Shorts and earn 80 Coins for every 1,000 verified views.
              </p>
              <button
                onClick={onOpenCreate}
                className="py-2.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Upload First Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {myVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => onSelectVideo(vid)}
                  className="group relative rounded-2xl overflow-hidden aspect-[9/14] bg-slate-900 border border-slate-800 cursor-pointer hover:border-rose-500 transition-all shadow-md"
                >
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <p className="text-xs font-bold text-white line-clamp-1">{vid.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-300 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-emerald-400" />
                        {vid.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" />
                        {vid.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: SETTINGS & POLICIES */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          {/* Quick Admin Access */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs font-bold text-white">Administrator Control Panel</p>
                <p className="text-[10px] text-slate-300">
                  Manage payouts, review flagged videos & configure rates
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminMode(true)}
              className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
            >
              Open Panel
            </button>
          </div>

          {/* Account Security */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 text-xs">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Registered Phone</span>
              </div>
              <span className="text-slate-400 font-mono">{user.phone}</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-slate-200">Email Address</span>
              </div>
              <span className="text-slate-400">{user.email}</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200">Help & Support (Pakistan)</span>
              </div>
              <span className="text-emerald-400 font-bold">support@asshorts.pk</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">Terms of Service & Earning Policy</span>
              </div>
              <span className="text-slate-400">v2.4.0</span>
            </div>
          </div>

          {/* Role Switching for verification */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Test Account Role:</span>
            <div className="flex gap-2">
              <button
                onClick={() => switchUser('user')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  user.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Normal User
              </button>
              <button
                onClick={() => switchUser('admin')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  user.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
