export type TransactionType = 'deposit' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  person_or_purpose: string;
  date: string; // YYYY-MM-DD
  note: string | null;
  created_at: string;
}

export type NewTransaction = Omit<Transaction, 'id' | 'created_at'>;

export type TransactionFilter = 'all' | 'deposit' | 'expense';
