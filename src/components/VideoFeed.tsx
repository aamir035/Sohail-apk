import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VideoCard } from './VideoCard';
import { Video } from '../types';
import { ChevronUp, ChevronDown, Compass, Sparkles, Clock, Users } from 'lucide-react';

interface VideoFeedProps {
  onOpenComments: (video: Video) => void;
  onOpenShare: (video: Video) => void;
  onOpenReport: (video: Video) => void;
  onViewChannel: (creatorId: string) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  onOpenComments,
  onOpenShare,
  onOpenReport,
  onViewChannel
}) => {
  const { 
    videos, 
    activeVideoIndex, 
    setActiveVideoIndex, 
    feedFilter, 
    setFeedFilter 
  } = useApp();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter videos based on tabs
  const filteredVideos = React.useMemo(() => {
    if (feedFilter === 'following') {
      const f = videos.filter(v => v.isFollowing);
      return f.length > 0 ? f : videos; // fallback to all if user hasn't followed yet
    }
    if (feedFilter === 'recent') {
      return [...videos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // Default trending
    return [...videos].sort((a, b) => b.views - a.views);
  }, [videos, feedFilter]);

  // Handle scroll snap detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index >= 0 && index < filteredVideos.length && index !== activeVideoIndex) {
      setActiveVideoIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const targetY = index * containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
    setActiveVideoIndex(index);
  };

  // Keyboard navigation up / down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        if (activeVideoIndex < filteredVideos.length - 1) {
          scrollToIndex(activeVideoIndex + 1);
        }
      } else if (e.key === 'ArrowUp') {
        if (activeVideoIndex > 0) {
          scrollToIndex(activeVideoIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoIndex, filteredVideos.length]);

  return (
    <div className="relative w-full h-[calc(100vh-105px)] sm:h-[calc(100vh-112px)] bg-black overflow-hidden">
      {/* TOP FEED SELECTOR: Trending / Recent / Following */}
      <div className="absolute top-2 left-0 right-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto shadow-lg">
          <button
            onClick={() => {
              setFeedFilter('trending');
              scrollToIndex(0);
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              feedFilter === 'trending'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => {
              setFeedFilter('recent');
              scrollToIndex(0);
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              feedFilter === 'recent'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Recent</span>
          </button>

          <button
            onClick={() => {
              setFeedFilter('following');
              scrollToIndex(0);
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              feedFilter === 'following'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Following</span>
          </button>
        </div>
      </div>

      {/* Snap Scroll Vertical Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y-mandatory no-scrollbar"
      >
        {filteredVideos.map((video, idx) => (
          <div
            key={video.id}
            className="w-full h-full snap-start-always flex items-center justify-center relative"
          >
            <VideoCard
              video={video}
              isActive={idx === activeVideoIndex}
              onOpenComments={onOpenComments}
              onOpenShare={onOpenShare}
              onOpenReport={onOpenReport}
              onViewChannel={onViewChannel}
            />
          </div>
        ))}
      </div>

      {/* DESKTOP / TABLET QUICK NAV ARROWS */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 z-20">
        <button
          disabled={activeVideoIndex === 0}
          onClick={() => scrollToIndex(activeVideoIndex - 1)}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl"
          title="Previous video (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <button
          disabled={activeVideoIndex === filteredVideos.length - 1}
          onClick={() => scrollToIndex(activeVideoIndex + 1)}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl"
          title="Next video (Down Arrow)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
