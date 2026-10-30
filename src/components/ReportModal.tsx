import React, { useState } from 'react';
import { Video } from '../types';
import { useApp } from '../context/AppContext';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ video, isOpen, onClose }) => {
  const { showToast } = useApp();
  const [reason, setReason] = useState<string>('Inappropriate Content');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !video) return null;

  const reasons = [
    'Inappropriate or Adult Content',
    'Spam or Fraudulent Scheme',
    'Hate Speech or Harassment',
    'Violence or Dangerous Acts',
    'Copyright Infringement'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Report submitted. Our moderation team will review this video.', 'info');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-black text-white">Report Video</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">Thank You for Reporting</p>
            <p className="text-xs text-slate-400">
              We uphold community safety on AS Shorts Pakistan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-xs text-slate-300">
              Why are you reporting <span className="font-bold text-white">"{video.title}"</span>?
            </p>

            <div className="space-y-2">
              {reasons.map((r, i) => (
                <label
                  key={i}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition-all ${
                    reason === r
                      ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-rose-500"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
