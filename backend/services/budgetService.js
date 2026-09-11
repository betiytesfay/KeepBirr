import { db } from '../db/index.js';
import { budgets, expense } from '../db/schema.js';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

export const getBudgets = async (userId, year) => {
  const conditions = [eq(budgets.userId, userId)];
  if (year) {
    conditions.push(eq(budgets.year, parseInt(year, 10)));
  }
  return await db
    .select()
    .from(budgets)
    .where(and(...conditions))
    .orderBy(desc(budgets.year), desc(budgets.month));
};

export const getCurrentBudget = async (userId, targetMonth, targetYear) => {
  const now = new Date();
  const month = targetMonth ? parseInt(targetMonth, 10) : now.getMonth() + 1; // 1-12
  const year = targetYear ? parseInt(targetYear, 10) : now.getFullYear();

  // Find budget for this month
  const found = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.month, month),
        eq(budgets.year, year)
      )
    );

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  // Calculate total spent in this month
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

  const totalSpent = monthExpenses.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );

  const budgetRecord = found[0] || null;
  const totalBudget = budgetRecord ? parseFloat(budgetRecord.totalBudget) : 0;
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;

  return {
    budget: budgetRecord,
    month,
    year,
    totalBudget,
    totalSpent,
    remaining,
    percentSpent,
  };
};

export const upsertBudget = async (userId, data) => {
  const { month, year, totalBudget } = data;
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);
  const formattedBudget = String(totalBudget);

  const existing = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.month, parsedMonth),
        eq(budgets.year, parsedYear)
      )
    );

  if (existing.length > 0) {
    const updated = await db
      .update(budgets)
      .set({
        totalBudget: formattedBudget,
        updatedAt: new Date(),
      })
      .where(eq(budgets.id, existing[0].id))
      .returning();
    return updated[0];
  }

  const created = await db
    .insert(budgets)
    .values({
      userId,
      month: parsedMonth,
      year: parsedYear,
      totalBudget: formattedBudget,
    })
    .returning();

  return created[0];
};

export const deleteBudget = async (userId, id) => {
  const deleted = await db
    .delete(budgets)
    .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
    .returning();
  return deleted[0] || null;
};
