
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Transaction, 
  TransactionType, 
  UserProfile 
} from './types';
import { 
  LOCAL_STORAGE_KEY, 
  USER_STORAGE_KEY 
} from './constants';
import DashboardCard from './components/DashboardCard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import AIInsightsSection from './components/AIInsightsSection';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem(USER_STORAGE_KEY));
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem(USER_STORAGE_KEY, userName);
    }
  }, [userName]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [transactions]);

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
  };

  if (!userName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-800">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
              <i className="fas fa-wallet text-emerald-500 text-3xl"></i>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white text-center mb-2">Welcome to PFC</h1>
          <p className="text-slate-400 text-center mb-8 text-sm">Your Personal Financial Companion</p>
          <form onSubmit={handleSetName} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Enter your name</label>
              <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-lg"
                placeholder="Ex: John Doe"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-900/20 transition-all duration-300 text-lg"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800 py-3 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <i className="fas fa-landmark text-white text-sm"></i>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">PFC</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden xs:block text-right">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">User</p>
              <p className="text-white text-sm font-medium leading-none">{userName}</p>
            </div>
            <button 
              onClick={() => { if(confirm("This will clear all data. Continue?")) { localStorage.clear(); window.location.reload(); } }}
              className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
              title="Reset Profile"
            >
              <i className="fas fa-user-circle text-slate-400"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:py-10 space-y-6 md:space-y-8">
        {/* Dashboard Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <DashboardCard 
            title="Total Income" 
            amount={stats.totalIncome} 
            icon="fa-arrow-trend-up" 
            color="bg-emerald-500" 
          />
          <DashboardCard 
            title="Total Expenses" 
            amount={stats.totalExpense} 
            icon="fa-arrow-trend-down" 
            color="bg-rose-500" 
          />
          <DashboardCard 
            title="Net Balance" 
            amount={stats.balance} 
            icon="fa-scale-balanced" 
            color="bg-sky-500" 
          />
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Form and Insights Column */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8 order-2 lg:order-1">
            <TransactionForm onAdd={handleAddTransaction} />
            <AIInsightsSection transactions={transactions} userName={userName} />
          </div>

          {/* History Column */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <TransactionTable 
              transactions={transactions} 
              onDelete={handleDeleteTransaction} 
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-6 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest border-t border-slate-900 mt-10">
        <p>PFC - Companion for Bangladesh &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
