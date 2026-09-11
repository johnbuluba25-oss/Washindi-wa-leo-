import React, { useState, useEffect } from 'react';
import {
  Package,
  Prediction,
  Advertisement,
  User,
  Subscription,
  AppNotification,
  AppSettings,
} from './types';
import { api, authStorage } from './services/api';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { WhatsAppSupportModal } from './components/WhatsAppSupportModal';
import { NotificationModal } from './components/NotificationModal';

import { HomePage } from './pages/HomePage';
import { MikekaPage } from './pages/MikekaPage';
import { VipPage } from './pages/VipPage';
import { MatokeoPage } from './pages/MatokeoPage';
import { MatangazoPage } from './pages/MatangazoPage';
import { ProfilePage } from './pages/ProfilePage';
import { HelpPage } from './pages/HelpPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [banners, setBanners] = useState<Advertisement[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedPackageForPayment, setSelectedPackageForPayment] = useState<Package | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Check URL hash for direct routing or admin access (e.g. #admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setCurrentPage('admin');
      } else if (['home', 'mikeka', 'vip', 'matokeo', 'matangazo', 'profile', 'help'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when page changes
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch public items
      const [sett, pkgs, preds, bans] = await Promise.all([
        api.getSettings(),
        api.getPackages(),
        api.getPredictions(),
        api.getBanners(),
      ]);
      setSettings(sett);
      setPackages(pkgs);
      setPredictions(preds);
      setBanners(bans);

      // Check current logged in user
      if (authStorage.getUserToken()) {
        try {
          const userData = await api.getMe();
          if (userData) {
            setUser(userData.user);
            setActiveSubscriptions(userData.activeSubscriptions || []);
            const notifs = await api.getNotifications();
            setNotifications(notifs || []);
          }
        } catch {
          // Token expired or invalid
          authStorage.removeUserToken();
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Error loading initial app data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data (subscriptions, predictions lock state, notifications)
  const refreshUserData = async () => {
    try {
      const [preds, userData] = await Promise.all([
        api.getPredictions(),
        authStorage.getUserToken() ? api.getMe() : Promise.resolve(null),
      ]);
      setPredictions(preds || []);
      if (userData) {
        setUser(userData.user);
        setActiveSubscriptions(userData.activeSubscriptions || []);
        const notifs = await api.getNotifications();
        setNotifications(notifs || []);
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
  };

  // Live countdown timer for active subscriptions (decrements seconds every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSubscriptions((prev) =>
        (prev || []).map((sub) => {
          if (sub.remainingSeconds && sub.remainingSeconds > 0) {
            return {
              ...sub,
              remainingSeconds: sub.remainingSeconds - 1,
            };
          }
          return sub;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auth success
  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setIsAuthOpen(false);
    refreshUserData();
  };

  // Logout
  const handleLogout = () => {
    api.logout();
    setUser(null);
    setActiveSubscriptions([]);
    setNotifications([]);
    refreshUserData();
  };

  // Package select triggers manual payment modal
  const handleSelectPackage = (pkg: Package) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedPackageForPayment(pkg);
  };

  // If viewing admin page, render completely separate admin layout
  if (currentPage === 'admin') {
    return <AdminPage onBackToApp={() => navigateTo('home')} />;
  }

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        user={user}
        activeSubscriptions={activeSubscriptions}
        notifications={notifications}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5 pb-20 md:pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-xs sm:text-sm font-bold text-amber-300 animate-pulse font-display">
              Inapakia WASHINDI WA LEO...
            </p>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                user={user}
                packages={packages}
                predictions={predictions}
                banners={banners}
                activeSubscriptions={activeSubscriptions}
                onNavigate={navigateTo}
                onSelectPackage={handleSelectPackage}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              />
            )}

            {currentPage === 'mikeka' && (
              <MikekaPage
                predictions={predictions}
                onUnlockVip={(cat) => navigateTo('vip')}
              />
            )}

            {currentPage === 'vip' && (
              <VipPage
                packages={packages}
                activeSubscriptions={activeSubscriptions}
                predictions={predictions}
                onSelectPackage={handleSelectPackage}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              />
            )}

            {currentPage === 'matokeo' && (
              <MatokeoPage
                predictions={predictions}
                onUnlockVip={() => navigateTo('vip')}
              />
            )}

            {currentPage === 'matangazo' && (
              <MatangazoPage
                banners={banners}
                onNavigate={navigateTo}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                user={user}
                activeSubscriptions={activeSubscriptions}
                onOpenAuth={() => setIsAuthOpen(true)}
                onLogout={handleLogout}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'help' && (
              <HelpPage
                settings={settings}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Subtle Desktop & Mobile Footer */}
      <footer className="hidden md:block border-t border-slate-800/80 bg-[#070d1d] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-sm text-white tracking-wider">
              WASHINDI <span className="text-amber-400">WA LEO</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">
              Jukwaa la Uhakika la Mauzo ya Mikeka ya Soka Tanzania
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => navigateTo('help')} className="hover:text-amber-400 transition-colors">
              Msaada & WhatsApp (0743997707)
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={() => navigateTo('vip')} className="hover:text-amber-400 transition-colors">
              Vifurushi vya VIP
            </button>
            <span className="text-slate-700">•</span>
            {/* Discreet Admin Entrance */}
            <button
              id="link-footer-admin"
              onClick={() => navigateTo('admin')}
              className="text-slate-500 hover:text-amber-400 transition-colors"
              title="Paneli ya Msimamizi"
            >
              Msimamizi
            </button>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button for Mobile */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <button
          id="btn-floating-wa"
          onClick={() => setIsWhatsAppOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-950/80 border-2 border-emerald-400/40 active:scale-95 transition-transform"
          aria-label="WhatsApp Support"
        >
          <span className="text-xl">💬</span>
        </button>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={navigateTo}
        hasActiveVip={(activeSubscriptions || []).some((s) => s.status === 'ACTIVE' && (s.remainingSeconds || 0) > 0)}
      />

      {/* Modals */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {selectedPackageForPayment && (
        <PaymentModal
          pkg={selectedPackageForPayment}
          user={user}
          onClose={() => setSelectedPackageForPayment(null)}
          onOpenAuth={() => {
            setSelectedPackageForPayment(null);
            setIsAuthOpen(true);
          }}
          onSuccessSubmitted={() => {
            refreshUserData();
          }}
        />
      )}

      {isWhatsAppOpen && (
        <WhatsAppSupportModal
          settings={settings}
          onClose={() => setIsWhatsAppOpen(false)}
        />
      )}

      {isNotificationOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setIsNotificationOpen(false)}
          onRefresh={refreshUserData}
        />
      )}
    </div>
  );
}
