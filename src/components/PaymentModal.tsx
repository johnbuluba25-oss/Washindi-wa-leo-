import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, AlertCircle, Phone, CreditCard, Send, ArrowRight, Clock } from 'lucide-react';
import { Package, User } from '../types';
import { api } from '../services/api';

interface PaymentModalProps {
  pkg: Package;
  user: User | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onSuccessSubmitted: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  pkg,
  user,
  onClose,
  onOpenAuth,
  onSuccessSubmitted,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [paymentNetwork, setPaymentNetwork] = useState('M-PESA');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<boolean>(false);

  const officialNumber = '0743997707';
  const recipientName = 'WASHINDI WA LEO / SMK';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(officialNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Tafadhali weka namba yako ya simu uliyolipia.');
      return;
    }

    if (!transactionId.trim()) {
      setError('Tafadhali weka namba ya muamala / kumbukumbu (Transaction Reference ID).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.submitPayment(pkg.id, transactionId.trim(), phoneNumber.trim(), paymentNetwork);
      setSubmittedStatus(true);
      onSuccessSubmitted();
    } catch (err: any) {
      setError(err.message || 'Hitilafu ya kuwasilisha malipo. Tafadhali jaribu tena.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090f1f] border border-amber-500/40 p-5 sm:p-7 shadow-2xl text-slate-100 my-auto">
        {/* Close button */}
        <button
          id="btn-close-payment-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedStatus ? (
          /* Success / Pending State View */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 mx-auto mb-4 animate-bounce">
              <Clock className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
              HALI: MALIPO YAMESUBIRI (PENDING)
            </span>

            <h3 className="text-2xl font-black font-display text-white mt-3">
              Subiri Uthibitisho
            </h3>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Ombi lako la kifurushi cha <strong className="text-amber-400">{pkg.name}</strong> (Muamala:{' '}
              <strong className="text-white font-mono">{transactionId.toUpperCase()}</strong>) limepokelewa
              kikamilifu.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Nini kinafuata sasa?</span>
              </div>
              <p>• Msimamizi anathibitisha muamala wako kwenye mfumo sasa hivi (dakika 1 hadi 5).</p>
              <p>• Ukithibitishwa, utapokea taarifa ndani ya app na mikeka ya VIP itafunguka moja kwa moja!</p>
              <p>• Kwa usaidizi wa haraka, piga au WhatsApp: <strong>0743997707</strong></p>
            </div>

            <button
              id="btn-done-payment-modal"
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20"
            >
              SAWA, NIMEWELEWA
            </button>
          </div>
        ) : (
          /* Payment Instructions & Confirmation Form */
          <div>
            {/* Header */}
            <div className="mb-4 pr-6">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                MAAGIZO YA MALIPO • MANUAL PAYMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
                Kifurushi cha {pkg.name}
              </h3>
            </div>

            {/* Price & Target Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Kiasi cha Kulipa</span>
                <span className="text-2xl font-black text-amber-400 font-display">
                  TZS {pkg.price.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Muda wa VIP</span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                  {pkg.durationLabel}
                </span>
              </div>
            </div>

            {/* Step 1: Send Money Box */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 mb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  HATUA YA 1: Tuma Pesa
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Mitandao Yote (TZ)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] text-slate-400">
                    Lipa <strong className="text-amber-400">TZS {pkg.price.toLocaleString()}</strong> kwenda:
                  </p>
                  <p className="text-lg sm:text-xl font-black text-white font-mono tracking-wider">
                    {officialNumber}
                  </p>
                  <p className="text-[10px] text-slate-400">Jina: <span className="text-slate-200 font-semibold">{recipientName}</span></p>
                </div>

                <button
                  type="button"
                  id="btn-copy-payment-phone"
                  onClick={handleCopyNumber}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Imenakiliwa' : 'Nakili Namba'}</span>
                </button>
              </div>

              {/* Supported Networks */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                <span>M-PESA</span>
                <span>•</span>
                <span>TIGO PESA</span>
                <span>•</span>
                <span>AIRTEL MONEY</span>
                <span>•</span>
                <span>HALOPESA</span>
              </div>
            </div>

            {/* Auth Gate Notice if not logged in */}
            {!user && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Unahitaji kuingia akaunti ili kuthibitisha malipo yako.</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shrink-0"
                >
                  Ingia Sasa
                </button>
              </div>
            )}

            {/* Step 2: Confirmation Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-amber-400" />
                HATUA YA 2: Thibitisha Baada ya Kutuma
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Namba ya Simu Uliyolipia *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      id="input-payment-phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Mfano: 0743997707"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Mtandao Uliotumia
                  </label>
                  <select
                    id="select-payment-network"
                    value={paymentNetwork}
                    onChange={(e) => setPaymentNetwork(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="M-PESA">Vodacom M-Pesa</option>
                    <option value="TIGO PESA">Tigo Pesa</option>
                    <option value="AIRTEL MONEY">Airtel Money</option>
                    <option value="HALOPESA">Halopesa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Namba ya Muamala / Reference ID (Kwenye SMS ya Pesa) *
                </label>
                <input
                  type="text"
                  id="input-payment-txid"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Mfano: 9JH82761AA au MPESA TX12345"
                  className="w-full px-3 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl bg-slate-950 border border-slate-700 text-amber-400 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Nakili herufi au namba za kumbukumbu kutoka kwenye ujumbe wa M-Pesa au mtandao uliotumia.
                </p>
              </div>

              {/* Big "NIMELIPA" Button */}
              <button
                type="submit"
                id="btn-submit-nimelipa"
                disabled={submitting}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>NIMELIPA</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
