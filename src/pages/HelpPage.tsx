import React from 'react';
import { MessageCircle, Users, Phone, ShieldCheck, Clock, HelpCircle, ChevronDown, Check } from 'lucide-react';
import { AppSettings } from '../types';

interface HelpPageProps {
  settings: AppSettings | null;
  onOpenWhatsApp: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ settings, onOpenWhatsApp }) => {
  const supportPhone = settings?.supportPhone || '0743997707';
  const groupUrl = settings?.whatsappGroupUrl || `https://chat.whatsapp.com/invite/washindi-wa-leo-official`;
  const cleanPhone = supportPhone.replace(/^0/, '255');
  const chatUrl = `https://wa.me/${cleanPhone}?text=Habari%20WASHINDI%20WA%20LEO%2C%20nahitaji%20msaada`;

  const faqs = [
    {
      q: 'Je, nitalipaje kwa njia ya simu kupata VIP?',
      a: 'Tuma kiasi cha kifurushi husika (mfano TZS 2,000 kwa Odds 5 au TZS 5,000 kwa Odds 10) kwenda namba 0743997707 (Jina: WASHINDI WA LEO / SMK). Kisha kwenye tovuti bofya "NIMELIPA", jaza namba yako na namba ya muamala (Transaction ID). Msimamizi atakuthibitishia ndani ya dakika chache.',
    },
    {
      q: 'Je, inachukua muda gani malipo yangu kuthibitishwa?',
      a: 'Uthibitisho hufanyika ndani ya dakika 1 hadi 5 baada ya kuwasilisha namba ya muamala. Mara tu msimamizi akipokea taarifa na kuithibitisha, utapokea taarifa ndani ya app na mikeka itafunguka moja kwa moja.',
    },
    {
      q: 'Je, ninaweza kulipa kwa mtandao wowote?',
      a: 'Ndiyo! Mitandao yote ya Tanzania inakubalika ikiwemo Vodacom M-Pesa, Tigo Pesa, Airtel Money, na Halopesa kwenda namba yetu ya moja kwa moja 0743997707.',
    },
    {
      q: 'Je, kifurushi cha Wiki au Mwezi kinaleta faida gani?',
      a: 'Kifurushi cha Wiki (TZS 30,000) au Mwezi (TZS 70,000) kinakupa ruhusa ya kufungua mikeka YOTE ya VIP (Odds 5, 10, 15 na Super Odds 20) kila siku kwa muda wote wa usajili wako bila kulipa tena.',
    },
    {
      q: 'Nifanye nini nikipata changamoto au nikiwa na swali?',
      a: 'Wasiliana nasi moja kwa moja kupitia WhatsApp kwa namba 0743997707. Tupo tayari kukusaidia masaa 24 kila siku.',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#071a17] via-[#091522] to-[#060b18] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase mb-3">
          <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
          <span>HUDUMA KWA WATEJA • MSAADA WA HARAKA</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
          Msaada & <span className="text-emerald-400">WhatsApp Support</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Tupo hapa kuhakikisha unapata mikeka yako ya VIP kwa wakati na unashinda kila siku. 
          Wasiliana nasi kupitia WhatsApp au piga simu namba <strong>{supportPhone}</strong>.
        </p>

        {/* Contact Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            id="btn-help-wa-chat"
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-transform hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Chat WhatsApp ({supportPhone})</span>
          </a>

          <a
            id="btn-help-wa-group"
            href={groupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-slate-950 border border-emerald-500/50 hover:bg-slate-900 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Users className="w-5 h-5" />
            <span>Jiunge na Group Rasmi la WhatsApp</span>
          </a>

          <a
            id="btn-help-call"
            href={`tel:${supportPhone}`}
            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Piga Simu</span>
          </a>
        </div>
      </div>

      {/* Support details cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <Clock className="w-5 h-5 text-amber-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Masaa ya Kazi</h4>
          <p className="text-slate-400 mt-1">Huduma inapatikana masaa 24 kila siku kwa njia ya WhatsApp na mtandao.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Uthibitisho wa Haraka</h4>
          <p className="text-slate-400 mt-1">Uthibitisho wa miamala huchukua dakika 1 hadi 5 tu mara baada ya kuwasilisha.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <Phone className="w-5 h-5 text-yellow-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Namba Rasmi</h4>
          <p className="text-slate-400 mt-1">0743997707 (Jina: WASHINDI WA LEO / SMK) kwenye mitandao yote.</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold font-display text-white">
            Maswali Yanayoulizwa Mara kwa Mara (FAQs)
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
            >
              <h4 className="font-bold text-white text-sm flex items-center gap-2 text-amber-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="mt-2 text-slate-300/90 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
