import { useState, useEffect, useCallback } from 'react';
import type { Transaction, NewTransaction } from '../types';
import { transactionService } from '../services/transactionService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Management
  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to fetch transactions';
      setError(errMsg);
      addToast('error', errMsg);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Add Transaction
  const addTransaction = useCallback(async (tx: NewTransaction) => {
    setLoading(true);
    try {
      await transactionService.create(tx);
      addToast('success', `${tx.type === 'deposit' ? 'Deposit' : 'Expense'} added successfully!`);
      await fetchTransactions();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to add transaction';
      addToast('error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, addToast]);

  // Edit Transaction
  const editTransaction = useCallback(async (id: string, updates: Partial<NewTransaction>) => {
    setLoading(true);
    try {
      await transactionService.update(id, updates);
      addToast('success', 'Transaction updated successfully!');
      await fetchTransactions();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to update transaction';
      addToast('error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, addToast]);

  // Delete Transaction
  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await transactionService.delete(id);
      addToast('success', 'Transaction deleted successfully!');
      await fetchTransactions();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to delete transaction';
      addToast('error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, addToast]);

  // Initial Load
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculations
  const totalDeposits = transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalDeposits - totalExpenses;

  return {
    transactions,
    loading,
    error,
    toasts,
    removeToast,
    addToast,
    refresh: fetchTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalDeposits,
    totalExpenses,
    balance,
  };
}
