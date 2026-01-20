
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum IncomeSource {
  SALARY = 'Salary',
  FREELANCING = 'Freelancing',
  BUSINESS = 'Business',
  INVESTMENTS = 'Investments',
  RENTAL = 'Rental',
  OTHERS = 'Others'
}

export enum ExpenseCategory {
  MONTHLY_GROCERIES = 'Monthly Groceries (Shohid)',
  DAILY_GROCERIES = 'Daily Groceries (Imran)',
  LAUNDRY_IRONING = 'Laundry & Ironing',
  RENT = 'Rent',
  UTILITIES = 'Utilities',
  TRANSPORT = 'Transport',
  HEALTHCARE = 'Healthcare',
  EDUCATION = 'Education',
  ENTERTAINMENT = 'Entertainment',
  OTHERS = 'Others'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO string
  note: string;
  category?: ExpenseCategory;
  subCategory?: string;
  incomeSource?: IncomeSource;
}

export interface UserProfile {
  name: string;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
