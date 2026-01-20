
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface AIInsightsSectionProps {
  transactions: Transaction[];
  userName: string;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ transactions, userName }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsights = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const result = await getFinancialInsights(transactions, userName);
    setInsights(result);
    setLoading(false);
  };

  useEffect(() => {
    // Optionally fetch automatically on mount or when transactions change significantly
    // But to save tokens, we let user trigger it
  }, []);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-brain text-purple-400"></i>
          AI Financial Coach
        </h3>
        <button 
          onClick={fetchInsights}
          disabled={loading || transactions.length === 0}
          className="text-xs bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 px-3 py-1.5 rounded-lg border border-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      <div className="min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm animate-pulse">Scanning spending patterns...</p>
          </div>
        ) : insights ? (
          <div className="prose prose-invert prose-sm max-w-none text-slate-300">
             {insights.split('\n').map((line, i) => (
                <p key={i} className="mb-2 leading-relaxed">{line}</p>
             ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-chart-line text-slate-600 text-4xl mb-3 block"></i>
            <p className="text-slate-500 italic text-sm">
              Click "Refresh Insights" to get personalized advice based on your current data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsSection;
