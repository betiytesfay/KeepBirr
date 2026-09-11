"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpDown,
  Calendar,
  Car,
  CheckCircle2,
  Film,
  GraduationCap,
  HeartPulse,
  Home,
  Loader2,
  Plus,
  ReceiptText,
  Search,
  ShoppingBag,
  Trash2,
  Utensils,
  Wifi,
} from "lucide-react";
import useStore from "../../../store/useStore.js";
import { useExpenses } from "../../../hooks/useExpenses.js";
import api from "../../../lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Real imported Lucide Icons mapping for categories (No text emojis!)
export const CATEGORY_ICON_MAP = {
  "Food & Groceries": Utensils,
  "Food & Dining": Utensils,
  "Housing & Rent": Home,
  "Rent & Housing": Home,
  "Transport & Fuel": Car,
  "Utilities & Wifi": Wifi,
  "Entertainment": Film,
  "Healthcare": HeartPulse,
  "Shopping": ShoppingBag,
  "Education": GraduationCap,
  "Other": ReceiptText,
};

const CATEGORIES = [
  "All",
  "Food & Groceries",
  "Housing & Rent",
  "Transport & Fuel",
  "Utilities & Wifi",
  "Entertainment",
  "Healthcare",
  "Shopping",
];

export default function ExpensePage() {
  const openAddExpense = useStore((state) => state.openAddExpense);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const showToast = useStore((state) => state.showToast);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc"); // "date-desc" | "amount-desc" | "amount-asc"

  // React Query: Fetch expenses from live backend
  const { data: serverExpenses, isLoading } = useExpenses();
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["currentBudget"] });
      showToast("Expense deleted successfully", "info");
    },
    onError: (err) => {
      showToast(err.message || "Failed to delete expense", "error");
    },
  });

  // Real user expenses only - zero fake fallbacks
  const allExpenses = useMemo(() => {
    return Array.isArray(serverExpenses) ? serverExpenses : [];
  }, [serverExpenses]);

  // Filter & Search
  const filteredExpenses = useMemo(() => {
    return allExpenses
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.category &&
            item.category.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "amount-desc") {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }
        if (sortBy === "amount-asc") {
          return Number(a.amount || 0) - Number(b.amount || 0);
        }
        // date-desc
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
  }, [allExpenses, selectedCategory, searchQuery, sortBy]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 w-full min-w-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Expenses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and categorize your daily spending records.
          </p>
        </div>

        <button
          onClick={openAddExpense}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-spring" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full min-w-0">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Spent
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              {totalSpent.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Filter Category
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 font-serif truncate">
              {selectedCategory}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Average Expense
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              {filteredExpenses.length > 0
                ? Math.round(totalSpent / filteredExpenses.length).toLocaleString()
                : 0}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-4 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by description or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-onyx focus:bg-white transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 shrink-0 self-end sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold focus:outline-hidden focus:border-onyx"
            >
              <option value="date-desc">Newest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat] || ReceiptText;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-onyx text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat !== "All" && <Icon className="w-3.5 h-3.5" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-2xs overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Transaction</th>
                <th className="py-3.5 px-4 sm:px-6">Category</th>
                <th className="py-3.5 px-4 sm:px-6">Date</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Amount</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 px-4">
                    <ReceiptText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-gray-700 text-sm">No expenses found</p>
                    <p className="text-xs text-gray-400 mt-0.5 mb-3">Record your daily expenses to monitor your cash flow.</p>
                    <button
                      onClick={openAddExpense}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-spring" />
                      <span>Record Expense</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => {
                  const Icon = CATEGORY_ICON_MAP[item.category] || ReceiptText;
                  const dateStr = item.date
                    ? new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-spring/30 flex items-center justify-center text-gray-700 group-hover:text-onyx transition-colors shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 leading-tight truncate max-w-[180px] sm:max-w-xs">
                              {item.description || item.category}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              ID: #{item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 whitespace-nowrap">
                          <Icon className="w-3 h-3 text-gray-500" />
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 sm:px-6 text-xs text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 sm:px-6 text-right font-serif font-bold text-gray-900 text-base whitespace-nowrap">
                        -{Number(item.amount || 0).toLocaleString()} ETB
                      </td>

                      {/* Action Delete */}
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <button
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete Expense"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}