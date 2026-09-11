import { db } from '../db/index.js';
import { debts, contacts, payments } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export const getDebts = async (userId, options = {}) => {
  const { isOwedToYou } = options;
  const conditions = [eq(debts.userId, userId)];

  if (isOwedToYou !== undefined) {
    conditions.push(eq(debts.isOwedToYou, isOwedToYou));
  }

  const rows = await db
    .select({
      id: debts.id,
      userId: debts.userId,
      contactId: debts.contactId,
      contactName: contacts.name,
      contactPhone: contacts.phone,
      contactAccountNumber: contacts.accountNumber,
      originalAmount: debts.originalAmount,
      remainingAmount: debts.remainingAmount,
      isOwedToYou: debts.isOwedToYou,
      description: debts.description,
      dueDate: debts.dueDate,
      createdAt: debts.createdAt,
      updatedAt: debts.updatedAt,
    })
    .from(debts)
    .innerJoin(contacts, eq(debts.contactId, contacts.id))
    .where(and(...conditions))
    .orderBy(desc(debts.createdAt));

  return rows;
};

export const getDebtById = async (userId, id) => {
  const rows = await db
    .select({
      id: debts.id,
      userId: debts.userId,
      contactId: debts.contactId,
      contactName: contacts.name,
      contactPhone: contacts.phone,
      contactAccountNumber: contacts.accountNumber,
      originalAmount: debts.originalAmount,
      remainingAmount: debts.remainingAmount,
      isOwedToYou: debts.isOwedToYou,
      description: debts.description,
      dueDate: debts.dueDate,
      createdAt: debts.createdAt,
      updatedAt: debts.updatedAt,
    })
    .from(debts)
    .innerJoin(contacts, eq(debts.contactId, contacts.id))
    .where(and(eq(debts.id, id), eq(debts.userId, userId)));

  if (rows.length === 0) return null;

  const debtRecord = rows[0];
  const debtPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.debtId, id))
    .orderBy(desc(payments.paymentDate));

  return {
    ...debtRecord,
    payments: debtPayments,
  };
};

export const createDebt = async (userId, data) => {
  const {
    contactId,
    contactName,
    contactPhone,
    originalAmount,
    isOwedToYou,
    description,
    dueDate,
  } = data;

  let targetContactId = contactId;

  // Auto create contact if contactId is not provided but contactName is given
  if (!targetContactId && contactName) {
    const newContact = await db
      .insert(contacts)
      .values({
        ownerId: userId,
        name: contactName,
        phone: contactPhone || null,
      })
      .returning();
    targetContactId = newContact[0].id;
  }

  if (!targetContactId) {
    throw new Error("Contact information is required");
  }

  const formattedAmount = String(originalAmount);

  const newDebt = await db
    .insert(debts)
    .values({
      userId,
      contactId: targetContactId,
      originalAmount: formattedAmount,
      remainingAmount: formattedAmount,
      isOwedToYou: Boolean(isOwedToYou),
      description: description || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    .returning();

  return await getDebtById(userId, newDebt[0].id);
};

export const recordDebtPayment = async (userId, debtId, paymentData) => {
  const { amount, note, paymentDate } = paymentData;
  const payAmount = parseFloat(amount);

  if (isNaN(payAmount) || payAmount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const existingDebt = await getDebtById(userId, debtId);
  if (!existingDebt) {
    return null;
  }

  const currentRemaining = parseFloat(existingDebt.remainingAmount);
  const newRemaining = Math.max(0, currentRemaining - payAmount);

  // Insert payment record
  const newPayment = await db
    .insert(payments)
    .values({
      debtId,
      amount: String(payAmount),
      note: note || null,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
    })
    .returning();

  // Update remaining amount on debt
  await db
    .update(debts)
    .set({
      remainingAmount: String(newRemaining),
      updatedAt: new Date(),
    })
    .where(eq(debts.id, debtId));

  return {
    payment: newPayment[0],
    remainingAmount: newRemaining,
    isFullyPaid: newRemaining === 0,
  };
};

export const deleteDebt = async (userId, id) => {
  const existingDebt = await getDebtById(userId, id);
  if (!existingDebt) return null;

  // Delete associated payments first
  await db.delete(payments).where(eq(payments.debtId, id));

  // Delete debt record
  const deleted = await db
    .delete(debts)
    .where(and(eq(debts.id, id), eq(debts.userId, userId)))
    .returning();

  return deleted[0] || null;
};
