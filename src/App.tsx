import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { VideoFeed } from './components/VideoFeed';
import { EarnCenter } from './components/EarnCenter';
import { WalletScreen } from './components/WalletScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { CreateVideoModal } from './components/CreateVideoModal';
import { WithdrawModal } from './components/WithdrawModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { CommentsModal } from './components/CommentsModal';
import { ShareModal } from './components/ShareModal';
import { ReportModal } from './components/ReportModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ChannelView } from './components/ChannelView';
import { MerchantDocsModal } from './components/MerchantDocsModal';
import { AuthModal } from './components/AuthModal';
import { SplashScreen } from './components/SplashScreen';
import { Toast } from './components/Toast';
import { Video } from './types';

const MainApp: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isAdminMode, 
    isDarkMode, 
    setActiveVideoIndex, 
    videos 
  } = useApp();

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState<boolean>(false);
  const [isMerchantDocsOpen, setIsMerchantDocsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  
  const [activeCommentVideo, setActiveCommentVideo] = useState<Video | null>(null);
  const [activeShareVideo, setActiveShareVideo] = useState<Video | null>(null);
  const [activeReportVideo, setActiveReportVideo] = useState<Video | null>(null);
  const [viewChannelCreatorId, setViewChannelCreatorId] = useState<string | null>(null);

  const handleSelectVideoFromProfile = (video: Video) => {
    const idx = videos.findIndex(v => v.id === video.id);
    if (idx >= 0) {
      setActiveVideoIndex(idx);
    }
    setActiveTab('home');
  };

  return (
    <div className={`min-h-screen w-full transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Professional Splash Screen on first launch */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Toast Notification Container */}
      <Toast />

      {/* Main Container: Mobile Frame vs Full Viewport */}
      <div className={`mx-auto transition-all ${
        isMobileFrame 
          ? 'max-w-[420px] my-4 rounded-[40px] border-8 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden min-h-[850px] relative bg-slate-950' 
          : 'w-full min-h-screen'
      }`}>
        {/* Android Top Phone Status Bar (shown when in mockup frame mode) */}
        {isMobileFrame && (
          <div className="bg-black text-[11px] text-slate-400 px-6 py-2 flex items-center justify-between border-b border-slate-900 select-none">
            <span className="font-bold text-white">09:41</span>
            {/* Center camera punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
              <span>5G Jazz</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar 
          onOpenNotifications={() => setIsNotifsOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Content Area */}
        <main className="w-full">
          {isAdminMode ? (
            <AdminDashboard />
          ) : (
            <>
              {activeTab === 'home' && (
                <VideoFeed 
                  onOpenComments={(v) => setActiveCommentVideo(v)}
                  onOpenShare={(v) => setActiveShareVideo(v)}
                  onOpenReport={(v) => setActiveReportVideo(v)}
                  onViewChannel={(id) => setViewChannelCreatorId(id)}
                />
              )}

              {activeTab === 'following' && (
                <VideoFeed 
                  onOpenComments={(v) => setActiveCommentVideo(v)}
                  onOpenShare={(v) => setActiveShareVideo(v)}
                  onOpenReport={(v) => setActiveReportVideo(v)}
                  onViewChannel={(id) => setViewChannelCreatorId(id)}
                />
              )}

              {activeTab === 'earn' && (
                <EarnCenter 
                  onOpenAdModal={() => setIsAdModalOpen(true)}
                  onOpenCreate={() => setIsCreateOpen(true)}
                />
              )}

              {activeTab === 'wallet' && (
                <WalletScreen 
                  onOpenWithdraw={() => setIsWithdrawOpen(true)}
                  onOpenMerchantDocs={() => setIsMerchantDocsOpen(true)}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen 
                  onOpenWithdraw={() => setIsWithdrawOpen(true)}
                  onOpenCreate={() => setIsCreateOpen(true)}
                  onSelectVideo={handleSelectVideoFromProfile}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation Bar */}
        {!isAdminMode && (
          <BottomNav onOpenCreate={() => setIsCreateOpen(true)} />
        )}
      </div>

      {/* Global Interactive Modals */}
      <CreateVideoModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <WithdrawModal 
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />

      <RewardedAdModal 
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
      />

      <CommentsModal 
        video={activeCommentVideo}
        isOpen={!!activeCommentVideo}
        onClose={() => setActiveCommentVideo(null)}
      />

      <ShareModal 
        video={activeShareVideo}
        isOpen={!!activeShareVideo}
        onClose={() => setActiveShareVideo(null)}
      />

      <ReportModal 
        video={activeReportVideo}
        isOpen={!!activeReportVideo}
        onClose={() => setActiveReportVideo(null)}
      />

      <NotificationsModal 
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
      />

      <ChannelView 
        creatorId={viewChannelCreatorId}
        onClose={() => setViewChannelCreatorId(null)}
        onSelectVideo={handleSelectVideoFromProfile}
      />

      <MerchantDocsModal 
        isOpen={isMerchantDocsOpen}
        onClose={() => setIsMerchantDocsOpen(false)}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
