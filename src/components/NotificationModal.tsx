import React from 'react';
import { X, Bell, CheckCheck, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { AppNotification } from '../types';
import { api } from '../services/api';

interface NotificationModalProps {
  notifications?: AppNotification[];
  onClose: () => void;
  onRefresh: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications = [],
  onClose,
  onRefresh,
}) => {
  const safeNotifs = notifications || [];

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationsRead();
      onRefresh();
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090f1f] border border-amber-500/40 p-5 sm:p-6 shadow-2xl text-slate-100 my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">Taarifa Zako</h3>
          </div>

          <div className="flex items-center gap-1.5">
            {safeNotifs.some((n) => !n.read) && (
              <button
                id="btn-mark-all-read"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-amber-400 hover:underline px-2 py-1"
              >
                Soma Zote
              </button>
            )}
            <button
              id="btn-close-notif-modal"
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1 py-3 space-y-2.5">
          {safeNotifs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Huna taarifa yoyote kwa sasa.
            </div>
          ) : (
            safeNotifs.map((n) => {
              const isApproved = n.type === 'PAYMENT_APPROVED';
              const isRejected = n.type === 'PAYMENT_REJECTED';

              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition-all text-xs ${
                    !n.read
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5
                      className={`font-bold flex items-center gap-1.5 ${
                        isApproved
                          ? 'text-emerald-400'
                          : isRejected
                          ? 'text-rose-400'
                          : 'text-amber-300'
                      }`}
                    >
                      {isApproved ? (
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-400 shrink-0" />
                      ) : isRejected ? (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <Bell className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{n.title}</span>
                    </h5>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-300 mt-1.5 leading-relaxed">{n.message}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
