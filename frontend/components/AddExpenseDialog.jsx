"use client";

import React, { useState } from "react";
import { expenseSchema } from "../lib/validations.js";
import { useCreateExpense } from "../hooks/useExpenses.js";
import useStore from "../store/useStore.js";
import { AlertCircle, CheckCircle2, Loader2, Plus, X } from "lucide-react";

const CATEGORIES = [
  "Food & Groceries",
  "Housing & Rent",
  "Transport & Fuel",
  "Utilities & Wifi",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Other",
];

export default function AddExpenseDialog({ isOpen: propIsOpen, onClose: propOnClose }) {
  // 1. ZUSTAND GLOBAL STATE: Read modal open state & actions
  const isAddExpenseOpen = useStore((state) => state.isAddExpenseOpen);
  const closeAddExpense = useStore((state) => state.closeAddExpense);
  const showToast = useStore((state) => state.showToast);

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAddExpenseOpen;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    closeAddExpense();
  };

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food & Groceries",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const timerRef = React.useRef(null);

  // Clear timer on unmount to prevent state updates on unmounted component
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 2. TANSTACK REACT QUERY: Server state mutation
  const createExpenseMutation = useCreateExpense();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(false);

    /**
     * ========================================================================
     * 3. ZOD RUNTIME TYPE CHECKING & VALIDATION
     * ========================================================================
     */
    const validationResult = expenseSchema.safeParse({
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Send validated data to backend via React Query mutation
    createExpenseMutation.mutate(validationResult.data, {
      onSuccess: () => {
        setSubmitSuccess(true);
        showToast("Expense recorded successfully! Dashboard synced.", "success");
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            amount: "",
            category: "Food & Groceries",
            description: "",
            date: new Date().toISOString().split("T")[0],
          });
          handleClose();
        }, 1000);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-onyx font-serif">
              Record New Expense
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Banner */}
          {submitSuccess && (
            <div className="p-3 rounded-xl bg-spring/20 border border-spring text-onyx text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Expense recorded successfully!</span>
            </div>
          )}

          {/* Server Error Banner */}
          {createExpenseMutation.isError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{createExpenseMutation.error?.message || "Failed to save"}</span>
            </div>
          )}

          {/* Field: Amount (ETB) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Amount (ETB) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                step="any"
                placeholder="e.g. 850"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition-colors ${
                  formErrors.amount
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/30"
                    : "border-gray-200 focus:border-onyx bg-white"
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-gray-400">
                ETB
              </span>
            </div>
            {formErrors.amount && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{formErrors.amount[0]}</span>
              </p>
            )}
          </div>

          {/* Field: Category */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx bg-white text-sm focus:outline-hidden"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {formErrors.category[0]}
              </p>
            )}
          </div>

          {/* Field: Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <input
              type="text"
              name="description"
              placeholder="e.g. TotalEnergies Fuel or Supermarket run"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx bg-white text-sm focus:outline-hidden"
            />
            {formErrors.description && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {formErrors.description[0]}
              </p>
            )}
          </div>

          {/* Field: Date */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx bg-white text-sm focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={createExpenseMutation.isPending}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createExpenseMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {createExpenseMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-spring" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-spring" />
                  <span>Record Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
