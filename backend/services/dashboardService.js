import { db } from '../db/index.js';
import { expense, budgets, debts, contacts } from '../db/schema.js';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getDashboardOverview = async (userId, targetMonth, targetYear) => {
  const now = new Date();
  const currentMonth = targetMonth ? parseInt(targetMonth, 10) : now.getMonth() + 1; // 1 - 12
  const currentYear = targetYear ? parseInt(targetYear, 10) : now.getFullYear();

  // 1. Current Month Budget
  const monthBudgets = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.month, currentMonth),
        eq(budgets.year, currentYear)
      )
    );

  const budgetTotal = monthBudgets.length > 0 ? parseFloat(monthBudgets[0].totalBudget) : 0;

  // 2. Current Month Expenses & Category Breakdown
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

  const monthExpenses = await db
    .select()
    .from(expense)
    .where(
      and(
        eq(expense.userId, userId),
        gte(expense.date, startOfMonth),
        lte(expense.date, endOfMonth)
      )
    );

  const expenseTotal = monthExpenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // Group by category
  const categoryTotals = {};
  monthExpenses.forEach((item) => {
    const cat = item.category || "Uncategorized";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(item.amount || 0);
  });

  const categoryBreakdown = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
    percent: expenseTotal > 0 ? Math.round((amount / expenseTotal) * 100) : 0,
  })).sort((a, b) => b.amount - a.amount);

  // 3. Debts & Receivables
  const userDebts = await db
    .select({
      id: debts.id,
      contactName: contacts.name,
      remainingAmount: debts.remainingAmount,
      isOwedToYou: debts.isOwedToYou,
      dueDate: debts.dueDate,
    })
    .from(debts)
    .innerJoin(contacts, eq(debts.contactId, contacts.id))
    .where(eq(debts.userId, userId));

  let receivablesTotal = 0;
  let debtTotal = 0;
  const activeDebtItems = [];

  userDebts.forEach((item) => {
    const remaining = parseFloat(item.remainingAmount || 0);
    if (remaining > 0) {
      if (item.isOwedToYou) {
        receivablesTotal += remaining;
      } else {
        debtTotal += remaining;
      }

      const isDueSoon = item.dueDate && (new Date(item.dueDate) - now < 7 * 24 * 60 * 60 * 1000);
      activeDebtItems.push({
        id: item.id,
        contact: item.contactName,
        type: item.isOwedToYou ? "receivable" : "debt",
        amount: remaining,
        dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No due date",
        status: isDueSoon ? "Due Soon" : "Pending",
      });
    }
  });

  // 4. Six-Month Cashflow History (Budget vs Spent)
  const monthlyBars = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1 - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const label = MONTH_NAMES[d.getMonth()];

    const s = new Date(y, m - 1, 1);
    const e = new Date(y, m, 0, 23, 59, 59, 999);

    const bRecord = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.userId, userId), eq(budgets.month, m), eq(budgets.year, y)));

    const expList = await db
      .select()
      .from(expense)
      .where(and(eq(expense.userId, userId), gte(expense.date, s), lte(expense.date, e)));

    const mSpent = expList.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const mBudget = bRecord.length > 0 ? parseFloat(bRecord[0].totalBudget) : 0;

    monthlyBars.push({
      label,
      budget: mBudget,
      spent: mSpent,
    });
  }

  // 5. Recent 5 Transactions
  const recentTransactions = await db
    .select()
    .from(expense)
    .where(eq(expense.userId, userId))
    .orderBy(desc(expense.date))
    .limit(5);

  const formattedTransactions = recentTransactions.map((item) => ({
    id: item.id,
    name: item.description || item.category,
    category: item.category,
    amount: -parseFloat(item.amount),
    date: new Date(item.date).toLocaleDateString(),
    type: "expense",
  }));

  const percentSpent = budgetTotal > 0 ? Math.round((expenseTotal / budgetTotal) * 100) : 0;

  return {
    period: `${MONTH_NAMES[currentMonth - 1]} ${currentYear}`,
    kpi: {
      budgetTotal,
      expenseTotal,
      receivablesTotal,
      debtTotal,
      percentSpent,
    },
    monthlyBars,
    categoryBreakdown,
    recentTransactions: formattedTransactions,
    activeDebts: activeDebtItems.slice(0, 5),
  };
};
