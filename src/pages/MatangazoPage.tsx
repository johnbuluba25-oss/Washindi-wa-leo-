import React from 'react';
import { Megaphone, ExternalLink, Sparkles, Bell, Shield, Users } from 'lucide-react';
import { Advertisement } from '../types';

interface MatangazoPageProps {
  banners: Advertisement[];
  onNavigate: (page: string) => void;
  onOpenWhatsApp: () => void;
}

export const MatangazoPage: React.FC<MatangazoPageProps> = ({ banners, onNavigate, onOpenWhatsApp }) => {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="rounded-3xl bg-[#0a1226] border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase mb-3">
          <Megaphone className="w-3.5 h-3.5 fill-amber-400" />
          <span>MATANGAZO & TAARIFA MUHIMU</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
          Matangazo na Habari za Washindi
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Pata matangazo ya ofa maalum, taarifa za kujiunga na group letu la WhatsApp, na miongozo ya kubetia kwa nidhamu.
        </p>
      </div>

      {/* Official Banners Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ofa na Matangazo ya Leo</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {banner.badgeText && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow-md">
                    {banner.badgeText}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-amber-400 transition-colors">
                    {banner.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {banner.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Ofa Maalum • WASHINDI WA LEO</span>
                  <button
                    id={`btn-ad-action-${banner.id}`}
                    onClick={() => {
                      if (banner.buttonLink === '#vip') onNavigate('vip');
                      else if (banner.buttonLink.startsWith('http')) window.open(banner.buttonLink, '_blank');
                      else onOpenWhatsApp();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>{banner.buttonText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Guidelines of Responsible Tips */}
      <div className="rounded-3xl bg-[#091024] border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Kanuni na Miongozo ya Mikeka ya Soka</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <h4 className="font-bold text-amber-400 text-sm mb-1">1. Gawanya Mtaji (Bankroll Management)</h4>
            <p className="text-slate-400">Usitumie pesa zote za akiba kwenye mkeka mmoja. Bet kiasi ambacho haitaathiri maisha yako.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <h4 className="font-bold text-amber-400 text-sm mb-1">2. Fuata Mikeka ya Wataalamu</h4>
            <p className="text-slate-400">Wachambuzi wetu wanachambua fomu za timu, majeruhi na historia ya ushindi kabla ya kupendekeza mkeka.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <h4 className="font-bold text-amber-400 text-sm mb-1">3. Uvumilivu na Nidhamu</h4>
            <p className="text-slate-400">Ushindi wa muda mrefu unategemea nidhamu na uthabiti wa kufuata mikeka kila siku.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
