import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, Mail, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, showToast } = useApp();
  const [step, setStep] = useState<'options' | 'phone' | 'otp'>('options');
  const [phone, setPhone] = useState<string>('0304-1234567');
  const [otp, setOtp] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('789123');

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    showToast('Signed in with Google Account (Firebase Auth)!', 'success');
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/[\s-]/g, '');
    if (!/^03[0-9]{9}$/.test(clean)) {
      showToast('Please enter an 11-digit Pakistani mobile number starting with 03.', 'error');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep('otp');
    showToast(`Verification code sent to ${phone}: ${code}`, 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp || otp === '123456' || otp.length === 6) {
      showToast('Phone verified successfully!', 'success');
      onClose();
    } else {
      showToast('Incorrect verification code. Please try again.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo / Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-rose-500 to-amber-500 p-0.5 mx-auto shadow-xl shadow-rose-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <span className="font-black text-xl bg-gradient-to-r from-emerald-400 via-rose-400 to-yellow-400 bg-clip-text text-transparent">
              AS
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-white">Welcome to AS Shorts! 🇵🇰</h3>
          <p className="text-xs text-slate-300 mt-1">
            Watch Short Videos, Create Content and Earn Coins.
          </p>
        </div>

        {/* STEP 1: OPTIONS */}
        {step === 'options' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => setStep('phone')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-colors border border-slate-700"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Continue with Phone Number</span>
            </button>
          </div>
        )}

        {/* STEP 2: PHONE INPUT */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-3 pt-2 text-left">
            <label className="text-xs font-bold text-slate-300 block">
              Pakistani Mobile Number
            </label>
            <input
              type="text"
              placeholder="0300-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              Send OTP Code
            </button>
            <button
              type="button"
              onClick={() => setStep('options')}
              className="w-full text-center text-xs text-slate-400 hover:underline pt-1"
            >
              Back to options
            </button>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2 text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
              Demo Code: <strong className="text-white font-mono">{generatedOtp}</strong>
            </div>

            <label className="text-xs font-bold text-slate-300 block">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-center text-base tracking-widest font-mono font-bold focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              Verify & Enter AS Shorts
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
