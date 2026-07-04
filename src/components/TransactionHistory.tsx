import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Edit2, Trash2, Calendar, FileText, User } from 'lucide-react';
import type { Transaction, TransactionFilter } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const [filter, setFilter] = useState<TransactionFilter>('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const filterButtons: { label: string; value: TransactionFilter; count: number }[] = [
    {
      label: 'All Transactions',
      value: 'all',
      count: transactions.length,
    },
    {
      label: 'Deposits',
      value: 'deposit',
      count: transactions.filter((t) => t.type === 'deposit').length,
    },
    {
      label: 'Expenses',
      value: 'expense',
      count: transactions.filter((t) => t.type === 'expense').length,
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Filters header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          Transactions History
        </h3>

        {/* Filter Buttons */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                filter === btn.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{btn.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  filter === btn.value ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 text-slate-500">
          <Calendar className="w-10 h-10 mb-3 text-slate-600" />
          <p className="text-sm font-medium">No transactions found</p>
          <p className="text-xs text-slate-600 mt-1">Start by adding a deposit or expense above.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Depositor / Purpose</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Note</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="py-4 px-6 font-medium text-slate-400">{tx.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {tx.type === 'deposit' ? (
                          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 text-xs font-medium">
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            Deposit
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 text-xs font-medium">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Expense
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-200">{tx.person_or_purpose}</td>
                    <td
                      className={`py-4 px-6 font-bold ${
                        tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'deposit' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-4 px-6 text-slate-400 max-w-[200px] truncate" title={tx.note || ''}>
                      {tx.note || <span className="text-slate-700 italic">No notes</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors border border-transparent hover:border-slate-700"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(tx)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors border border-transparent hover:border-slate-700"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900 shadow-lg flex flex-col gap-3 relative overflow-hidden"
              >
                {/* Visual side bar indicating type */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    tx.type === 'deposit' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />

                {/* Header row */}
                <div className="flex justify-between items-start pl-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {tx.date}
                    </span>
                    <span className="text-base font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <User className="w-4 h-4 text-slate-500" />
                      {tx.person_or_purpose}
                    </span>
                  </div>

                  <span
                    className={`text-lg font-extrabold ${
                      tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                </div>

                {/* Optional Note */}
                {tx.note && (
                  <div className="pl-2 pr-2 py-1.5 bg-slate-950/40 rounded-lg text-xs text-slate-400 flex items-start gap-1.5 border border-slate-800/50">
                    <FileText className="w-3.5 h-3.5 mt-0.5 text-slate-600 flex-shrink-0" />
                    <span className="line-clamp-2 leading-relaxed">{tx.note}</span>
                  </div>
                )}

                {/* Footer Action Row */}
                <div className="flex justify-between items-center border-t border-slate-800/60 pt-3 pl-2 mt-1">
                  <div>
                    {tx.type === 'deposit' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        Deposit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                        Expense
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(tx)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800 rounded-xl border border-slate-700/50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
