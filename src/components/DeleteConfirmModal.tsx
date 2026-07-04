import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { Transaction } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  transaction,
  onConfirm,
  onClose,
  isLoading,
}) => {
  if (!isOpen || !transaction) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 p-6 shadow-2xl animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-100">Delete Transaction?</h3>
            <p className="text-sm text-slate-400 mt-2">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Purpose / Person</span>
                <span className="font-semibold text-slate-200">{transaction.person_or_purpose}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type</span>
                <span
                  className={`font-semibold capitalize ${
                    transaction.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {transaction.type}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount</span>
                <span
                  className={`font-semibold ${
                    transaction.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-200">{transaction.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700/50 transition-colors disabled:opacity-55"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl shadow-lg shadow-rose-900/20 transition-colors disabled:opacity-55"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Transaction'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
