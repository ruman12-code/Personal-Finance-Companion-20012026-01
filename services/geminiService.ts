
import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialInsights(transactions: Transaction[], userName: string): Promise<string> {
  if (transactions.length === 0) {
    return "Start adding your income and expenses to receive personalized AI insights!";
  }

  // Calculate monthly stats for historical trend analysis
  const monthlyStats = transactions.reduce((acc: any, t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!acc[monthKey]) acc[monthKey] = { income: 0, expense: 0, balance: 0 };
    
    if (t.type === TransactionType.INCOME) {
      acc[monthKey].income += t.amount;
    } else {
      acc[monthKey].expense += t.amount;
    }
    acc[monthKey].balance = acc[monthKey].income - acc[monthKey].expense;
    return acc;
  }, {});

  // Current summary
  const currentSummary = transactions.reduce((acc: any, t) => {
    const key = t.type === TransactionType.INCOME ? t.incomeSource : t.category;
    if (!acc[t.type]) acc[t.type] = {};
    if (!acc[t.type][key as string]) acc[t.type][key as string] = 0;
    acc[t.type][key as string] += t.amount;
    return acc;
  }, {});

  const prompt = `
    Context: Senior Financial Advisor in Bangladesh for a family user named ${userName}.
    
    Data Source:
    - Multi-month History: ${JSON.stringify(monthlyStats)}
    - Detailed Category Breakdown: ${JSON.stringify(currentSummary)}
    
    Specific Task:
    1. TREND ANALYSIS: Compare this month's Net Balance against previous months. Is the saving rate improving?
    2. LOCALIZED INVESTMENT ADVICE: 
       - If balance > 30k consistently: Suggest Sanchaypatra (Family/Monthly) or Stocks (LafargeHolcim/GP/etc for dividends).
       - If balance is 5k-15k: Suggest a 3-5 year DPS with a reliable bank (City/EBL/SCB).
       - If balance is negative or <5k: Identify specific "luxury" categories to cut (e.g., Entertainment or Uber/Pathao) and suggest switching to local transport.
    3. GROCERY MONITORING: Mention any specific item (like Soybean Oil or Rice) that shows a rising trend based on the history.
    4. ACTIONABLE GOAL: Suggest one specific goal for next month (e.g., "Reduce Grocery bill by 10%").
    
    Format: Use Markdown, clear headings, and use the ৳ symbol. Keep the tone encouraging but strictly professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Unable to generate insights at this moment.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "An error occurred while analyzing your finances. Please try again later.";
  }
}
