import React from 'react';
import { Crown, CheckCircle, Zap, Shield, Sparkles, Clock } from 'lucide-react';
import { Package, Subscription } from '../types';

interface VIPPackageCardProps {
  pkg: Package;
  activeSub?: Subscription;
  onSelectPackage: (pkg: Package) => void;
}

export const VIPPackageCard: React.FC<VIPPackageCardProps> = ({ pkg, activeSub, onSelectPackage }) => {
  const isCurrentlyActive = activeSub && activeSub.status === 'ACTIVE' && (activeSub.remainingSeconds || 0) > 0;

  const formatRemainingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} Siku ${hours % 24} Masaa`;
    }
    return `${hours}h ${minutes}m`;
  };

  const isHighlighted = pkg.code === 'ODDS_10' || pkg.code === 'WIKI' || pkg.code === 'MWEZI';

  return (
    <div
      className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
        isCurrentlyActive
          ? 'bg-[#081813] border-2 border-emerald-500 shadow-xl shadow-emerald-950/30'
          : isHighlighted
          ? 'bg-gradient-to-b from-[#11192e] to-[#0a0f1e] border-2 border-amber-500/60 shadow-xl shadow-amber-950/20'
          : 'bg-[#0b1224] border border-slate-800 hover:border-amber-500/40 shadow-lg'
      }`}
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Crown className="w-4 h-4 fill-amber-400/40" />
          </div>
          <span className="font-mono text-xs font-bold text-slate-400">
            {pkg.targetOdds}
          </span>
        </div>

        {pkg.badge && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm">
            {pkg.badge}
          </span>
        )}

        {isCurrentlyActive && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1 animate-pulse">
            <CheckCircle className="w-3 h-3" />
            HAI SASA
          </span>
        )}
      </div>

      {/* Package Name & Price */}
      <div>
        <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
          {pkg.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
            TZS {pkg.price.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            / {pkg.durationLabel}
          </span>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {pkg.description}
        </p>

        {/* Feature bullets */}
        <div className="mt-4 space-y-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Uhakika wa Matokeo: <strong className="text-amber-300">{pkg.confidenceRate}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Muda: <strong className="text-white">{pkg.durationLabel}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Uchambuzi wa Wataalamu wa Soka</span>
          </div>
        </div>
      </div>

      {/* Active Subscription Remaining Time or Buy Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        {isCurrentlyActive ? (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-bold">
              <Clock className="w-4 h-4" />
              <span>Muda Uliobaki:</span>
            </div>
            <p className="text-base font-black text-white font-mono mt-0.5">
              {formatRemainingTime(activeSub.remainingSeconds || 0)}
            </p>
            <p className="text-[10px] text-emerald-400/80 mt-0.5">
              Hadi: {new Date(activeSub.expiresAt).toLocaleDateString('sw-TZ')}
            </p>
          </div>
        ) : (
          <button
            id={`btn-select-pkg-${pkg.code}`}
            onClick={() => onSelectPackage(pkg)}
            className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              isHighlighted
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:scale-[1.02]'
                : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700 hover:border-amber-400'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>NUNUA VIP • TZS {pkg.price.toLocaleString()}</span>
          </button>
        )}
      </div>
    </div>
  );
};
