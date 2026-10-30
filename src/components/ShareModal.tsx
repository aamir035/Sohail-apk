import React, { useState } from 'react';
import { Video } from '../types';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, MessageSquare, Send, Share2 } from 'lucide-react';

interface ShareModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, isOpen, onClose }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !video) return null;

  const shareUrl = `${window.location.origin}?video=${video.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Video link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🇵🇰 Check out this short video on AS Shorts: "${video.title}"\nWatch & earn coins with JazzCash & Easypaisa payout!\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full sm:max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-black text-white">Share Video</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Snippet */}
        <div className="p-3 rounded-2xl bg-slate-950 flex items-center gap-3 border border-slate-800">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-12 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
            <p className="text-[11px] text-slate-400 truncate">@{video.creatorUsername}</p>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 flex flex-col items-center gap-1 transition-all"
          >
            <Send className="w-5 h-5" />
            <span className="text-[10px] font-bold">WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex flex-col items-center gap-1 transition-all"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            <span className="text-[10px] font-bold">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={() => {
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            }}
            className="p-3 rounded-2xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 flex flex-col items-center gap-1 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
