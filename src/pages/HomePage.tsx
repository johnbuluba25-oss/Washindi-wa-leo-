import React from 'react';
import { Trophy, Flame, Crown, CheckCircle2, MessageCircle, ShieldCheck, ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Package, Prediction, Advertisement, Subscription, User } from '../types';
import { PromoCarousel } from '../components/PromoCarousel';
import { PredictionCard } from '../components/PredictionCard';
import { VIPPackageCard } from '../components/VIPPackageCard';

interface HomePageProps {
  user: User | null;
  packages: Package[];
  predictions: Prediction[];
  banners: Advertisement[];
  activeSubscriptions: Subscription[];
  onNavigate: (page: string) => void;
  onSelectPackage: (pkg: Package) => void;
  onOpenWhatsApp: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  packages,
  predictions,
  banners,
  activeSubscriptions,
  onNavigate,
  onSelectPackage,
  onOpenWhatsApp,
}) => {
  const freeTips = (predictions || []).filter((p) => p.category === 'FREE' && p.status === 'PENDING').slice(0, 3);
  const vipTipsPreview = (predictions || []).filter((p) => p.category !== 'FREE' && p.status === 'PENDING').slice(0, 3);
  const recentWonTips = (predictions || []).filter((p) => p.status === 'WON').slice(0, 3);

  const handleBannerAction = (link: string) => {
    if (link === '#vip') {
      onNavigate('vip');
    } else if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      onNavigate('mikeka');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1630] via-[#091024] to-[#060b18] border border-amber-500/30 p-5 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Jukwaa Namba 1 la Ushindi Tanzania</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight">
              Karibu <span className="gold-gradient-text">WASHINDI WA LEO</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
              Pata mikeka ya uhakika ya soka ya leo iliyofanyiwa uchambuzi wa kina na wataalamu. 
              Odds 5, Odds 10, Odds 15 na Super VIP Odds 20 zilizothibitishwa.
            </p>

            {/* Stats highlight pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Ushindi wa Uhakika: <strong className="text-emerald-400">94%+</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Malipo ya Haraka: <strong className="text-white">0743997707</strong></span>
              </div>
            </div>
          </div>

          {/* Quick CTA Card */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              id="btn-hero-vip"
              onClick={() => onNavigate('vip')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Crown className="w-4 h-4" />
              <span>NUNUA VIP SASA</span>
            </button>

            <button
              id="btn-hero-wa"
              onClick={onOpenWhatsApp}
              className="px-5 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 0743997707</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-sliding Advertisement Carousel */}
      {banners.length > 0 && (
        <section>
          <PromoCarousel banners={banners} onActionClick={handleBannerAction} />
        </section>
      )}

      {/* Today's Free Tips Section */}
      <section>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Mikeka ya Bure ya Leo (Free Tips)
              </h2>
              <p className="text-[11px] text-slate-400">Pata mechi salama zilizochambuliwa bure kila siku</p>
            </div>
          </div>

          <button
            id="btn-view-all-free"
            onClick={() => onNavigate('mikeka')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Ona Yote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {freeTips.length > 0 ? (
            freeTips.map((pred) => (
              <PredictionCard key={pred.id} prediction={pred} onUnlockVip={() => onNavigate('vip')} />
            ))
          ) : (
            <div className="col-span-full p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
              Mikeka ya bure ya leo inamaliziwa kuchambuliwa. Itatua hivi punde!
            </div>
          )}
        </div>
      </section>

      {/* VIP Packages Section */}
      <section>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black">
              <Crown className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Vifurushi vya VIP (Ushindi wa Uhakika)
              </h2>
              <p className="text-[11px] text-slate-400">Chagua kifurushi chako uanze kushinda mara moja</p>
            </div>
          </div>

          <button
            id="btn-view-all-vip"
            onClick={() => onNavigate('vip')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Vifurushi Vyote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.slice(0, 3).map((pkg) => {
            const activeSub = activeSubscriptions.find((s) => s.packageId === pkg.id && s.status === 'ACTIVE');
            return (
              <VIPPackageCard
                key={pkg.id}
                pkg={pkg}
                activeSub={activeSub}
                onSelectPackage={onSelectPackage}
              />
            );
          })}
        </div>
      </section>

      {/* Today's VIP Previews (Teaser) */}
      <section>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Mikeka ya VIP ya Leo (Mbio za Ushindi)
              </h2>
              <p className="text-[11px] text-slate-400">Odds 5, Odds 10, Odds 15 na Super Odds 20</p>
            </div>
          </div>

          <button
            id="btn-view-all-mikeka"
            onClick={() => onNavigate('mikeka')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Mikeka Yote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {vipTipsPreview.map((pred) => (
            <PredictionCard key={pred.id} prediction={pred} onUnlockVip={() => onNavigate('vip')} />
          ))}
        </div>
      </section>

      {/* Recent Won Results Showcase */}
      <section className="rounded-3xl bg-[#081813] border border-emerald-500/40 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Trophy className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                <span>Ushindi wa Hivi Karibuni</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-black">
                  BOOOM!
                </span>
              </h3>
              <p className="text-[11px] text-emerald-300/80">Matokeo ya mechi zilizopita zilizotiki 100%</p>
            </div>
          </div>

          <button
            id="btn-view-all-results"
            onClick={() => onNavigate('matokeo')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Matokeo Zaidi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentWonTips.map((pred) => (
            <div
              key={pred.id}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold mb-1">
                  <span>{pred.league}</span>
                  <span className="text-emerald-400 font-black">IMETIKI</span>
                </div>
                <h4 className="font-bold text-sm text-white">{pred.match}</h4>
                <p className="text-xs text-amber-300 font-semibold mt-1">
                  Utabiri: {pred.prediction}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Score: <strong className="text-white font-mono">{pred.resultScore || 'WON'}</strong></span>
                <span className="font-bold text-emerald-400 font-display text-sm">Odds: {pred.odds.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tanzanian Payment & Support Guarantee Footer Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 text-center">
        <h4 className="text-base sm:text-lg font-bold text-white font-display">
          Lipa kwa Usalama Kupitia Mitandao Yote Tanzania
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
          M-Pesa, Tigo Pesa, Airtel Money, Halopesa kwenda namba <strong className="text-amber-400 font-mono">0743997707</strong>.
          Msimamizi anathibitisha malipo yako na kufungua VIP papo hapo.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('vip')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
          >
            Angalia Vifurushi vya VIP
          </button>
          <button
            onClick={onOpenWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp (0743997707)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
