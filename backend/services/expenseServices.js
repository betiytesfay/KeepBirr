import { db } from '../db/index.js';
import { expense } from '../db/schema.js';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

export const getAllExpenses = async (userId, options = {}) => {
  const { category, startDate, endDate, limit = 50, offset = 0 } = options;
  const conditions = [eq(expense.userId, userId)];

  if (category) {
    conditions.push(eq(expense.category, category));
  }
  if (startDate) {
    conditions.push(gte(expense.date, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(expense.date, new Date(endDate)));
  }

  return await db
    .select()
    .from(expense)
    .where(and(...conditions))
    .orderBy(desc(expense.date))
    .limit(limit)
    .offset(offset);
};

export const getExpenseById = async (userId, id) => {
  const result = await db
    .select()
    .from(expense)
    .where(and(eq(expense.id, id), eq(expense.userId, userId)));
  return result[0] || null;
};

export const createExpense = async (userId, data) => {
  const { amount, category, description, date, recurring, frequency } = data;
  const result = await db
    .insert(expense)
    .values({
      userId,
      amount: String(amount),
      category,
      description: description || null,
      date: date ? new Date(date) : new Date(),
      recurring: recurring || false,
      frequency: frequency || null,
    })
    .returning();
  return result[0];
};

export const updateExpense = async (userId, id, data) => {
  const updateFields = {};
  if (data.amount !== undefined) updateFields.amount = String(data.amount);
  if (data.category !== undefined) updateFields.category = data.category;
  if (data.description !== undefined) updateFields.description = data.description;
  if (data.date !== undefined) updateFields.date = new Date(data.date);
  if (data.recurring !== undefined) updateFields.recurring = data.recurring;
  if (data.frequency !== undefined) updateFields.frequency = data.frequency;

  const result = await db
    .update(expense)
    .set(updateFields)
    .where(and(eq(expense.id, id), eq(expense.userId, userId)))
    .returning();

  return result[0] || null;
};

export const deleteExpense = async (userId, id) => {
  const result = await db
    .delete(expense)
    .where(and(eq(expense.id, id), eq(expense.userId, userId)))
    .returning();
  return result[0] || null;
};
