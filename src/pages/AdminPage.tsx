import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  User as UserIcon,
  LogOut,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Flame,
  Crown,
  Megaphone,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Phone,
  Eye,
  KeyRound,
} from 'lucide-react';
import {
  Payment,
  Prediction,
  Package,
  Advertisement,
  Subscription,
  AdminStats,
  AppSettings,
} from '../types';
import { api, authStorage } from '../services/api';

interface AdminPageProps {
  onBackToApp: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToApp }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('smk');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'stats' | 'payments' | 'predictions' | 'packages' | 'banners' | 'subscriptions' | 'users' | 'settings'
  >('stats');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [banners, setBanners] = useState<Advertisement[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Change Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  // Prediction Form State (Add / Edit)
  const [editingPred, setEditingPred] = useState<Partial<Prediction> | null>(null);
  const [isAddingPred, setIsAddingPred] = useState(false);

  // Banner Form State (Add / Edit)
  const [editingBanner, setEditingBanner] = useState<Partial<Advertisement> | null>(null);
  const [isAddingBanner, setIsAddingBanner] = useState(false);

  // Check existing admin session on mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const admin = await api.getAdminMe();
    if (admin) {
      setIsAdminLoggedIn(true);
      fetchAllAdminData();
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      setLoginError(null);
      await api.adminLogin(adminUsername.trim(), adminPassword);
      setIsAdminLoggedIn(true);
      fetchAllAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Kuingia kumeshindikana. Angalia jina au nenosiri.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await api.adminLogout();
    setIsAdminLoggedIn(false);
    setAdminPassword('');
  };

  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      const [s, pay, pred, pkg, ban, sub, usr, set] = await Promise.all([
        api.getAdminStats(),
        api.getAdminPayments(),
        api.getAdminPredictions(),
        api.getPackages(),
        api.getAdminBanners(),
        api.getAdminSubscriptions(),
        api.getAdminUsers(),
        api.getSettings(),
      ]);
      setStats(s);
      setPayments(pay);
      setPredictions(pred);
      setPackages(pkg);
      setBanners(ban);
      setSubscriptions(sub);
      setUsersList(usr);
      setSettings(set);
    } catch (err: any) {
      if (err.message && err.message.includes('Token')) {
        setIsAdminLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Payment Actions: APPROVE / REJECT
  const handleApprovePayment = async (id: string) => {
    try {
      setActionError(null);
      await api.approvePayment(id);
      setActionSuccess('Malipo yamethibitishwa na VIP imefunguliwa kwa mteja!');
      setTimeout(() => setActionSuccess(null), 3500);
      fetchAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Hitilafu ya kuthibitisha malipo.');
    }
  };

  const handleRejectPayment = async (id: string) => {
    const reason = prompt('Weka sababu ya kukataa malipo (mfano: Kumbukumbu ya muamala haipo kwenye M-Pesa):');
    if (reason === null) return;

    try {
      setActionError(null);
      await api.rejectPayment(id, reason || 'Muamala haukuthibitika');
      setActionSuccess('Malipo yamekataliwa na mtumiaji amearifiwa.');
      setTimeout(() => setActionSuccess(null), 3500);
      fetchAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Hitilafu ya kukataa malipo.');
    }
  };

  // Save / Update Prediction
  const handleSavePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPred) return;

    try {
      setActionError(null);
      if (isAddingPred) {
        await api.createPrediction(editingPred);
        setActionSuccess('Mkeka mpya umeongezwa kikamilifu!');
      } else if (editingPred.id) {
        await api.updatePrediction(editingPred.id, editingPred);
        setActionSuccess('Mkeka umerekebishwa kikamilifu!');
      }
      setIsAddingPred(false);
      setEditingPred(null);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Hitilafu ya kuhifadhi mkeka.');
    }
  };

  const handleDeletePrediction = async (id: string) => {
    if (!confirm('Una uhakika unataka kufuta mkeka huu?')) return;
    try {
      await api.deletePrediction(id);
      setActionSuccess('Mkeka umefutwa kikamilifu.');
      setTimeout(() => setActionSuccess(null), 3000);
      fetchAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Hitilafu ya kufuta.');
    }
  };

  // Save / Update Banner
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    try {
      if (isAddingBanner) {
        await api.createBanner(editingBanner);
        setActionSuccess('Tangazo jipya limeongezwa!');
      } else if (editingBanner.id) {
        await api.updateBanner(editingBanner.id, editingBanner);
        setActionSuccess('Tangazo limerekebishwa!');
      }
      setIsAddingBanner(false);
      setEditingBanner(null);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Hitilafu ya kuhifadhi tangazo.');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Una uhakika unataka kufuta tangazo hili?')) return;
    try {
      await api.deleteBanner(id);
      setActionSuccess('Tangazo limefutwa.');
      setTimeout(() => setActionSuccess(null), 3000);
      fetchAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Hitilafu ya kufuta tangazo.');
    }
  };

  // Update Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      setActionSuccess('Mipangilio imehifadhiwa kikamilifu!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Hitilafu ya kuhifadhi mipangilio.');
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwMsg('Nenosiri jipya halilingani.');
      return;
    }
    try {
      await api.changeAdminPassword(currentPw, newPw);
      setPwMsg('Nenosiri la msimamizi limebadilishwa kikamilifu!');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setPwMsg(null), 3500);
    } catch (err: any) {
      setPwMsg(err.message || 'Hitilafu ya kubadili nenosiri.');
    }
  };

  // ================= LOGIN SCREEN =================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#060a14] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-[#090f1f] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black mx-auto mb-3 shadow-lg shadow-amber-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black font-display text-white">
              Paneli ya Msimamizi (Admin)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Weka taarifa za siri za msimamizi kuingia kwenye mfumo wa WASHINDI WA LEO.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Jina la Mtumiaji (Username)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  id="input-admin-username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="smk"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Nenosiri (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  id="input-admin-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-admin-login-submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-transform active:scale-95 disabled:opacity-50"
            >
              {loginLoading ? 'Inathibitisha...' : 'INGIA DASHBOARD YA MSIMAMIZI'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              ← Rudi Kwenye Tovuti ya Kawaida
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-16">
      {/* Top Admin Header */}
      <header className="bg-[#090f1f] border-b border-amber-500/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight font-display">
                MSIMAMIZI: <span className="text-amber-400">WASHINDI WA LEO</span>
              </h1>
              <p className="text-[10px] text-slate-400">Karibu {adminUsername} • Paneli ya Uendeshaji</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllAdminData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Pakia Upya"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              id="btn-admin-view-site"
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Angalia Tovuti</span>
            </button>

            <button
              id="btn-admin-logout"
              onClick={handleAdminLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Toka</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Nav Tabs */}
      <div className="bg-[#090f1f]/80 border-b border-slate-800 sticky top-16 z-20 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          {[
            { id: 'stats', label: 'Dashboard', icon: DollarSign },
            { id: 'payments', label: 'Maombi ya Malipo', icon: Clock, badge: stats?.pendingPaymentsCount },
            { id: 'predictions', label: 'Mikeka / Tips', icon: Flame },
            { id: 'subscriptions', label: 'Wateja wa VIP', icon: Crown },
            { id: 'users', label: 'Watumiaji', icon: Users },
            { id: 'banners', label: 'Matangazo', icon: Megaphone },
            { id: 'settings', label: 'Mipangilio & Nenosiri', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`btn-admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Banners */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        {actionSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 mb-4 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2 mb-4 animate-fadeIn">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 mt-4">
        {/* TAB 1: STATS DASHBOARD */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-5 rounded-3xl bg-[#091024] border border-amber-500/30">
                <span className="text-xs text-slate-400 font-bold uppercase block">Mauzo Yote (Sales)</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display mt-1 block">
                  TZS {stats.totalSalesTzs.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-2 block">
                  {stats.approvedPaymentsCount} Miamala Iliyolipwa
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[#091024] border border-amber-500/30">
                <span className="text-xs text-slate-400 font-bold uppercase block">Inayosubiri (Pending)</span>
                <span className="text-2xl sm:text-3xl font-black text-rose-400 font-display mt-1 block">
                  {stats.pendingPaymentsCount}
                </span>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-[10px] text-amber-300 font-bold hover:underline mt-2 block"
                >
                  Angalia na Thibitisha Sasa →
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-[#091024] border border-amber-500/30">
                <span className="text-xs text-slate-400 font-bold uppercase block">Wateja Hai wa VIP</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-display mt-1 block">
                  {stats.activeVipUsersCount}
                </span>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Kati ya watumiaji {stats.totalUsersCount}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[#091024] border border-amber-500/30">
                <span className="text-xs text-slate-400 font-bold uppercase block">Ushindi Wastani (Win Rate)</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
                  {stats.winRatePercentage}%
                </span>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Jumla ya mechi: {stats.totalPredictionsCount}
                </span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3">Vitendo vya Haraka (Quick Actions)</h3>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setIsAddingPred(true);
                    setEditingPred({
                      league: 'PREMIER LEAGUE',
                      match: '',
                      prediction: '',
                      odds: 1.85,
                      confidence: 90,
                      status: 'PENDING',
                      category: 'ODDS_5',
                    });
                    setActiveTab('predictions');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ongeza Mkeka Mpya</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Pitia Maombi ya Malipo ({stats.pendingPaymentsCount})</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddingBanner(true);
                    setEditingBanner({
                      title: '',
                      description: '',
                      buttonText: 'NUNUA VIP',
                      buttonLink: '#vip',
                      active: true,
                    });
                    setActiveTab('banners');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Megaphone className="w-4 h-4 text-emerald-400" />
                  <span>Ongeza Tangazo la Promo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENTS MANAGEMENT */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Maombi ya Malipo (Manual Payment Requests)
                </h3>
                <p className="text-xs text-slate-400">
                  Thibitisha (APPROVE) au Kataa (REJECT) miamala iliyotumwa kwenda 0743997707
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Mtumiaji (User)</th>
                      <th className="py-3 px-3">Simu</th>
                      <th className="py-3 px-3">Kifurushi</th>
                      <th className="py-3 px-3">Kiasi</th>
                      <th className="py-3 px-3">Namba ya Muamala (TxID)</th>
                      <th className="py-3 px-3">Tarehe</th>
                      <th className="py-3 px-3">Hali (Status)</th>
                      <th className="py-3 px-3">Mwisho wa VIP</th>
                      <th className="py-3 px-3 text-right">Vitendo (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          Hakuna maombi ya malipo kwa sasa.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{p.userName}</td>
                          <td className="py-3 px-3 font-mono text-slate-300">{p.userPhone}</td>
                          <td className="py-3 px-3 font-bold text-amber-300">{p.packageName}</td>
                          <td className="py-3 px-3 font-mono text-white font-bold">
                            TZS {p.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-amber-400 uppercase">
                            {p.transactionId}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {new Date(p.createdAt).toLocaleDateString('sw-TZ')} •{' '}
                            {new Date(p.createdAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-3">
                            {p.status === 'PENDING' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                                PENDING
                              </span>
                            )}
                            {p.status === 'APPROVED' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                APPROVED
                              </span>
                            )}
                            {p.status === 'REJECTED' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                REJECTED
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {p.expiresAt
                              ? new Date(p.expiresAt).toLocaleDateString('sw-TZ') +
                                ' ' +
                                new Date(p.expiresAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })
                              : '-'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {p.status === 'PENDING' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  id={`btn-approve-payment-${p.id}`}
                                  onClick={() => handleApprovePayment(p.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>APPROVE</span>
                                </button>
                                <button
                                  id={`btn-reject-payment-${p.id}`}
                                  onClick={() => handleRejectPayment(p.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>REJECT</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">Imekamilika</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PREDICTIONS / MIKEKA CRUD */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Usimamizi wa Mikeka & Tips</h3>
                <p className="text-xs text-slate-400">Ongeza, rekebisha au futa mikeka ya bure na ya VIP</p>
              </div>

              <button
                id="btn-admin-add-prediction"
                onClick={() => {
                  setIsAddingPred(true);
                  setEditingPred({
                    league: 'PREMIER LEAGUE',
                    match: '',
                    homeTeam: '',
                    awayTeam: '',
                    matchTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16),
                    prediction: '',
                    odds: 1.85,
                    confidence: 90,
                    status: 'PENDING',
                    category: 'ODDS_5',
                    analysis: '',
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Ongeza Mkeka Mpya</span>
              </button>
            </div>

            {/* Modal for Add / Edit Prediction */}
            {(isAddingPred || editingPred) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                <div className="relative w-full max-w-xl rounded-3xl bg-[#090f1f] border border-amber-500/40 p-6 shadow-2xl my-auto">
                  <button
                    onClick={() => {
                      setIsAddingPred(false);
                      setEditingPred(null);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-bold font-display text-white mb-4">
                    {isAddingPred ? 'Ongeza Mkeka Mpya' : 'Rekebisha Mkeka'}
                  </h3>

                  <form onSubmit={handleSavePrediction} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Ligi (League)</label>
                        <input
                          type="text"
                          value={editingPred?.league || ''}
                          onChange={(e) => setEditingPred({ ...editingPred, league: e.target.value })}
                          placeholder="Mfano: PREMIER LEAGUE, LALIGA, NBC..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Aina ya Kifurushi (Category)</label>
                        <select
                          value={editingPred?.category || 'FREE'}
                          onChange={(e) => setEditingPred({ ...editingPred, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        >
                          <option value="FREE">Bure (Free Tips)</option>
                          <option value="ODDS_5">VIP ODDS 5</option>
                          <option value="ODDS_10">VIP ODDS 10</option>
                          <option value="ODDS_15">VIP ODDS 15</option>
                          <option value="ODDS_20">SUPER VIP ODDS 20</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Mechi (Match)</label>
                      <input
                        type="text"
                        value={editingPred?.match || ''}
                        onChange={(e) => setEditingPred({ ...editingPred, match: e.target.value })}
                        placeholder="Mfano: Real Madrid vs Getafe"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Utabiri (Prediction)</label>
                        <input
                          type="text"
                          value={editingPred?.prediction || ''}
                          onChange={(e) => setEditingPred({ ...editingPred, prediction: e.target.value })}
                          placeholder="Home Win & Over 1.5"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Odds</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPred?.odds || 1.5}
                          onChange={(e) => setEditingPred({ ...editingPred, odds: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Uhakika % (Confidence)</label>
                        <input
                          type="number"
                          value={editingPred?.confidence || 90}
                          onChange={(e) => setEditingPred({ ...editingPred, confidence: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Hali ya Mechi (Status)</label>
                        <select
                          value={editingPred?.status || 'PENDING'}
                          onChange={(e) => setEditingPred({ ...editingPred, status: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        >
                          <option value="PENDING">PENDING (Inasubiriwa)</option>
                          <option value="WON">WON (IMETIKI - Ushindi!)</option>
                          <option value="LOST">LOST (Imekosa)</option>
                          <option value="VOID">VOID (Imeahirishwa)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Matokeo Halisi ya Magoli (Score)</label>
                        <input
                          type="text"
                          value={editingPred?.resultScore || ''}
                          onChange={(e) => setEditingPred({ ...editingPred, resultScore: e.target.value })}
                          placeholder="Mfano: 3 - 1 au TICKET ILITIKI"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Uchambuzi wa Mechi (Analysis Text)</label>
                      <textarea
                        rows={2}
                        value={editingPred?.analysis || ''}
                        onChange={(e) => setEditingPred({ ...editingPred, analysis: e.target.value })}
                        placeholder="Maelezo mafupi ya uchambuzi wa takwimu..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPred(false);
                          setEditingPred(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                      >
                        Ghairi
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                      >
                        Hifadhi Mkeka
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Predictions Table */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Ligi</th>
                      <th className="py-3 px-3">Mechi</th>
                      <th className="py-3 px-3">Utabiri</th>
                      <th className="py-3 px-3">Odds</th>
                      <th className="py-3 px-3">Kundi</th>
                      <th className="py-3 px-3">Hali</th>
                      <th className="py-3 px-3 text-right">Vitendo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {predictions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-400">{p.league}</td>
                        <td className="py-3 px-3 font-bold text-white">{p.match}</td>
                        <td className="py-3 px-3 text-amber-300 font-semibold">{p.prediction}</td>
                        <td className="py-3 px-3 font-mono font-bold text-white">{p.odds.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {p.status === 'WON' && <span className="text-emerald-400 font-bold">WON</span>}
                          {p.status === 'PENDING' && <span className="text-amber-400 font-bold">PENDING</span>}
                          {p.status === 'LOST' && <span className="text-rose-400 font-bold">LOST</span>}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingPred(p);
                                setIsAddingPred(false);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                              title="Hariri"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePrediction(p.id)}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                              title="Futa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VIP SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-display text-white">Wateja wa VIP (Subscribers)</h3>
              <p className="text-xs text-slate-400">Tazama wateja wenye vifurushi vilivyo hai na vilivyomalizika</p>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Mteja ID</th>
                      <th className="py-3 px-3">Kifurushi</th>
                      <th className="py-3 px-3">Ilianza</th>
                      <th className="py-3 px-3">Itaisha (Expiry)</th>
                      <th className="py-3 px-3">Hali</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {subscriptions.map((s) => {
                      const isLive = s.status === 'ACTIVE' && new Date(s.expiresAt) > new Date();
                      return (
                        <tr key={s.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3 px-3 font-mono text-slate-300">{s.userId.slice(-6)}</td>
                          <td className="py-3 px-3 font-bold text-amber-300">{s.packageName}</td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {new Date(s.startedAt).toLocaleDateString('sw-TZ')}
                          </td>
                          <td className="py-3 px-3 font-mono text-white text-[11px]">
                            {new Date(s.expiresAt).toLocaleDateString('sw-TZ')} {new Date(s.expiresAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-3">
                            {isLive ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                HAI (ACTIVE)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-400">
                                IMEISHA (EXPIRED)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USERS LIST */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-display text-white">Watumiaji Waliojisajili (Users)</h3>
              <p className="text-xs text-slate-400">Wateja wote waliojisajili kwa namba ya simu</p>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Jina</th>
                      <th className="py-3 px-3">Namba ya Simu</th>
                      <th className="py-3 px-3">Tarehe ya Usajili</th>
                      <th className="py-3 px-3">VIP Hali</th>
                      <th className="py-3 px-3">Jumla Iliyolipwa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{u.name}</td>
                        <td className="py-3 px-3 font-mono text-slate-300">{u.phone}</td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString('sw-TZ')}
                        </td>
                        <td className="py-3 px-3">
                          {u.hasActiveVip ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              {u.activePackage}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Hana VIP</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-amber-400 font-bold">
                          TZS {u.totalSpentTzs.toLocaleString()} ({u.totalPurchases})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BANNERS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Matangazo & Banners za Promo</h3>
                <p className="text-xs text-slate-400">Banners zinazojizungusha kwenye carousel ya Home na Matangazo</p>
              </div>

              <button
                onClick={() => {
                  setIsAddingBanner(true);
                  setEditingBanner({
                    title: '',
                    description: '',
                    buttonText: 'NUNUA VIP',
                    buttonLink: '#vip',
                    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
                    active: true,
                    order: banners.length + 1,
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Ongeza Tangazo</span>
              </button>
            </div>

            {/* Modal for Add / Edit Banner */}
            {(isAddingBanner || editingBanner) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                <div className="relative w-full max-w-lg rounded-3xl bg-[#090f1f] border border-amber-500/40 p-6 shadow-2xl my-auto text-xs">
                  <button
                    onClick={() => {
                      setIsAddingBanner(false);
                      setEditingBanner(null);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-base font-bold text-white mb-3">
                    {isAddingBanner ? 'Ongeza Tangazo Jipya' : 'Rekebisha Tangazo'}
                  </h3>

                  <form onSubmit={handleSaveBanner} className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Kichwa cha Habari (Title)</label>
                      <input
                        type="text"
                        value={editingBanner?.title || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Maelezo (Description)</label>
                      <textarea
                        rows={2}
                        value={editingBanner?.description || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Picha URL (Image Link)</label>
                      <input
                        type="text"
                        value={editingBanner?.imageUrl || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Maneno ya Kitufe (Button Text)</label>
                        <input
                          type="text"
                          value={editingBanner?.buttonText || ''}
                          onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Kiungo cha Kitufe (Link)</label>
                        <input
                          type="text"
                          value={editingBanner?.buttonLink || ''}
                          onChange={(e) => setEditingBanner({ ...editingBanner, buttonLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingBanner(false);
                          setEditingBanner(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                      >
                        Ghairi
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                      >
                        Hifadhi Tangazo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{b.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{b.description}</p>
                    <p className="text-[10px] text-amber-400 mt-2">Kitufe: {b.buttonText} → {b.buttonLink}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingBanner(b);
                        setIsAddingBanner(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                    >
                      Hariri
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold"
                    >
                      Futa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & CHANGE PASSWORD */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Settings */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>Mipangilio ya Mfumo & Mawasiliano</span>
              </h3>

              {settings && (
                <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Namba Rasmi ya WhatsApp & Malipo</label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Jina la Mpokeaji Malipo (Recipient Name)</label>
                    <input
                      type="text"
                      value={settings.mpesaRecipientName}
                      onChange={(e) => setSettings({ ...settings, mpesaRecipientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Kiungo cha Group la WhatsApp (Invite Link)</label>
                    <input
                      type="text"
                      value={settings.whatsappGroupUrl}
                      onChange={(e) => setSettings({ ...settings, whatsappGroupUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Hifadhi Mipangilio
                  </button>
                </form>
              )}
            </div>

            {/* Change Admin Password */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Badilisha Nenosiri la Msimamizi</span>
              </h3>

              {pwMsg && (
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300 text-xs">
                  {pwMsg}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nenosiri la Sasa (Current Password)</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Weka nenosiri la sasa"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Nenosiri Jipya (New Password)</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Angalau tarakimu 4"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Rudia Nenosiri Jipya (Confirm)</label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Rudia nenosiri jipya"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs"
                >
                  Sasisha Nenosiri Sasa
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
