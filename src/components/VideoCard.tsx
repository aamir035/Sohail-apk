import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Coins, 
  Music, 
  Flag,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  onOpenComments: (video: Video) => void;
  onOpenShare: (video: Video) => void;
  onOpenReport: (video: Video) => void;
  onViewChannel: (creatorId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  onOpenComments,
  onOpenShare,
  onOpenReport,
  onViewChannel
}) => {
  const { 
    user, 
    toggleLikeVideo, 
    toggleFollowUser, 
    claimVideoWatchReward, 
    dailyActivity, 
    config,
    showToast 
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // start muted for safe autoplay
  const [watchSeconds, setWatchSeconds] = useState<number>(0);
  const [isRewardClaimed, setIsRewardClaimed] = useState<boolean>(false);
  const [showHeartPop, setShowHeartPop] = useState<boolean>(false);
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Check if this video has already been rewarded today
  const alreadyRewardedToday = dailyActivity.rewardedVideoIds.includes(video.id);
  const dailyCapReached = dailyActivity.videosWatchedToday >= config.maxDailyVideos;

  // Handle Play / Pause based on active state in viewport
  useEffect(() => {
    if (isActive) {
      setWatchSeconds(0);
      setIsRewardClaimed(alreadyRewardedToday);
      setVideoError(false);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser policy fallback
              setIsPlaying(false);
            });
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, alreadyRewardedToday]);

  // Watch timer for coin earning (counts while video is active and playing)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive && isPlaying && !alreadyRewardedToday && !isRewardClaimed && !dailyCapReached) {
      timer = setInterval(() => {
        setWatchSeconds(prev => {
          const nextSec = prev + 1;
          if (nextSec >= config.minVideoWatchSeconds) {
            // Trigger coin reward!
            const earned = claimVideoWatchReward(video.id, nextSec);
            if (earned) {
              setIsRewardClaimed(true);
            }
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, isPlaying, alreadyRewardedToday, isRewardClaimed, dailyCapReached, video.id, config.minVideoWatchSeconds]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.isLiked) {
      toggleLikeVideo(video.id);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 900);
  };

  const progressPercent = Math.min(100, Math.round((watchSeconds / config.minVideoWatchSeconds) * 100));

  return (
    <div 
      className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden select-none"
      onClick={handleTogglePlay}
      onDoubleClick={handleDoubleTap}
    >
      {/* Video Element */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          playsInline
          loop
          muted={isMuted}
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover sm:object-contain sm:max-w-md mx-auto"
        />
      ) : (
        /* Fallback rich visual player if external video link fails */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
          />
          <div className="relative z-10 max-w-xs space-y-3 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-slate-700">
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto animate-spin" />
            <h3 className="font-bold text-white text-base">{video.title}</h3>
            <p className="text-xs text-slate-300">Streaming Pakistani Short Video Preview</p>
            <button
              onClick={() => {
                setVideoError(false);
                videoRef.current?.load();
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-rose-600 text-white font-medium"
            >
              Reload Stream
            </button>
          </div>
        </div>
      )}

      {/* Dim overlay gradient for readable texts */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />

      {/* Double Tap Heart Pop Animation */}
      {showHeartPop && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-ping opacity-90 drop-shadow-2xl" />
        </div>
      )}

      {/* Center Play/Pause indicator when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
            <Play className="w-8 h-8 text-white fill-white ml-1 opacity-90" />
          </div>
        </div>
      )}

      {/* TOP FLOATING BAR: Watch & Earn Timer Pill & Mute button */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
        {/* Watch & Earn Progress Pill */}
        <div className="flex items-center gap-2">
          {alreadyRewardedToday || isRewardClaimed ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white font-bold text-xs backdrop-blur-md shadow-lg border border-emerald-400/30 animate-coin-pop">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>+5 Coins Earned!</span>
            </div>
          ) : dailyCapReached ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 text-slate-300 font-semibold text-xs backdrop-blur-md border border-slate-700">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>Daily Limit (30/30)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-yellow-500/40 text-white shadow-xl">
              <div className="relative w-5 h-5 flex items-center justify-center">
                {/* Circular ring */}
                <svg className="w-5 h-5 -rotate-90">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-slate-700"
                    fill="transparent"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="50"
                    strokeDashoffset={50 - (50 * progressPercent) / 100}
                    strokeLinecap="round"
                    className="text-yellow-400 transition-all duration-300"
                    fill="transparent"
                  />
                </svg>
                <Coins className="w-2.5 h-2.5 text-yellow-400 absolute" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-yellow-300 leading-tight">
                  {config.minVideoWatchSeconds - watchSeconds}s for +5 Coins
                </span>
                <span className="text-[9px] text-slate-300">
                  {dailyActivity.videosWatchedToday}/{config.maxDailyVideos} videos today
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mute / Unmute Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 transition-all"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* RIGHT SIDE ACTION BAR (TikTok style) */}
      <div className="absolute right-2.5 bottom-20 flex flex-col items-center gap-4 z-20 pointer-events-auto">
        {/* Creator Avatar with follow button */}
        <div className="relative group">
          <img
            src={video.creatorAvatar}
            alt={video.creatorName}
            onClick={(e) => {
              e.stopPropagation();
              onViewChannel(video.creatorId);
            }}
            className="w-11 h-11 rounded-full object-cover border-2 border-white cursor-pointer hover:scale-105 transition-transform"
          />
          {!video.isFollowing && video.creatorId !== user.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollowUser(video.creatorId);
              }}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
              title="Follow creator"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeVideo(video.id);
          }}
          className="flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-transform active:scale-125">
            <Heart
              className={`w-6 h-6 transition-colors ${
                video.isLiked
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-white'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            {video.likes.toLocaleString()}
          </span>
        </button>

        {/* Comments Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments(video);
          }}
          className="flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-transform active:scale-110">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            {video.commentsCount.toLocaleString()}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare(video);
          }}
          className="flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-transform active:scale-110">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            {video.shares.toLocaleString()}
          </span>
        </button>

        {/* Report Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenReport(video);
          }}
          className="flex flex-col items-center group text-slate-400 hover:text-white"
          title="Report inappropriate content"
        >
          <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
            <Flag className="w-4 h-4 text-slate-300" />
          </div>
        </button>

        {/* Spinning Audio Disc */}
        <div className="relative w-9 h-9 rounded-full bg-slate-950 border-2 border-slate-700 p-1 flex items-center justify-center animate-spin [animation-duration:5s]">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-500 via-emerald-500 to-amber-500 flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* BOTTOM INFO OVERLAY: Creator, Title, Hashtags, Audio */}
      <div className="absolute left-3 bottom-4 right-16 z-20 pointer-events-auto text-left">
        {/* Creator Name & Category */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onViewChannel(video.creatorId);
          }}
          className="flex items-center gap-2 cursor-pointer group mb-1"
        >
          <span className="font-black text-white text-sm group-hover:text-rose-400 transition-colors drop-shadow-md">
            @{video.creatorUsername}
          </span>
          {video.creatorVerified && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
              ✓
            </span>
          )}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
            {video.category}
          </span>
        </div>

        {/* Video Title & Description */}
        <p className="text-white text-xs font-semibold drop-shadow-md line-clamp-2 mb-1">
          {video.title}
        </p>

        <p className={`text-slate-200 text-[11px] drop-shadow-md ${showFullDesc ? '' : 'line-clamp-2'}`}>
          {video.description}
        </p>
        {video.description.length > 70 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullDesc(!showFullDesc);
            }}
            className="text-[10px] text-amber-300 font-bold hover:underline mb-1"
          >
            {showFullDesc ? 'Show less' : '...more'}
          </button>
        )}

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 my-1">
          {video.hashtags.map((tag, idx) => (
            <span key={idx} className="text-[10px] text-emerald-300 font-bold hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>

        {/* Audio Ticker */}
        <div className="flex items-center gap-1.5 text-slate-300 text-[10px] mt-1">
          <Music className="w-3 h-3 text-rose-400 shrink-0" />
          <span className="truncate">{video.musicTitle}</span>
        </div>
      </div>
    </div>
  );
};
