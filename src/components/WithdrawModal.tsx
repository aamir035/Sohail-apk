import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import { 
  X, 
  Coins, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Info
} from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { user, config, requestWithdrawal, withdrawals } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('JazzCash');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountTitle, setAccountTitle] = useState<string>('');
  const [amountPKR, setAmountPKR] = useState<number>(config.minWithdrawalPKR);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const requiredCoins = amountPKR * config.coinConversionRate;
  const hasEnoughCoins = user.coins >= requiredCoins;
  const userBalancePKR = Math.floor(user.coins / config.coinConversionRate);

  // Check pending withdrawals
  const hasPending = withdrawals.some(
    w => w.userId === user.id && (w.status === 'pending' || w.status === 'under_review' || w.status === 'processing')
  );

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Format phone
    const cleaned = accountNumber.replace(/[\s-]/g, '');
    const pakPhoneRegex = /^03[0-9]{9}$/;
    if (!pakPhoneRegex.test(cleaned)) {
      setErrorMsg('Please enter a valid 11-digit Pakistani mobile number starting with 03 (e.g. 0300-1234567).');
      return;
    }

    if (!accountTitle.trim() || accountTitle.trim().length < 3) {
      setErrorMsg(`Please enter the exact Account Holder Name registered with ${method}.`);
      return;
    }

    if (amountPKR < config.minWithdrawalPKR) {
      setErrorMsg(`Minimum withdrawal amount is ${config.minWithdrawalPKR} PKR.`);
      return;
    }

    if (!hasEnoughCoins) {
      setErrorMsg(`Insufficient coins! You need ${requiredCoins.toLocaleString()} coins, but you currently have ${user.coins.toLocaleString()} coins.`);
      return;
    }

    const ok = requestWithdrawal(method, cleaned, accountTitle.trim(), amountPKR);
    if (ok) {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
              <Coins className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Withdraw Real Money 🇵🇰</h2>
              <p className="text-[11px] text-slate-400">Direct to your JazzCash or Easypaisa</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {submitted ? (
            /* SUCCESS VIEW */
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 animate-coin-pop">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-black text-white">
                Your Withdrawal Request Has Been Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your request is <span className="text-amber-400 font-bold">Under Review</span>. Our payment disbursement team will verify your account and process Rs {amountPKR} directly to your {method} account.
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="font-bold text-white">{method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Title:</span>
                  <span className="font-bold text-white">{accountTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Number:</span>
                  <span className="font-bold text-white">{accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount in PKR:</span>
                  <span className="font-bold text-emerald-400">Rs {amountPKR} PKR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coins Deducted:</span>
                  <span className="font-bold text-yellow-400">-{requiredCoins} Coins</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Done / Back to Wallet
              </button>
            </div>
          ) : (
            /* WITHDRAWAL FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Existing Pending Alert */}
              {hasPending && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    You already have a withdrawal under review. Please wait until your previous request is verified before creating another one.
                  </span>
                </div>
              )}

              {/* Step 1: Select Payment Method */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1. Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* JazzCash Option */}
                  <div
                    onClick={() => setMethod('JazzCash')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      method === 'JazzCash'
                        ? 'bg-gradient-to-br from-red-950/80 to-slate-900 border-red-500 ring-2 ring-red-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                      JC
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">JazzCash</p>
                      <p className="text-[10px] text-slate-400">Pakistan Mobile Wallet</p>
                    </div>
                  </div>

                  {/* Easypaisa Option */}
                  <div
                    onClick={() => setMethod('Easypaisa')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      method === 'Easypaisa'
                        ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                      EP
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">Easypaisa</p>
                      <p className="text-[10px] text-slate-400">Telenor Microfinance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 & 3: Account Number & Account Holder Name */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    2. {method} Mobile Account Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0300-1234567 or 03012345678"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Must be a registered 11-digit Pakistani mobile number.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    3. Exact Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Aslam / Ali Raza"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Must match your CNIC name on {method}.
                  </span>
                </div>
              </div>

              {/* Step 4: Amount in PKR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    4. Withdrawal Amount (PKR)
                  </label>
                  <span className="text-[11px] text-yellow-400 font-bold">
                    Rate: 5 Coins = 1 PKR
                  </span>
                </div>

                {/* Quick amount chips */}
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountPKR(amt)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        amountPKR === amt
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Rs {amt}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rs</span>
                  <input
                    type="number"
                    min={config.minWithdrawalPKR}
                    step={100}
                    value={amountPKR}
                    onChange={(e) => setAmountPKR(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  Minimum withdrawal: {config.minWithdrawalPKR} PKR ({config.minWithdrawalCoins} Coins).
                </span>
              </div>

              {/* Step 5 & 6: Live Calculation & Balance Verification */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Your Current Coins:</span>
                  <span className="font-bold text-yellow-400">{user.coins.toLocaleString()} Coins (Rs {userBalancePKR})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Coins Required for Rs {amountPKR}:</span>
                  <span className="font-black text-rose-400">{requiredCoins.toLocaleString()} Coins</span>
                </div>
                <div className="h-px bg-slate-800 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">You will receive:</span>
                  <span className="font-black text-emerald-400 text-sm">Rs {amountPKR.toLocaleString()} PKR</span>
                </div>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Security Policy Disclaimer */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-300 text-[10px]">
                <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  Anti-fraud protection: We NEVER ask for your JazzCash or Easypaisa MPIN, password, or OTP.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!hasEnoughCoins || hasPending}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                  !hasEnoughCoins || hasPending
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-emerald-500/20 cursor-pointer'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>
                  {!hasEnoughCoins
                    ? `Insufficient Coins (Need ${requiredCoins - user.coins} more)`
                    : hasPending
                    ? 'Previous Request Pending'
                    : `Confirm & Withdraw Rs ${amountPKR} PKR`}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
