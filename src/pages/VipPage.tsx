import React, { useState } from 'react';
import { Crown, Sparkles, ShieldCheck, CheckCircle2, Clock, Phone, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { Package, Subscription, Prediction } from '../types';
import { VIPPackageCard } from '../components/VIPPackageCard';
import { PredictionCard } from '../components/PredictionCard';

interface VipPageProps {
  packages: Package[];
  activeSubscriptions: Subscription[];
  predictions: Prediction[];
  onSelectPackage: (pkg: Package) => void;
  onOpenWhatsApp: () => void;
}

export const VipPage: React.FC<VipPageProps> = ({
  packages,
  activeSubscriptions,
  predictions,
  onSelectPackage,
  onOpenWhatsApp,
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'my-vip'>('packages');

  const liveSubs = (activeSubscriptions || []).filter((s) => s.status === 'ACTIVE' && (s.remainingSeconds || 0) > 0);
  const hasLiveVip = liveSubs.length > 0;

  // VIP Predictions that are unlocked for this user
  const unlockedVipPredictions = (predictions || []).filter((p) => p.category !== 'FREE' && !p.isLocked);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121a36] via-[#091124] to-[#060b18] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase mb-3">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>KLABU YA WASHINDI WA UHAKIKA</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            Vifurushi vya <span className="gold-gradient-text">VIP Packages</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Chagua kifurushi cha Odds 5, 10, 15 au 20 upokee mikeka ya ushindi wa kila siku. 
            Lipa kupitia M-Pesa kwenda <strong className="text-amber-400 font-mono">0743997707</strong>, 
            kisha bofya <strong className="text-white">"NIMELIPA"</strong> kuthibitisha.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              ⚡ Uthibitisho: <strong>Dakika 1-5</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              🔒 Ulinzi wa Data: <strong>100% Salama</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              📱 Namba ya Malipo: <strong className="text-amber-400 font-mono">0743997707</strong>
            </span>
          </div>
        </div>
      </div>

      {/* If user has live VIP subscriptions, show active dashboard */}
      {hasLiveVip && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#071813] border-2 border-emerald-500 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6 fill-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>VIP YAKO NI HAI SASA!</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-black">
                    ACTIVE
                  </span>
                </h3>
                <p className="text-xs text-emerald-300">
                  Unafurahia upatikanaji kamili wa mikeka ya VIP uliyolipia.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-switch-unlocked-tips"
                onClick={() => setActiveTab(activeTab === 'my-vip' ? 'packages' : 'my-vip')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                {activeTab === 'my-vip' ? 'Angalia Vifurushi Vingine' : 'Ona Mikeka Yangu ya VIP'}
              </button>
            </div>
          </div>

          {/* Active subscriptions list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveSubs.map((sub) => {
              const hours = Math.floor((sub.remainingSeconds || 0) / 3600);
              const minutes = Math.floor(((sub.remainingSeconds || 0) % 3600) / 60);

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/50 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      KIFURUSHI CHAKO KILICHO HAI
                    </span>
                    <h4 className="text-base font-black text-white mt-0.5">{sub.packageName}</h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Muda: <strong className="text-white font-mono">{hours}h {minutes}m</strong>
                    </span>
                    <span className="text-[10px] text-emerald-400">
                      Hadi: {new Date(sub.expiresAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unlocked Tips View (if active and toggled or has unlocked tips) */}
      {activeTab === 'my-vip' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              <span>Mikeka Yako ya VIP Iliyofunguka Leo</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              {unlockedVipPredictions.length} Mechi Zimefunguliwa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedVipPredictions.length > 0 ? (
              unlockedVipPredictions.map((pred) => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))
            ) : (
              <div className="col-span-full p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                Mikeka mipya ya VIP ya kifurushi hiki inaandaliwa na wataalamu wetu. Itatokea hapa muda mfupi ujao!
              </div>
            )}
          </div>
        </section>
      )}

      {/* VIP Packages Grid (Exact requested packages) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Vifurushi Vyote vya VIP (Chagua Hapa)
            </h2>
            <p className="text-xs text-slate-400">Bofya kifurushi kupata maelekezo ya malipo na kuthibitisha</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const activeSub = activeSubscriptions.find(
              (s) => (s.packageId === pkg.id || s.packageCode === pkg.code) && s.status === 'ACTIVE'
            );
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

      {/* Payment Step Guide */}
      <section className="p-6 rounded-3xl bg-[#091022] border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-display text-white">
          Jinsi ya Kulipia na Kupata Mikeka ya VIP
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black mb-2 text-sm">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Chagua Kifurushi</h4>
            <p className="text-slate-400 mt-1">
              Chagua Odds 5, 10, 15, 20, Wiki au Mwezi kulingana na mahitaji yako ya ushindi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black mb-2 text-sm">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Tuma Pesa Kwenda 0743997707</h4>
            <p className="text-slate-400 mt-1">
              Lipa kwa M-Pesa, Tigo Pesa, Airtel Money au Halopesa kwenda namba ya simu <strong>0743997707</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black mb-2 text-sm">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Bofya "NIMELIPA"</h4>
            <p className="text-slate-400 mt-1">
              Weka namba yako ya simu na namba ya muamala. Msimamizi atathibitisha na VIP itafunguka mara moja!
            </p>
          </div>
        </div>

        {/* WhatsApp Fast Track Banner */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-300">
            Je, umelipa na unahitaji uthibitisho wa haraka sana ndani ya sekunde 30?
          </p>
          <button
            id="btn-vip-fast-track-wa"
            onClick={onOpenWhatsApp}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shrink-0"
          >
            <span>Tuma Ujumbe WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
