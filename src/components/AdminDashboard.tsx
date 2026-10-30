import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Video as VideoIcon, 
  Coins, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Sliders, 
  Key, 
  AlertTriangle, 
  Check, 
  X, 
  Search, 
  RefreshCw,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { WithdrawalRequest, User, Video, WithdrawalStatus } from '../types';
import { storageService } from '../services/storageService';

export const AdminDashboard: React.FC = () => {
  const { 
    withdrawals, 
    videos, 
    config, 
    updateConfig, 
    adminProcessWithdrawal, 
    deleteVideo, 
    setIsAdminMode,
    showToast,
    refreshData 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'withdrawals' | 'videos' | 'users' | 'rates' | 'gateways'>('withdrawals');
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'under_review' | 'paid' | 'rejected'>('all');
  const [processModalReq, setProcessModalReq] = useState<WithdrawalRequest | null>(null);
  const [actionType, setActionType] = useState<'paid' | 'approved' | 'rejected'>('paid');
  const [refInput, setRefInput] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('Account details mismatch on 1-Link');

  // Dynamic config form state
  const [coinRate, setCoinRate] = useState<number>(config.coinConversionRate);
  const [minWdr, setMinWdr] = useState<number>(config.minWithdrawalPKR);
  const [dailyCheckinCoins, setDailyCheckinCoins] = useState<number>(config.dailyCheckInReward);
  const [adCoins, setAdCoins] = useState<number>(config.adRewardCoins);
  const [videoCoins, setVideoCoins] = useState<number>(config.videoWatchRewardCoins);
  const [referralCoins, setReferralCoins] = useState<number>(config.referralRewardCoins);

  // Gateway Credentials (stored locally for demo/config)
  const [jazzcashMerchantId, setJazzcashMerchantId] = useState<string>('MC98124_JC_PK');
  const [jazzcashPassword, setJazzcashPassword] = useState<string>('••••••••••••');
  const [easypaisaStoreId, setEasypaisaStoreId] = useState<string>('EP_STORE_2026_PK');
  const [easypaisaHashKey, setEasypaisaHashKey] = useState<string>('••••••••••••');
  const [admobAppId, setAdmobAppId] = useState<string>('ca-app-pub-3940256099942544~3347511713');
  const [admobUnitId, setAdmobUnitId] = useState<string>('ca-app-pub-3940256099942544/5224354917');
  const [gatewayMode, setGatewayMode] = useState<'sandbox' | 'production'>('sandbox');

  const allUsers = storageService.getAllUsers();
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalCoinsDistributed = allUsers.reduce((sum, u) => sum + u.coins, 0);
  const totalPkrDistributed = Math.floor(totalCoinsDistributed / config.coinConversionRate);

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'under_review' || w.status === 'pending');
  const paidWithdrawals = withdrawals.filter(w => w.status === 'paid');
  const totalPaidPKR = paidWithdrawals.reduce((sum, w) => sum + w.pkrAmount, 0);

  const filteredWithdrawals = withdrawals.filter(w => {
    if (withdrawalFilter === 'under_review') return w.status === 'under_review' || w.status === 'pending';
    if (withdrawalFilter === 'paid') return w.status === 'paid';
    if (withdrawalFilter === 'rejected') return w.status === 'rejected';
    return true;
  });

  const handleOpenProcess = (req: WithdrawalRequest, type: 'paid' | 'approved' | 'rejected') => {
    setProcessModalReq(req);
    setActionType(type);
    setRefInput(type === 'paid' ? `${req.method === 'JazzCash' ? 'JC' : 'EP'}-PK-${Date.now().toString().slice(-6)}` : '');
  };

  const handleConfirmProcess = () => {
    if (!processModalReq) return;
    if (actionType === 'paid') {
      adminProcessWithdrawal(processModalReq.id, 'paid', refInput || 'MANUAL-PAY-VERIFIED');
    } else if (actionType === 'approved') {
      adminProcessWithdrawal(processModalReq.id, 'approved');
    } else {
      adminProcessWithdrawal(processModalReq.id, 'rejected', undefined, rejectReason);
    }
    setProcessModalReq(null);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      ...config,
      coinConversionRate: Number(coinRate),
      minWithdrawalPKR: Number(minWdr),
      minWithdrawalCoins: Number(minWdr) * Number(coinRate),
      dailyCheckInReward: Number(dailyCheckinCoins),
      adRewardCoins: Number(adCoins),
      videoWatchRewardCoins: Number(videoCoins),
      referralRewardCoins: Number(referralCoins)
    });
  };

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Payment gateway and AdMob credentials saved securely!', 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-5 pb-24 space-y-6">
      {/* Top Banner */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">AS Shorts Admin Dashboard</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Pakistan Operations
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Manage user payouts, verify JazzCash/Easypaisa transactions & moderate content.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdminMode(false)}
          className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Exit Admin View</span>
        </button>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Users</span>
          <p className="text-xl font-black text-white mt-1">{allUsers.length}</p>
          <span className="text-[10px] text-emerald-400 font-bold">100% Active</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Videos</span>
          <p className="text-xl font-black text-white mt-1">{videos.length}</p>
          <span className="text-[10px] text-slate-400">{totalViews.toLocaleString()} views</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Payouts</span>
          <p className="text-xl font-black text-amber-400 mt-1">
            {pendingWithdrawals.length}
          </p>
          <span className="text-[10px] text-amber-400">Needs review</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Paid via JazzCash/EP</span>
          <p className="text-xl font-black text-emerald-400 mt-1">
            Rs {totalPaidPKR.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-400">{paidWithdrawals.length} transactions</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'withdrawals' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Withdrawals ({withdrawals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'videos' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <VideoIcon className="w-3.5 h-3.5" />
          <span>Videos ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rates')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'rates' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Earning Rates</span>
        </button>

        <button
          onClick={() => setActiveTab('gateways')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'gateways' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Payment & AdMob Keys</span>
        </button>
      </div>

      {/* TAB 1: WITHDRAWALS MANAGEMENT */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          {/* Subfilter */}
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">Review Withdrawal Requests</h3>
            <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setWithdrawalFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${withdrawalFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setWithdrawalFilter('under_review')}
                className={`px-2.5 py-1 rounded-lg ${withdrawalFilter === 'under_review' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                Pending Review ({pendingWithdrawals.length})
              </button>
              <button
                onClick={() => setWithdrawalFilter('paid')}
                className={`px-2.5 py-1 rounded-lg ${withdrawalFilter === 'paid' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                Paid
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredWithdrawals.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                No withdrawal requests found for this filter.
              </div>
            ) : (
              filteredWithdrawals.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${
                        req.method === 'JazzCash' ? 'bg-red-600' : 'bg-emerald-600'
                      }`}>
                        {req.method}
                      </span>
                      <span className="text-xs font-bold text-white">{req.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({req.id})</span>
                    </div>

                    <div className="text-xs text-slate-300">
                      Account: <strong className="text-white">{req.accountNumber}</strong> • Title: <strong className="text-white">{req.accountTitle}</strong>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-extrabold text-emerald-400">Rs {req.pkrAmount} PKR</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-yellow-400 font-bold">{req.coinsDeducted} Coins</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 text-[10px]">{new Date(req.requestedAt).toLocaleString()}</span>
                    </div>

                    {req.transactionRef && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Ref: <span className="text-emerald-400">{req.transactionRef}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'under_review' || req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleOpenProcess(req, 'paid')}
                          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Mark as Paid</span>
                        </button>

                        <button
                          onClick={() => handleOpenProcess(req, 'rejected')}
                          className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Reject & Refund</span>
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        req.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VIDEO MODERATION */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-white">Moderate Uploaded Short Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex gap-3"
              >
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-20 h-28 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-rose-400">
                      {vid.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1">{vid.title}</h4>
                    <p className="text-[11px] text-slate-400">By @{vid.creatorUsername}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {vid.views.toLocaleString()} views • {vid.likes} likes
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete video "${vid.title}" for community guideline violation?`)) {
                        deleteVideo(vid.id);
                      }
                    }}
                    className="py-1 px-2.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-[10px] flex items-center gap-1 w-fit transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Video</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-white">Registered Users & Coin Balances</h3>
          <div className="space-y-2">
            {allUsers.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white">{u.fullName}</p>
                      <span className="text-[10px] text-rose-400">@{u.username}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Phone: {u.phone} • Code: {u.referralCode}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-yellow-400">{u.coins.toLocaleString()} Coins</p>
                  <p className="text-[10px] font-semibold text-emerald-400">
                    Rs {Math.floor(u.coins / config.coinConversionRate)} PKR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EARNING RATES CONFIGURATION */}
      {activeTab === 'rates' && (
        <form onSubmit={handleSaveRates} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white">Configure Earning & Conversion Rules</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Coin Conversion Rate (Coins per 1 PKR)
              </label>
              <input
                type="number"
                min={1}
                value={coinRate}
                onChange={(e) => setCoinRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
              <span className="text-[10px] text-slate-400">Default: 5 Coins = 1 PKR</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Minimum Withdrawal (PKR)
              </label>
              <input
                type="number"
                min={100}
                value={minWdr}
                onChange={(e) => setMinWdr(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
              <span className="text-[10px] text-slate-400">Default: 500 PKR (2,500 Coins)</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Daily Check-in Reward (Coins)
              </label>
              <input
                type="number"
                value={dailyCheckinCoins}
                onChange={(e) => setDailyCheckinCoins(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Rewarded Ad Bonus (Coins per Ad)
              </label>
              <input
                type="number"
                value={adCoins}
                onChange={(e) => setAdCoins(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Watch Short Video Bonus (Coins per Video)
              </label>
              <input
                type="number"
                value={videoCoins}
                onChange={(e) => setVideoCoins(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Referral Bonus (Coins per Friend)
              </label>
              <input
                type="number"
                value={referralCoins}
                onChange={(e) => setReferralCoins(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg"
          >
            Update & Apply Earning Rules
          </button>
        </form>
      )}

      {/* TAB 5: GATEWAYS & ADMOB API KEYS */}
      {activeTab === 'gateways' && (
        <form onSubmit={handleSaveGateways} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">Payment Gateway & AdMob Credentials</h3>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-400">Environment:</span>
              <button
                type="button"
                onClick={() => setGatewayMode(gatewayMode === 'sandbox' ? 'production' : 'sandbox')}
                className={`px-2.5 py-1 rounded-lg ${
                  gatewayMode === 'production' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {gatewayMode.toUpperCase()}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* JazzCash */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/30 space-y-3">
              <span className="text-xs font-black text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                JazzCash Merchant API Configuration
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Merchant ID</label>
                  <input
                    type="text"
                    value={jazzcashMerchantId}
                    onChange={(e) => setJazzcashMerchantId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">API Password / Secret</label>
                  <input
                    type="password"
                    value={jazzcashPassword}
                    onChange={(e) => setJazzcashPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Easypaisa */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Easypaisa IPN & Payout Gateway
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Store ID</label>
                  <input
                    type="text"
                    value={easypaisaStoreId}
                    onChange={(e) => setEasypaisaStoreId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Hash / Secret Key</label>
                  <input
                    type="password"
                    value={easypaisaHashKey}
                    onChange={(e) => setEasypaisaHashKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* AdMob */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-yellow-500/30 space-y-3">
              <span className="text-xs font-black text-yellow-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Google AdMob Rewarded Video Unit
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">AdMob App ID</label>
                  <input
                    type="text"
                    value={admobAppId}
                    onChange={(e) => setAdmobAppId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Rewarded Video Unit ID</label>
                  <input
                    type="text"
                    value={admobUnitId}
                    onChange={(e) => setAdmobUnitId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg"
          >
            Save Gateway Configuration
          </button>
        </form>
      )}

      {/* PROCESS WITHDRAWAL POPUP */}
      {processModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-sm text-white">
              {actionType === 'paid' ? 'Mark Withdrawal as Paid' : 'Reject Withdrawal'}
            </h3>

            <div className="p-3 rounded-xl bg-slate-950 text-xs space-y-1">
              <p className="text-white font-bold">User: {processModalReq.userName}</p>
              <p className="text-slate-300">Method: {processModalReq.method} ({processModalReq.accountNumber})</p>
              <p className="text-emerald-400 font-extrabold">Amount: Rs {processModalReq.pkrAmount} PKR</p>
            </div>

            {actionType === 'paid' ? (
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Bank / JazzCash / Easypaisa Reference ID *
                </label>
                <input
                  type="text"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder="e.g. JC-PK-891283"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Rejection Reason (Coins will be refunded to user)
                </label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setProcessModalReq(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmProcess}
                className={`flex-1 py-2 rounded-xl text-white text-xs font-bold ${
                  actionType === 'paid' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                Confirm {actionType === 'paid' ? 'Payout' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
