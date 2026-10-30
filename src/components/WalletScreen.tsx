import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  RefreshCw,
  FileText,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod, WithdrawalStatus } from '../types';

interface WalletScreenProps {
  onOpenWithdraw: () => void;
  onOpenMerchantDocs: () => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ 
  onOpenWithdraw,
  onOpenMerchantDocs 
}) => {
  const { user, config, transactions, withdrawals, setActiveTab, refreshData } = useApp();
  const [historyTab, setHistoryTab] = useState<'all' | 'earnings' | 'withdrawals'>('all');

  const pkrBalance = Math.floor(user.coins / config.coinConversionRate);

  // Filtered withdrawals for current user
  const userWithdrawals = withdrawals.filter(w => w.userId === user.id);
  
  // Calculate total paid withdrawals
  const totalPaidPKR = userWithdrawals
    .filter(w => w.status === 'paid')
    .reduce((sum, w) => sum + w.pkrAmount, 0);

  // Pending withdrawals
  const pendingPKR = userWithdrawals
    .filter(w => w.status === 'pending' || w.status === 'under_review' || w.status === 'processing')
    .reduce((sum, w) => sum + w.pkrAmount, 0);

  const getStatusBadge = (status: WithdrawalStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Approved
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse">
            Processing
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-yellow-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 pb-24 space-y-6">
      {/* Wallet Balance Hero Card */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border border-emerald-500/40 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Coins className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-slate-300">AS Shorts Official Wallet 🇵🇰</span>
          </div>

          <button
            onClick={refreshData}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh balance"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big Balance */}
        <div className="mt-5 space-y-1">
          <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
            Available Withdrawal Balance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Rs {pkrBalance.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-emerald-400">PKR</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="text-sm font-extrabold text-yellow-400">
              {user.coins.toLocaleString()} Coins
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-300 font-medium">
              Rate: <strong className="text-white">5 Coins = 1 PKR</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onOpenWithdraw}
            className="flex-1 py-3.5 px-5 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Withdraw Money (JazzCash / Easypaisa)</span>
          </button>

          <button
            onClick={() => setActiveTab('earn')}
            className="py-3.5 px-5 rounded-2xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Earn More Coins</span>
          </button>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Coins</span>
          <p className="text-base font-black text-yellow-400 mt-0.5">
            {user.coins.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Payout</span>
          <p className="text-base font-black text-amber-400 mt-0.5">
            Rs {pendingPKR.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Withdrawn</span>
          <p className="text-base font-black text-emerald-400 mt-0.5">
            Rs {totalPaidPKR.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Lifetime Earned</span>
          <p className="text-base font-black text-white mt-0.5">
            Rs {(pkrBalance + totalPaidPKR).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Gateway Badges & Integration Docs Link */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-black">
              JazzCash
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black">
              Easypaisa
            </span>
          </div>
          <span className="text-xs text-slate-300">
            Automated Pakistani payout gateways
          </span>
        </div>

        <button
          onClick={onOpenMerchantDocs}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>API & Merchant Config</span>
        </button>
      </div>

      {/* History Tabs (All / Earnings / Withdrawals) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white">Transaction & Withdrawal History</h3>
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setHistoryTab('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                historyTab === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setHistoryTab('earnings')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                historyTab === 'earnings'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setHistoryTab('withdrawals')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                historyTab === 'withdrawals'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* WITHDRAWALS LIST (when tab is withdrawals) */}
        {historyTab === 'withdrawals' && (
          <div className="space-y-2.5">
            {userWithdrawals.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No withdrawal requests yet. Earn at least 2,500 Coins (Rs 500) to request a payout!
              </div>
            ) : (
              userWithdrawals.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                        req.method === 'JazzCash' ? 'bg-red-600' : 'bg-emerald-600'
                      }`}>
                        {req.method === 'JazzCash' ? 'JC' : 'EP'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Rs {req.pkrAmount} PKR via {req.method}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {req.accountTitle} • {req.accountNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {getStatusBadge(req.status)}
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {req.transactionRef && (
                    <div className="p-2 rounded-lg bg-slate-950 text-[11px] text-slate-300 font-mono">
                      Ref: <strong className="text-emerald-400">{req.transactionRef}</strong>
                    </div>
                  )}

                  {req.rejectionReason && (
                    <div className="p-2 rounded-lg bg-rose-500/10 text-[11px] text-rose-400">
                      Reason: {req.rejectionReason} (Coins have been refunded).
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TRANSACTIONS LIST (when tab is all or earnings) */}
        {historyTab !== 'withdrawals' && (
          <div className="space-y-2.5">
            {transactions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No transactions yet. Start watching short videos to earn!
              </div>
            ) : (
              transactions
                .filter(t => (historyTab === 'earnings' ? t.coins > 0 : true))
                .map((txn) => {
                  const isPositive = txn.coins > 0;
                  return (
                    <div
                      key={txn.id}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isPositive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-white">{txn.title}</p>
                          <p className="text-[10px] text-slate-400">{txn.description}</p>
                          <span className="text-[9px] text-slate-400">
                            {new Date(txn.timestamp).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p
                          className={`text-sm font-black ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? `+${txn.coins}` : txn.coins} Coins
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Rs {txn.pkrAmount} PKR
                        </p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
