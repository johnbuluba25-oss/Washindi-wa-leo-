import React from 'react';
import { Home, Flame, Crown, CheckCircle2, Megaphone, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  hasActiveVip?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  onNavigate,
  hasActiveVip,
}) => {
  const navItems = [
    { id: 'home', label: 'Nyumbani', icon: Home },
    { id: 'mikeka', label: 'Mikeka', icon: Flame, badge: 'LEO' },
    { id: 'vip', label: 'VIP', icon: Crown, isVip: true },
    { id: 'matokeo', label: 'Matokeo', icon: CheckCircle2 },
    { id: 'matangazo', label: 'Matangazo', icon: Megaphone },
    { id: 'profile', label: 'Akaunti', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c18]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          if (item.isVip) {
            return (
              <button
                key={item.id}
                id={`btn-bottomnav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className="relative -top-3 flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isActive || hasActiveVip
                      ? 'bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 text-slate-950 ring-4 ring-amber-500/20 shadow-amber-500/30'
                      : 'bg-gradient-to-tr from-amber-600 to-amber-700 text-white ring-2 ring-slate-900'
                  }`}
                >
                  <Crown className="w-6 h-6 fill-current" />
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${
                    isActive ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  VIP
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`btn-bottomnav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center py-1 px-2 rounded-lg transition-colors active:scale-95 focus:outline-none ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 text-[8px] font-black bg-rose-500 text-white rounded-full leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
