import React from 'react';
import { Trophy, Crown, Bell, MessageCircle, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { User, Subscription, AppNotification } from '../types';

interface NavbarProps {
  user: User | null;
  activeSubscriptions?: Subscription[];
  notifications?: AppNotification[];
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenWhatsApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeSubscriptions = [],
  notifications = [],
  currentPage,
  onNavigate,
  onOpenAuth,
  onOpenNotifications,
  onOpenWhatsApp,
}) => {
  const unreadNotifsCount = (notifications || []).filter((n) => !n.read).length;
  const hasActiveVip = (activeSubscriptions || []).some((s) => s.status === 'ACTIVE' && (s.remainingSeconds || 0) > 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d1a]/95 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          id="btn-nav-home"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight font-display text-white group-hover:text-amber-400 transition-colors">
                WASHINDI <span className="text-amber-400">WA LEO</span>
              </span>
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30 hidden sm:inline" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Mikeka ya Uhakika 100%
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {[
            { id: 'home', label: 'Nyumbani' },
            { id: 'mikeka', label: 'Mikeka ya Leo' },
            { id: 'vip', label: 'VIP Packages' },
            { id: 'matokeo', label: 'Matokeo & Ushindi' },
            { id: 'matangazo', label: 'Matangazo' },
            { id: 'help', label: 'Msaada / WhatsApp' },
          ].map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-desktop-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* VIP Status Pill */}
          {hasActiveVip ? (
            <div
              onClick={() => onNavigate('vip')}
              className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm emerald-glow"
              title="Una Kifurushi cha VIP kilicho Hai"
            >
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              <span className="hidden sm:inline">VIP HAI</span>
            </div>
          ) : (
            <button
              id="btn-nav-buy-vip"
              onClick={() => onNavigate('vip')}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>NUNUA VIP</span>
            </button>
          )}

          {/* WhatsApp Support Button */}
          <button
            id="btn-nav-whatsapp"
            onClick={onOpenWhatsApp}
            className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
            title="Wasiliana WhatsApp: 0743997707"
          >
            <MessageCircle className="w-5 h-5 fill-emerald-400/20" />
          </button>

          {/* Notification Button */}
          {user && (
            <button
              id="btn-nav-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
              title="Taarifa"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Login Button */}
          {user ? (
            <button
              id="btn-nav-profile"
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                currentPage === 'profile'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-600'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
            </button>
          ) : (
            <button
              id="btn-nav-login"
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Ingia</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
