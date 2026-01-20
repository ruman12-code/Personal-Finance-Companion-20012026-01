
import React from 'react';
import { Transaction, TransactionType, ExpenseCategory } from '../types';
import { CURRENCY_SYMBOL } from '../constants';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDelete }) => {
  
  const getPriceTrend = (currentTransaction: Transaction) => {
    if (currentTransaction.type !== TransactionType.EXPENSE || !currentTransaction.subCategory) return null;

    const currentMonth = new Date(currentTransaction.date).getMonth();
    const currentYear = new Date(currentTransaction.date).getFullYear();

    const prevMonthEntries = transactions.filter(t => {
      if (t.id === currentTransaction.id) return false;
      if (t.type !== TransactionType.EXPENSE || t.subCategory !== currentTransaction.subCategory) return false;
      
      const tDate = new Date(t.date);
      const tMonth = tDate.getMonth();
      const tYear = tDate.getFullYear();

      const targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      return tMonth === targetMonth && tYear === targetYear;
    });

    if (prevMonthEntries.length === 0) return <span className="text-slate-700 text-[10px]">—</span>;

    const avgPrevPrice = prevMonthEntries.reduce((sum, t) => sum + t.amount, 0) / prevMonthEntries.length;
    
    const diff = currentTransaction.amount - avgPrevPrice;
    const isHigher = currentTransaction.amount > avgPrevPrice;
    const isLower = currentTransaction.amount < avgPrevPrice;

    return (
      <div className="flex flex-col items-center justify-center min-w-[70px]">
        <div className="flex items-center gap-1">
          {isHigher && <span className="text-red-500 font-bold text-base" title={`Prev Month: ৳${avgPrevPrice.toFixed(0)}`}>↑</span>}
          {isLower && <span className="text-emerald-500 font-bold text-base" title={`Prev Month: ৳${avgPrevPrice.toFixed(0)}`}>↓</span>}
          {!isHigher && !isLower && <span className="text-slate-600 text-xs">—</span>}
          {(isHigher || isLower) && (
            <span className={`text-[10px] font-bold ${isHigher ? 'text-red-400' : 'text-emerald-400'}`}>
              ৳{Math.abs(diff).toFixed(0)}
            </span>
          )}
        </div>
        <span className="text-[7px] text-slate-500 uppercase font-black tracking-widest">vs Prev Month</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <h3 className="text-xl font-bold text-white">Financial Ledger</h3>
        <span className="text-[10px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 font-bold tracking-widest uppercase">{transactions.length} entries</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead className="text-[10px] uppercase bg-slate-900/50 text-slate-500 border-b border-slate-700 tracking-widest">
            <tr>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Category & Item</th>
              <th className="px-6 py-4 font-bold">Amount</th>
              <th className="px-6 py-4 font-bold text-center">Price Comp</th>
              <th className="px-6 py-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
              <tr key={t.id} className="hover:bg-slate-700/20 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                  {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">
                      {t.type === TransactionType.INCOME ? t.incomeSource : (t.subCategory || t.category)}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">
                      {t.type === TransactionType.INCOME ? 'Income Source' : t.category}
                    </span>
                    {t.note && <span className="text-[11px] text-slate-400 mt-1 italic max-w-[180px] truncate">{t.note}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-mono font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-slate-100'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{CURRENCY_SYMBOL}{t.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getPriceTrend(t)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-slate-600 hover:text-red-500 transition-all p-2 rounded-lg opacity-0 group-hover:opacity-100"
                  >
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <i className="fas fa-receipt text-5xl opacity-10 mb-4"></i>
                    <p className="text-sm font-medium tracking-wide">No transactions recorded.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
