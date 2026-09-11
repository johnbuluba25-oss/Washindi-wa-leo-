import React, { useState, useEffect } from 'react';
import { User, Subscription, Payment, AppNotification } from '../types';
import { api } from '../services/api';
import {
  User as UserIcon,
  Phone,
  Calendar,
  Crown,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Edit2,
  ShieldCheck,
  CreditCard,
  Bell,
  RefreshCw,
} from 'lucide-react';

interface ProfilePageProps {
  user: User | null;
  activeSubscriptions: Subscription[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  activeSubscriptions,
  onOpenAuth,
  onLogout,
  onNavigate,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const fetchPayments = async () => {
    if (!user) return;
    try {
      setLoadingPayments(true);
      const data = await api.getMyPayments();
      setPayments(data);
    } catch {
      // ignore
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments();
      setNewName(user.name);
    }
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setSavingProfile(true);
      await api.updateProfile(newName.trim());
      setEditMode(false);
      setProfileMsg('Jina lako limebadilishwa kikamilifu!');
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err: any) {
      setProfileMsg(err.message || 'Hitilafu ya kurekebisha jina.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 mx-auto mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-display text-white">
          Akaunti Yako ya Mshindi
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Ingia au tengeneza akaunti kwa namba yako ya simu kuona usajili wako wa VIP, hali ya malipo yako na muda uliobaki.
        </p>
        <button
          id="btn-profile-login"
          onClick={onOpenAuth}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
        >
          INGIA AU JISAJILI SASA
        </button>
      </div>
    );
  }

  const liveSubs = (activeSubscriptions || []).filter((s) => s.status === 'ACTIVE' && (s.remainingSeconds || 0) > 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="rounded-3xl bg-[#091024] border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Mshindi
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {user.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Mwanachama tangu: {new Date(user.createdAt).toLocaleDateString('sw-TZ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-profile-edit-name"
              onClick={() => setEditMode(!editMode)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Badili Jina"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              id="btn-profile-logout"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Ondoka (Logout)</span>
            </button>
          </div>
        </div>

        {profileMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs">
            {profileMsg}
          </div>
        )}

        {/* Edit Name Form */}
        {editMode && (
          <form onSubmit={handleUpdateName} className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              id="input-profile-new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Weka jina lako jipya"
              className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 flex-1"
            />
            <button
              type="submit"
              disabled={savingProfile}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              {savingProfile ? 'Inahifadhi...' : 'Hifadhi'}
            </button>
          </form>
        )}
      </div>

      {/* Active VIP Subscriptions */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Crown className="w-4 h-4 fill-amber-400/30" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Vifurushi Vyako vya VIP Vilivyo Hai
              </h3>
              <p className="text-[11px] text-slate-400">Muda uliobaki na tarehe ya mwisho ya VIP</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('vip')}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Ongeza Kifurushi
          </button>
        </div>

        {liveSubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {liveSubs.map((sub) => {
              const hours = Math.floor((sub.remainingSeconds || 0) / 3600);
              const minutes = Math.floor(((sub.remainingSeconds || 0) % 3600) / 60);

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">
                        KIFURUSHI CHAKO
                      </span>
                      <h4 className="text-lg font-black text-white">{sub.packageName}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase animate-pulse">
                      HAI (ACTIVE)
                    </span>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Muda: <strong className="text-amber-300">{hours}h {minutes}m</strong>
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Hadi: {new Date(sub.expiresAt).toLocaleDateString('sw-TZ')} {new Date(sub.expiresAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400">
            <p>Huna kifurushi cha VIP kilicho hai kwa sasa.</p>
            <button
              onClick={() => onNavigate('vip')}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Nunua Kifurushi cha VIP Sasa
            </button>
          </div>
        )}
      </div>

      {/* Payment History & Verification Requests */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Historia ya Malipo & Maombi ya VIP
              </h3>
              <p className="text-[11px] text-slate-400">Angalia hali ya uthibitisho wa miamala yako</p>
            </div>
          </div>

          <button
            id="btn-refresh-profile-payments"
            onClick={fetchPayments}
            disabled={loadingPayments}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Sasisha"
          >
            <RefreshCw className={`w-4 h-4 ${loadingPayments ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Kifurushi</th>
                  <th className="py-2.5 px-3">Kiasi (TZS)</th>
                  <th className="py-2.5 px-3">Namba ya Muamala</th>
                  <th className="py-2.5 px-3">Tarehe</th>
                  <th className="py-2.5 px-3">Hali (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => {
                  const isApproved = p.status === 'APPROVED';
                  const isPending = p.status === 'PENDING';
                  const isRejected = p.status === 'REJECTED';

                  return (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{p.packageName}</td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-bold">
                        TZS {p.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono uppercase text-slate-200">
                        {p.transactionId}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString('sw-TZ')} •{' '}
                        {new Date(p.createdAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            IMETHIBITISHWA
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-400" />
                            INASUBIRIWA
                          </span>
                        )}
                        {isRejected && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/50"
                            title={p.rejectionReason}
                          >
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            IMEKATALIWA
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            Hujawasilisha ombi la malipo bado.
          </div>
        )}
      </div>
    </div>
  );
};
