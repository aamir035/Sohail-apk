import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Coins, CheckCircle, ArrowUpRight, CheckCheck } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead, setActiveTab } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full sm:max-w-md max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-black text-white">Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No new notifications right now.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-colors flex items-start gap-3 ${
                  notif.read
                    ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                    : 'bg-slate-950 border-emerald-500/30 text-white shadow-md'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {notif.type === 'reward' ? (
                    <Coins className="w-4 h-4 text-yellow-400" />
                  ) : notif.type === 'withdrawal' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Bell className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-white leading-tight">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(notif.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-normal">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom shortcut to wallet */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              onClose();
              setActiveTab('wallet');
            }}
            className="text-xs font-bold text-yellow-400 hover:underline"
          >
            Go to Wallet & Cash Out →
          </button>
        </div>
      </div>
    </div>
  );
};
