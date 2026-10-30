import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Video, Comment } from '../types';
import { X, Send, Heart, MessageCircle } from 'lucide-react';

interface CommentsModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ video, isOpen, onClose }) => {
  const { user, addComment, getCommentsForVideo } = useApp();
  const [commentText, setCommentText] = useState<string>('');

  if (!isOpen || !video) return null;

  const comments = getCommentsForVideo(video.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(video.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full sm:max-w-md h-[70vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-black text-white">
              Comments ({comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-xs font-semibold">No comments yet.</p>
              <p className="text-[11px] text-slate-400">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <img
                  src={c.userAvatar}
                  alt={c.userName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-white">{c.userName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed break-words">
                    {c.text}
                  </p>
                </div>
                <button className="flex flex-col items-center text-slate-500 hover:text-rose-500 transition-colors shrink-0">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-semibold">{c.likes || 0}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <input
            type="text"
            placeholder="Add a comment on AS Shorts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-full bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
