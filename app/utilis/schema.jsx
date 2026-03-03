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


// =====================
// USERS
// =====================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

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

  createdAt: timestamp("created_at").defaultNow(),
});


// =====================
// DEBTS
// =====================
export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),

  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),

  contactId: integer("contact_id")
    .notNull()
    .references(() => contacts.id),

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

  // true = they owe you
  // false = you owe them
  isOwedToYou: boolean("is_owed_to_you").notNull(),

  description: text("description"),

  dueDate: timestamp("due_date"),

  isPaid: boolean("is_paid").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// =====================
// BUDGETS (monthly)
// =====================
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  month: integer("month").notNull(),
  year: integer("year").notNull(),

  totalBudget: numeric("total_budget", {
    precision: 10,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// =====================
// NOTIFICATIONS
// =====================
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  title: varchar("title", { length: 150 }).notNull(),
  message: text("message").notNull(),

  isRead: boolean("is_read").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});