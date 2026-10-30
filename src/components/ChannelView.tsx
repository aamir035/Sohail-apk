import React from 'react';
import { useApp } from '../context/AppContext';
import { Video } from '../types';
import { X, Check, Plus, Heart, Eye, Sparkles, Grid } from 'lucide-react';

interface ChannelViewProps {
  creatorId: string | null;
  onClose: () => void;
  onSelectVideo: (video: Video) => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({ creatorId, onClose, onSelectVideo }) => {
  const { videos, user, toggleFollowUser } = useApp();

  if (!creatorId) return null;

  // Find creator details from video list
  const creatorVideos = videos.filter(v => v.creatorId === creatorId);
  const sampleVideo = creatorVideos[0] || videos[0];
  const isFollowing = creatorVideos.some(v => v.isFollowing);

  const totalCreatorViews = creatorVideos.reduce((sum, v) => sum + v.views, 0);
  const totalCreatorLikes = creatorVideos.reduce((sum, v) => sum + v.likes, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Cover */}
        <div className="h-28 w-full bg-gradient-to-r from-emerald-900 via-slate-950 to-rose-900 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Details */}
        <div className="px-6 pb-4 relative -mt-10">
          <div className="flex items-end justify-between">
            <img
              src={sampleVideo?.creatorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={sampleVideo?.creatorName}
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-900 shadow-xl"
            />

            {creatorId !== user.id && (
              <button
                onClick={() => toggleFollowUser(creatorId)}
                className={`py-2 px-5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Follow Creator</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{sampleVideo?.creatorName}</h3>
              {sampleVideo?.creatorVerified && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-rose-400 font-semibold">@{sampleVideo?.creatorUsername}</p>
            <p className="text-xs text-slate-300 mt-1">
              Official AS Shorts verified creator from Pakistan 🇵🇰
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div>
              <p className="text-sm font-black text-white">{creatorVideos.length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Videos</p>
            </div>
            <div>
              <p className="text-sm font-black text-emerald-400">{totalCreatorViews.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Views</p>
            </div>
            <div>
              <p className="text-sm font-black text-rose-400">{totalCreatorLikes.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Likes</p>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Grid className="w-3.5 h-3.5 text-rose-400" />
            <span>Uploaded Shorts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {creatorVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => {
                  onSelectVideo(vid);
                  onClose();
                }}
                className="group relative rounded-xl overflow-hidden aspect-[9/14] bg-slate-950 border border-slate-800 cursor-pointer hover:border-rose-500 transition-all shadow-md"
              >
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2">
                  <p className="text-[11px] font-bold text-white line-clamp-1">{vid.title}</p>
                  <div className="flex items-center justify-between text-[9px] text-slate-300 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3 text-emerald-400" />
                      {vid.views}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3 text-rose-400" />
                      {vid.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
