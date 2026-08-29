import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import useRealtimeEvent from '../../hooks/useRealtimeEvent';

export interface ToastMessage {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { ...toast, id };
      setToasts((prev) => [newToast, ...prev].slice(0, 5));

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  // Auto-listen to global Critical Alerts via Socket.IO
  useRealtimeEvent('ALERT_CREATED', (payload: any) => {
    if (payload.data?.severity === 'CRITICAL') {
      showToast({
        type: 'critical',
        title: 'Critical Warning Alert',
        message: payload.data?.title || 'Severe project variance threshold breached'
      });
    } else if (payload.data?.severity === 'HIGH') {
      showToast({
        type: 'warning',
        title: 'High Risk Warning',
        message: payload.data?.title || 'Project schedule or budget anomaly detected'
      });
    }
  });

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const borderAccents = {
            critical: 'border-l-4 border-l-rose-600',
            warning: 'border-l-4 border-l-amber-500',
            success: 'border-l-4 border-l-emerald-600',
            info: 'border-l-4 border-l-blue-600'
          };

          const iconStyles = {
            critical: 'text-rose-600 bg-rose-50',
            warning: 'text-amber-600 bg-amber-50',
            success: 'text-emerald-600 bg-emerald-50',
            info: 'text-blue-600 bg-blue-50'
          };

          const Icon =
            toast.type === 'critical'
              ? ShieldAlert
              : toast.type === 'warning'
              ? AlertTriangle
              : toast.type === 'success'
              ? CheckCircle
              : Info;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-card bg-white border border-slate-200 shadow-command-elevated transition-all flex items-start justify-between gap-3 ${borderAccents[toast.type]}`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-md ${iconStyles[toast.type]} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-900 text-xs tracking-tight">{toast.title}</p>
                  <p className="text-slate-600 leading-snug text-[11px]">{toast.message}</p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
