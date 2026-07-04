import { useState } from 'react';
import { Plus, Minus, AlertCircle, RefreshCw } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';
import { Dashboard } from './components/Dashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { TransactionFormModal } from './components/TransactionFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import type { Transaction, TransactionType } from './types';

function App() {
  const {
    transactions,
    loading,
    toasts,
    removeToast,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalDeposits,
    totalExpenses,
    balance,
    refresh,
  } = useTransactions();

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<TransactionType>('deposit');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const isSupabaseConfigured =
    Boolean(import.meta.env.VITE_SUPABASE_URL) && Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Handlers
  const handleOpenAddForm = (type: TransactionType) => {
    setFormType(type);
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (tx: Transaction) => {
    setFormType(tx.type);
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleSaveTransaction = async (data: {
    type: TransactionType;
    amount: number;
    person_or_purpose: string;
    date: string;
    note: string | null;
  }) => {
    try {
      if (editingTransaction) {
        await editTransaction(editingTransaction.id, data);
      } else {
        await addTransaction(data);
      }
      setIsFormOpen(false);
    } catch (err) {
      // Errors are handled in the useTransactions hook (toasts)
    }
  };

  const handleOpenDeleteConfirm = (tx: Transaction) => {
    setDeletingTransaction(tx);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingTransaction) {
      try {
        await deleteTransaction(deletingTransaction.id);
        setIsDeleteOpen(false);
      } catch (err) {
        // Errors are handled in the useTransactions hook (toasts)
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative pb-16">
      {/* Top Global Loading Bar */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600/35 overflow-hidden z-50">
          <div className="h-full bg-indigo-500 w-1/3 rounded-full animate-[loading-bar_1.5s_infinite_linear]" />
        </div>
      )}

      {/* Toast Notification System */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="flex items-center justify-center w-full h-full rounded-[10px] bg-slate-900">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" className="text-[17px] font-black fill-indigo-400 font-sans">৳</text>
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center animate-bounce">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-100 leading-none tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">FinTracker</h1>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Ledger for Syed Zahidul Islam Monir</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Badge */}
            {isSupabaseConfigured ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                Setup Required
              </span>
            )}

            <button
              onClick={() => refresh()}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-slate-300 hover:text-slate-100 transition-colors border border-slate-700/50 disabled:opacity-50"
              title="Refresh ledger"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-8 flex-1 flex flex-col">
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-200 mb-1">Configuration Needed</h4>
              <p className="text-amber-300/90 text-xs">
                To connect to your database, duplicate <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-400 font-mono">.env.example</code> to <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-400 font-mono">.env</code> and fill in your Supabase details.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Summary Cards */}
        <Dashboard balance={balance} totalDeposits={totalDeposits} totalExpenses={totalExpenses} />

        {/* Quick Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleOpenAddForm('deposit')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            Add Deposit
          </button>
          <button
            onClick={() => handleOpenAddForm('expense')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold rounded-2xl shadow-lg shadow-rose-950/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Minus className="w-5 h-5" />
            Add Expense
          </button>
        </div>

        {/* Transaction History Section */}
        <div className="flex-1">
          <TransactionHistory
            transactions={transactions}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteConfirm}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-600 flex flex-col items-center gap-2">
        <div className="flex flex-col sm:flex-row items-center gap-1">
          <span>Personal Ledger for Syed Zahidul Islam Monir</span>
          <span className="hidden sm:inline">•</span>
          <span>Managed by Md. Shaon Khalifa</span>
        </div>
      </footer>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionFormModal
        isOpen={isFormOpen}
        type={formType}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        onClose={() => setIsFormOpen(false)}
        isLoading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        transaction={deletingTransaction}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
        isLoading={loading}
      />
    </div>
  );
}

export default App;
