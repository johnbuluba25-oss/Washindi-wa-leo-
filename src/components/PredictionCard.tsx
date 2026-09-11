import React, { useState } from 'react';
import { Trophy, Clock, CheckCircle, Lock, ShieldCheck, Copy, Check, Sparkles } from 'lucide-react';
import { Prediction } from '../types';

interface PredictionCardProps {
  prediction: Prediction;
  onUnlockVip?: (category: string) => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onUnlockVip }) => {
  const [copied, setCopied] = useState(false);

  const isWon = prediction.status === 'WON';
  const isLost = prediction.status === 'LOST';
  const isLocked = prediction.isLocked;

  const handleCopyCode = () => {
    if (!prediction.slipCode) return;
    navigator.clipboard.writeText(prediction.slipCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatMatchTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const timeStr = date.toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
      return isToday ? `Leo ${timeStr}` : `${date.getDate()}/${date.getMonth() + 1} • ${timeStr}`;
    } catch {
      return 'Leo';
    }
  };

  // Category badge mapping
  const getCategoryBadge = () => {
    switch (prediction.category) {
      case 'FREE':
        return { label: 'BURE / FREE', color: 'bg-slate-800 text-slate-300 border-slate-700' };
      case 'ODDS_5':
        return { label: 'VIP ODDS 5', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'ODDS_10':
        return { label: 'VIP ODDS 10', color: 'bg-amber-500/25 text-amber-300 border-amber-500/50' };
      case 'ODDS_15':
        return { label: 'VIP ODDS 15', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' };
      case 'ODDS_20':
        return { label: 'SUPER VIP ODDS 20', color: 'bg-gradient-to-r from-amber-500/30 to-yellow-400/30 text-amber-200 border-amber-400/60' };
      default:
        return { label: 'VIP PRO', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
  };

  const badge = getCategoryBadge();

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
        isWon
          ? 'bg-[#081813] border-2 border-emerald-500/70 shadow-lg shadow-emerald-950/40'
          : isLocked
          ? 'bg-[#0a0f1d] border border-amber-500/20 hover:border-amber-500/40'
          : 'bg-[#0b1224] border border-slate-800/80 hover:border-amber-500/30 shadow-md'
      }`}
    >
      {/* Top Header: League & Match Time & Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-bold text-[11px] tracking-wide uppercase border border-slate-700/60">
            {prediction.league}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${badge.color}`}>
            {badge.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-amber-400/80" />
          <span>{formatMatchTime(prediction.matchTime)}</span>
        </div>
      </div>

      {/* Match Teams Title */}
      <div className="my-2">
        <h4 className="text-base sm:text-lg font-bold text-white font-display tracking-tight flex items-center justify-between">
          <span>{prediction.match}</span>
          {isWon && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />
              IMETIKI!
            </span>
          )}
          {isLost && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-xs uppercase">
              IMEKOSA
            </span>
          )}
        </h4>

        {prediction.resultScore && (
          <p className="text-xs text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            Matokeo: <span className="text-white bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">{prediction.resultScore}</span>
          </p>
        )}
      </div>

      {/* Prediction & Odds Row */}
      {isLocked ? (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 flex flex-col items-center justify-center text-center">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-200">
            Mkeka Huu ni wa VIP
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
            Lipa kifurushi cha {prediction.category.replace('_', ' ')} kufungua timu zote na utabiri kamili.
          </p>
          <button
            id={`btn-unlock-${prediction.id}`}
            onClick={() => onUnlockVip && onUnlockVip(prediction.category)}
            className="mt-2.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>FUNGUA VIP SASA</span>
          </button>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* Prediction Box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Utabiri (Pick)
            </span>
            <span className="text-sm sm:text-base font-black text-amber-400 tracking-tight">
              {prediction.prediction}
            </span>
          </div>

          {/* Odds Box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Odds
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-white font-display">
                {prediction.odds.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">ODDS</span>
            </div>
          </div>
        </div>
      )}

      {/* Analysis & Confidence Bar (if unlocked) */}
      {!isLocked && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-2">
          {prediction.analysis && (
            <p className="text-xs text-slate-300/90 leading-relaxed italic">
              "{prediction.analysis}"
            </p>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Uhakika: <strong className="text-emerald-400">{prediction.confidence}%</strong></span>
            </div>

            {prediction.slipCode && (
              <button
                id={`btn-copy-code-${prediction.id}`}
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
                title="Nakili Code ya Mkeka"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Imenakiliwa!' : prediction.slipCode}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
