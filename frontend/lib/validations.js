import { z } from "zod";

/**
 * ============================================================================
 * ZOD SCHEMA VALIDATIONS
 * ============================================================================
 * Zod validates JavaScript objects at runtime.
 * We use .safeParse(data) which returns:
 *   - { success: true, data: sanitizedData }
 *   - { success: false, error: ZodError } (with friendly error messages)
 */

// 1. Expense Validation Schema
export const expenseSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a valid number" })
    .positive("Amount must be greater than 0")
    .max(10000000, "Amount cannot exceed 10,000,000 ETB"),
  category: z
    .string({ required_error: "Category is required" })
    .min(2, "Please select or enter a valid category"),
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .optional()
    .or(z.literal("")),
  date: z
    .string()
    .optional()
    .default(() => new Date().toISOString().split("T")[0]),
  recurring: z.boolean().optional().default(false),
  frequency: z.string().optional(),
});

// 2. Monthly Budget Schema
export const budgetSchema = z.object({
  month: z.coerce
    .number()
    .int()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  year: z.coerce
    .number()
    .int()
    .min(2024, "Year must be 2024 or later"),
  totalBudget: z.coerce
    .number({ invalid_type_error: "Budget must be a valid number" })
    .positive("Budget must be greater than 0"),
});

// 3. Debt & Receivable Schema
export const debtSchema = z.object({
  contactName: z
    .string({ required_error: "Contact name is required" })
    .min(2, "Contact name must be at least 2 characters"),
  contactPhone: z
    .string()
    .regex(/^09\d{8}$|^07\d{8}$/, "Phone must be a valid Ethiopian number (e.g. 0911223344 or 0711223344)")
    .optional()
    .or(z.literal("")),
  originalAmount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  isOwedToYou: z.boolean({ required_error: "Please specify if this is owed to you" }),
  dueDate: z.string().optional().or(z.literal("")),
  description: z.string().max(255).optional().or(z.literal("")),
});
