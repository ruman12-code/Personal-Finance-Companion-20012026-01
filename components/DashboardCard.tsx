
import React from 'react';
import { CURRENCY_SYMBOL } from '../constants';

interface DashboardCardProps {
  title: string;
  amount: number;
  icon: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, amount, icon, color }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 hover:border-slate-500 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <i className={`fas ${icon} text-white text-xl`}></i>
        </div>
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">
        {CURRENCY_SYMBOL} {amount.toLocaleString()}
      </div>
    </div>
  );
};

export default DashboardCard;
