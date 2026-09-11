import React, { useState } from 'react';
import { Search, Flame, Crown, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { Prediction } from '../types';
import { PredictionCard } from '../components/PredictionCard';

interface MikekaPageProps {
  predictions: Prediction[];
  onUnlockVip: (category: string) => void;
}

export const MikekaPage: React.FC<MikekaPageProps> = ({ predictions, onUnlockVip }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'WON'>('PENDING');

  const categories = [
    { id: 'ALL', label: 'Zote' },
    { id: 'FREE', label: 'Bure (Free)' },
    { id: 'ODDS_5', label: 'Odds 5' },
    { id: 'ODDS_10', label: 'Odds 10' },
    { id: 'ODDS_15', label: 'Odds 15' },
    { id: 'ODDS_20', label: 'Super Odds 20' },
  ];

  const filteredPredictions = (predictions || []).filter((p) => {
    // Status filter
    if (statusFilter === 'PENDING' && p.status !== 'PENDING') return false;
    if (statusFilter === 'WON' && p.status !== 'WON') return false;

    // Category filter
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMatch = p.match.toLowerCase().includes(q);
      const matchLeague = p.league.toLowerCase().includes(q);
      const matchPred = p.prediction.toLowerCase().includes(q);
      return matchMatch || matchLeague || matchPred;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-3xl bg-[#091024] border border-amber-500/30 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase mb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Mikeka na Tips za Michezo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Mikeka ya Leo (Today's Predictions)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Mechi zote zimechambuliwa kwa umakini wa hali ya juu na jopo letu la wataalamu wa soka.
            </p>
          </div>

          <button
            id="btn-mikeka-buy-vip"
            onClick={() => onUnlockVip('VIP')}
            className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>FUNGUA VIP ZOTE</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-search-mikeka"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tafuta mechi, timu au ligi (mfano: Real Madrid, Arsenal, NBC)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Tabs (Leo vs Matokeo) */}
          <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 shrink-0">
            <button
              id="btn-filter-status-pending"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mechi za Leo
            </button>
            <button
              id="btn-filter-status-won"
              onClick={() => setStatusFilter('WON')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'WON'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Zilizotiki (Won)
            </button>
            <button
              id="btn-filter-status-all"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mechi Zote
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="mt-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`pill-category-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPredictions.length > 0 ? (
          filteredPredictions.map((pred) => (
            <PredictionCard
              key={pred.id}
              prediction={pred}
              onUnlockVip={onUnlockVip}
            />
          ))
        ) : (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">
              Hakuna mkeka unaolingana na vigezo vyako kwa sasa.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Jaribu kubadilisha jina unalotafuta au chagua aina nyingine ya mkeka.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
