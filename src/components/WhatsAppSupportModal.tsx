import React from 'react';
import { X, MessageCircle, Users, Phone, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { AppSettings } from '../types';

interface WhatsAppSupportModalProps {
  settings: AppSettings | null;
  onClose: () => void;
}

export const WhatsAppSupportModal: React.FC<WhatsAppSupportModalProps> = ({ settings, onClose }) => {
  const supportPhone = settings?.supportPhone || '0743997707';
  const groupUrl = settings?.whatsappGroupUrl || `https://chat.whatsapp.com/invite/washindi-wa-leo-official`;
  const cleanPhoneForWa = supportPhone.replace(/^0/, '255');
  const chatUrl = `https://wa.me/${cleanPhoneForWa}?text=Habari%20WASHINDI%20WA%20LEO%2C%20nahitaji%20msaada%20kuhusu%20huduma%20za%20VIP%20na%20malipo`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090f1f] border border-emerald-500/40 p-6 sm:p-7 shadow-2xl text-slate-100 my-auto">
        <button
          id="btn-close-whatsapp-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-lg shadow-emerald-950/50">
            <MessageCircle className="w-7 h-7 fill-emerald-400/30" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">
            Msaada wa WhatsApp
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Wasiliana na huduma kwa wateja au jiunge na jamii yetu rasmi ya washindi.
          </p>
        </div>

        <div className="space-y-3">
          {/* Direct WhatsApp Chat Button */}
          <a
            id="btn-wa-direct-chat"
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold flex items-center justify-between shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-extrabold">Chat na Huduma kwa Wateja</p>
                <p className="text-xs text-emerald-100 font-mono">{supportPhone}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100" />
          </a>

          {/* Official WhatsApp Group */}
          <a
            id="btn-wa-join-group"
            href={groupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 text-white font-bold flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-extrabold text-amber-300">Jiunge na Group Rasmi</p>
                <p className="text-xs text-slate-400">Pata mikeka ya bure & habari za ushindi</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
          </a>

          {/* Direct Phone Call */}
          <a
            id="btn-wa-call-direct"
            href={`tel:${supportPhone}`}
            className="w-full p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold">Piga Simu Moja kwa Moja ({supportPhone})</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold">PIGA</span>
          </a>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Masaa ya Huduma: Masaa 24 / Siku 7</span>
          </div>
          <p>Tunajibu jumbe za WhatsApp ndani ya sekunde chache ili kuhakikisha unawahi mikeka ya leo bila kuchelewa.</p>
        </div>
      </div>
    </div>
  );
};
