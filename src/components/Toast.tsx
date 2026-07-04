import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import type { ToastMessage } from '../hooks/useTransactions';

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-slate-800/90 border-emerald-500/30 text-emerald-400 backdrop-blur-md'
              : 'bg-slate-800/90 border-rose-500/30 text-rose-400 backdrop-blur-md'
          }`}
          role="alert"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-slate-200">{toast.message}</span>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className="ml-4 p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
