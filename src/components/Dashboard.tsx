import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

interface DashboardProps {
  balance: number;
  totalDeposits: number;
  totalExpenses: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  balance,
  totalDeposits,
  totalExpenses,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
      {/* Current Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80 p-6 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-8 -mt-8" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Current Balance</span>
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className={`text-3xl font-bold tracking-tight transition-colors ${
            balance >= 0 ? 'text-slate-100' : 'text-rose-400'
          }`}>
            {formatCurrency(balance)}
          </span>
          <span className="text-xs text-slate-500 mt-2 font-medium">Net liquidity</span>
        </div>
      </div>

      {/* Total Deposits Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-950/80 p-6 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-8 -mt-8" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Deposits</span>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight text-emerald-400">
            {formatCurrency(totalDeposits)}
          </span>
          <span className="text-xs text-slate-500 mt-2 font-medium">Total inflows</span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-rose-950/20 via-slate-900/60 to-slate-950/80 p-6 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-8 -mt-8" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</span>
          <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight text-rose-400">
            {formatCurrency(totalExpenses)}
          </span>
          <span className="text-xs text-slate-500 mt-2 font-medium">Total outflows</span>
        </div>
      </div>
    </div>
  );
};
