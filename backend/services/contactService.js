import { db } from '../db/index.js';
import { contacts } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const getAllContacts = async (ownerId) => {
  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.ownerId, ownerId))
    .orderBy(desc(contacts.createdAt));
};

export const createContact = async (ownerId, data) => {
  const { name, phone, accountNumber } = data;
  if (!name) throw new Error("Contact name is required");

  const created = await db
    .insert(contacts)
    .values({
      ownerId,
      name,
      phone: phone || null,
      accountNumber: accountNumber || null,
    })
    .returning();

  return created[0];
};

export const deleteContact = async (ownerId, id) => {
  const deleted = await db
    .delete(contacts)
    .where(eq(contacts.id, id))
    .returning();
  return deleted[0] || null;
};
