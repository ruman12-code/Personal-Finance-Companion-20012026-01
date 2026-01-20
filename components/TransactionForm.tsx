
import React, { useState, useEffect } from 'react';
import { 
  TransactionType, 
  IncomeSource, 
  ExpenseCategory, 
  Transaction 
} from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORY_SUB_ITEMS: Record<string, string[]> = {
  [ExpenseCategory.MONTHLY_GROCERIES]: [
    'Rice', 'Lentils (Dal)', 'Soybean Oil', 'Mustard Oil', 'Eggs', 'Milk', 'Beef', 'Chicken', 'Mutton', 'Fish', 
    'Salt', 'Sugar', 'Spices (Masala)', 'Flour (Atta)', 'Maida', 'Tea', 
    'Detergent Powder (Wheel/Surf Excel)', 'Liquid Detergent', 'Fabric Softener', 'Dishwashing Liquid (Vim)', 
    'Floor Cleaner (Lysol)', 'Toilet Cleaner (Harpic)', 'Glass Cleaner', 'Soap (Lifebuoy/Lux)', 'Handwash',
    'Onion', 'Garlic', 'Ginger', 'Potatoes', 'Dry Fruits'
  ],
  [ExpenseCategory.DAILY_GROCERIES]: [
    'Seasonal Vegetables', 'Green Chili', 'Coriander Leaves', 'Milk (Liquid)', 'Eggs', 'Fresh Fish', 'Bread', 'Curd', 
    'Dishwashing Bar/Paste', 'Hand Soap', 'Snacks'
  ],
  [ExpenseCategory.LAUNDRY_IRONING]: [
    'Washing', 'Ironing', 'Dry Cleaning', 'Steam Press'
  ],
  [ExpenseCategory.UTILITIES]: [
    'Electricity (DESCO/DPDC)', 'Gas (Cylinder)', 'Gas (Line/Titas)', 'Water (WASA)', 'Internet (Fiber)', 'Mobile Recharge', 'Dish/Cable TV'
  ],
  [ExpenseCategory.TRANSPORT]: [
    'Rickshaw', 'CNG', 'Local Bus', 'Intercity Train', 'Uber/Pathao', 'Fuel (Octane/CNG)', 'Car Maintenance'
  ],
  [ExpenseCategory.HEALTHCARE]: [
    'General Medicine', 'Specialized Medicine', 'Doctor Consultation', 'Lab Test', 'Hospital Bill'
  ],
  [ExpenseCategory.EDUCATION]: [
    'School/University Fee', 'Tuition Fee', 'Books & Stationery'
  ],
  [ExpenseCategory.ENTERTAINMENT]: [
    'Restaurant Dining', 'Movie Tickets', 'OTT Subscriptions'
  ],
  [ExpenseCategory.RENT]: [
    'House Rent', 'Garage Rent'
  ],
  [ExpenseCategory.OTHERS]: [
    'Gifts', 'Charity/Zakat', 'Repairs', 'Misc'
  ]
};

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [incomeSource, setIncomeSource] = useState<IncomeSource>(IncomeSource.SALARY);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>(ExpenseCategory.MONTHLY_GROCERIES);
  const [subCategory, setSubCategory] = useState<string>('');

  useEffect(() => {
    const items = CATEGORY_SUB_ITEMS[expenseCategory];
    if (items && items.length > 0) {
      setSubCategory(items[0]);
    } else {
      setSubCategory('');
    }
  }, [expenseCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAdd({
      type,
      amount: Number(amount),
      date,
      note,
      incomeSource: type === TransactionType.INCOME ? incomeSource : undefined,
      category: type === TransactionType.EXPENSE ? expenseCategory : undefined,
      subCategory: type === TransactionType.EXPENSE ? subCategory : undefined,
    });

    setAmount('');
    setNote('');
  };

  const hasSubItems = CATEGORY_SUB_ITEMS[expenseCategory];

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 h-full">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <i className="fas fa-plus-circle text-emerald-500"></i>
        Log Entry
      </h3>

      <div className="flex mb-6 bg-slate-900 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            type === TransactionType.INCOME 
              ? 'bg-emerald-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            type === TransactionType.EXPENSE 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Expense
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Amount (৳)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
        </div>

        {type === TransactionType.INCOME ? (
          <div>
            <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Source</label>
            <select
              value={incomeSource}
              onChange={(e) => setIncomeSource(e.target.value as IncomeSource)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              {Object.values(IncomeSource).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Category</label>
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {hasSubItems && (
              <div>
                <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Item / Sub-category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {CATEGORY_SUB_ITEMS[expenseCategory].map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Short Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            placeholder="E.g. 5kg Aftab Rice"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 mt-2"
        >
          Add to Ledger
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
