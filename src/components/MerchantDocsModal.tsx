import React from 'react';
import { X, FileText, CheckCircle2, ExternalLink, ShieldCheck, Key, AlertCircle } from 'lucide-react';

interface MerchantDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantDocsModal: React.FC<MerchantDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-black text-white">
                Pakistani Merchant Integration Guide 🇵🇰
              </h2>
              <p className="text-[11px] text-slate-400">
                JazzCash & Easypaisa Disbursal & Production Requirements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Status Note */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-xs">Admin-Managed Payout Workflow Active</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                All withdrawal requests are securely captured with Pakistani account numbers, 
                account titles, and coin reserves. Administrators can review, approve, and record bank reference codes directly from the Admin Panel.
              </p>
            </div>
          </div>

          {/* Section 1: JazzCash */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-black text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              JazzCash Corporate Disbursal API (B2C)
            </div>
            <p>
              To automate instant payouts to user JazzCash wallets without admin manual transfers, the business must register with <strong>Mobilink Microfinance Bank / JazzCash Corporate Solutions</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
              <div><strong>Endpoint:</strong> <code>https://sandbox.jazzcash.com.pk/Application/API/2.0/Purchase/DoMWalletTransaction</code></div>
              <div><strong>Required Keys:</strong> <code>pp_MerchantID</code>, <code>pp_Password</code>, <code>pp_SecureHash</code></div>
              <div><strong>Format:</strong> SHA256 HMAC of sorted parameters with Integrity Salt</div>
            </div>
          </div>

          {/* Section 2: Easypaisa */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Easypaisa Open API Disbursal (B2C)
            </div>
            <p>
              Easypaisa requires approval from <strong>Telenor Microfinance Bank Merchant Services</strong> to enable bulk/instant account transfers to mobile accounts.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
              <div><strong>Endpoint:</strong> <code>https://easypaystg.easypaisa.com.pk/easypay-service/rest/v4/initiate-payout</code></div>
              <div><strong>Required Keys:</strong> <code>storeId</code>, <code>hashKey</code>, <code>accountNum</code>, <code>amount</code></div>
              <div><strong>IPN Webhook:</strong> Instant Payment Notification URL for status updates</div>
            </div>
          </div>

          {/* Section 3: Google AdMob Rewarded Ads */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-yellow-500/30 space-y-2">
            <div className="flex items-center gap-2 text-yellow-400 font-black text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              Google AdMob Rewarded Video Setup
            </div>
            <p>
              In production Android APK builds, link the AdMob App ID in <code>AndroidManifest.xml</code> and provide the <code>REWARDED_AD_UNIT_ID</code> in the Admin Settings tab. The current web environment uses an authenticated AdMob Rewarded Video simulation that strictly verifies 15-second completion callbacks.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
