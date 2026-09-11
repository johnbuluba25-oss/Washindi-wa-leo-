import React, { useState } from 'react';
import { Trophy, CheckCircle, Award, TrendingUp, Calendar, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { Prediction } from '../types';
import { PredictionCard } from '../components/PredictionCard';

interface MatokeoPageProps {
  predictions: Prediction[];
  onUnlockVip: (category: string) => void;
}

export const MatokeoPage: React.FC<MatokeoPageProps> = ({ predictions, onUnlockVip }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Filter won or finished predictions
  const wonPredictions = (predictions || []).filter((p) => p.status === 'WON');
  const filteredList = wonPredictions.filter((p) => {
    if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#081813] border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase mb-3">
            <Trophy className="w-3.5 h-3.5 fill-emerald-400 stroke-[2.5]" />
            <span>USHINDI WA UHAKIKA 100% • REKODI RASMI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            Matokeo & <span className="text-emerald-400">Ushindi wa Mikeka</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Hapa tunaonyesha ukweli na uwazi wa mikeka yote iliyotiki na kuwapa faida wateja wetu. 
            Tazama historia ya Odds 5, 10, 15 na Super Odds 20 zilizoshinda.
          </p>

          {/* Metrics summary */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Ushindi Wastani</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-display">94.8%</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Odds Kubwa Zaidi</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-display">21.30</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Mikeka Iliyotiki</span>
              <span className="text-xl sm:text-2xl font-black text-white font-display">580+</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Wateja Walioridhika</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-300 font-display">4,200+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'Zote Zilizotiki' },
            { id: 'FREE', label: 'Bure (Free)' },
            { id: 'ODDS_5', label: 'VIP Odds 5' },
            { id: 'ODDS_10', label: 'VIP Odds 10' },
            { id: 'ODDS_20', label: 'Super Odds 20' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`btn-matokeo-tab-${tab.id}`}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Won Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.length > 0 ? (
          filteredList.map((pred) => (
            <PredictionCard key={pred.id} prediction={pred} onUnlockVip={onUnlockVip} />
          ))
        ) : (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            Hakuna matokeo kwa aina hii kwa sasa.
          </div>
        )}
      </div>

      {/* Testimonials / Social Proof Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Kauli za Wateja Wetu wa Tanzania</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Ushuhuda wa baadhi ya wanachama wetu wa VIP wa kila siku</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <p className="italic">"Jana niliweka Odds 10 nikapiga faida safi sana ya laki tano. Kazi yenu ni ya uhakika kabisa SMK!"</p>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-400">Bakari M. (Dar es Salaam)</span>
              <span className="text-emerald-400 font-semibold">VIP Odds 10</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <p className="italic">"Kifurushi cha wiki ndio mpango mzima. Kila asubuhi mikeka inakuja mapema na inatiki vizuri."</p>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-400">Kelvin K. (Arusha)</span>
              <span className="text-emerald-400 font-semibold">Kifurushi cha Wiki</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <p className="italic">"Nilituma pesa kwa 0743997707 na baada ya dakika mbili nilifunguliwa VIP. Huduma yao ya WhatsApp iko chap sana!"</p>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-400">Sarah J. (Mwanza)</span>
              <span className="text-emerald-400 font-semibold">VIP Odds 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
