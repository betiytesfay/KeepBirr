import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  numeric,
  text,
} from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// =====================
// CONTACTS
// (can be app users OR just manual entries)
// =====================
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),

  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),


  userId: integer("user_id").references(() => users.id),

  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  accountNumber: varchar("account_number", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});


//
// Expenses
//
export const expense = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  recurring: boolean("recurring").default(false),
  frequency: varchar("frequency", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow()
})

// =====================
// DEBTS
// =====================
export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  contactId: integer("contact_id").notNull().references(() => contacts.id),
  originalAmount: numeric("original_amount", { precision: 10, scale: 2 }).notNull(),
  remainingAmount: numeric("remaining_amount", { precision: 10, scale: 2 }).notNull(),
  isOwedToYou: boolean("is_owed_to_you").notNull(), // true = contact owes you, false = you owe contact
  description: text("description"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
//==========
//Payments
//==========
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  debtId: integer("debt_id").notNull().references(() => debts.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  source: varchar("source", { length: 100 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  isRecurring: boolean("is_recurring").default(false),
  frequency: varchar("frequency", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});
// =====================
// BUDGETS (monthly)
// =====================

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  totalBudget: numeric("total_budget", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
//=====================
//Categories
//====================
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// =====================
// NOTIFICATIONS
// =====================
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 150 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  relatedDebtId: integer("related_debt_id").references(() => debts.id),
  createdAt: timestamp("created_at").defaultNow(),
});