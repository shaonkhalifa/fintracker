import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import type { Transaction, TransactionType } from '../types';

interface TransactionFormModalProps {
  isOpen: boolean;
  type: TransactionType;
  transaction: Transaction | null; // Null means Add mode, otherwise Edit mode
  onSave: (data: {
    type: TransactionType;
    amount: number;
    person_or_purpose: string;
    date: string;
    note: string | null;
  }) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  type,
  transaction,
  onSave,
  onClose,
  isLoading,
}) => {
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [amount, setAmount] = useState<string>('');
  const [personOrPurpose, setPersonOrPurpose] = useState<string>('');
  const [date, setDate] = useState<string>(getLocalDateString());
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; personOrPurpose?: string; date?: string }>({});

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setPersonOrPurpose(transaction.person_or_purpose);
      setDate(transaction.date);
      setNote(transaction.note || '');
      setErrors({});
    } else {
      setAmount('');
      setPersonOrPurpose('');
      setDate(getLocalDateString());
      setNote('');
      setErrors({});
    }
  }, [transaction, type, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { amount?: string; personOrPurpose?: string; date?: string } = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount)) {
      newErrors.amount = 'Amount is required';
    } else if (parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    if (!personOrPurpose.trim()) {
      newErrors.personOrPurpose = type === 'deposit' ? 'Depositor Name is required' : 'Expense Purpose is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      type,
      amount: parseFloat(amount),
      person_or_purpose: personOrPurpose.trim(),
      date,
      note: note.trim() || null,
    });
  };

  const titlePrefix = transaction ? 'Edit' : 'Add';
  const titleType = type === 'deposit' ? 'Deposit' : 'Expense';
  const labelPersonOrPurpose = type === 'deposit' ? 'Depositor Name' : 'Expense Purpose';
  const placeholderPersonOrPurpose = type === 'deposit' ? 'e.g. John Doe, Salary' : 'e.g. Rent, Groceries, Electricity';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl animate-scale-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <h3 className="text-lg font-bold text-slate-100">
            {titlePrefix} {titleType}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 flex flex-col gap-4">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Amount (BDT) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-medium">৳</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className={`w-full bg-slate-950 border pl-8 pr-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${
                  errors.amount ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-slate-800'
                }`}
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-400 mt-1.5">{errors.amount}</p>}
          </div>

          {/* Person or Purpose */}
          <div>
            <label htmlFor="personOrPurpose" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {labelPersonOrPurpose} <span className="text-rose-500">*</span>
            </label>
            <input
              id="personOrPurpose"
              type="text"
              placeholder={placeholderPersonOrPurpose}
              value={personOrPurpose}
              onChange={(e) => setPersonOrPurpose(e.target.value)}
              disabled={isLoading}
              className={`w-full bg-slate-950 border px-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${
                errors.personOrPurpose ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-slate-800'
              }`}
            />
            {errors.personOrPurpose && <p className="text-xs text-rose-400 mt-1.5">{errors.personOrPurpose}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onClick={(e) => {
                try {
                  (e.target as HTMLInputElement).showPicker();
                } catch (err) {
                  // Fallback for unsupported browsers
                }
              }}
              disabled={isLoading}
              className={`w-full bg-slate-950 border px-4 py-2.5 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${
                errors.date ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-slate-800'
              }`}
            />
            {errors.date && <p className="text-xs text-rose-400 mt-1.5">{errors.date}</p>}
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Note <span className="text-slate-500">(Optional)</span>
            </label>
            <textarea
              id="note"
              placeholder="Add additional details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4 border-t border-slate-800/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-900/20 transition-colors disabled:opacity-55"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save {titleType}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
