import React from 'react';
import { AlertOctagon, Bell, ChevronRight, X, MapPin } from 'lucide-react';
import { Incident } from '../types';

interface PushNotificationToastProps {
  notification: {
    id: string;
    title: string;
    message: string;
    incidentId?: string;
    severity?: string;
    timestamp: string;
  } | null;
  onDismiss: () => void;
  onViewIncident: (incidentId: string) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
  onViewIncident,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-14 left-3 right-3 max-w-md mx-auto z-50 animate-in slide-in-from-top-4">
      <div 
        id="push-notification-toast"
        className="p-3.5 bg-zinc-950/95 backdrop-blur-xl border-2 border-red-500/80 rounded-2xl shadow-2xl flex items-start gap-3 text-zinc-100"
      >
        <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-700 shrink-0">
          <AlertOctagon className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
              URGENT LOCAL SAFETY ALERT
            </span>
            <span className="text-[10px] text-zinc-400">{notification.timestamp}</span>
          </div>

          <h4 className="text-xs font-bold text-white truncate mt-0.5">{notification.title}</h4>
          <p className="text-[11px] text-zinc-300 line-clamp-2 mt-0.5">{notification.message}</p>

          <div className="flex items-center gap-2 mt-2">
            {notification.incidentId && (
              <button
                onClick={() => {
                  onViewIncident(notification.incidentId!);
                  onDismiss();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition-colors shadow-sm"
              >
                <MapPin className="w-3 h-3" />
                <span>View on Live Radar</span>
              </button>
            )}

            <button
              onClick={onDismiss}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] font-medium border border-zinc-800"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button onClick={onDismiss} className="text-zinc-500 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
