"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Film,
  HeartPulse,
  Home,
  Loader2,
  PiggyBank,
  Plus,
  ReceiptText,
  ShoppingBag,
  Sliders,
  TrendingUp,
  Utensils,
  Wallet,
  Wifi,
  X,
} from "lucide-react";
import { budgetSchema } from "../../../lib/validations.js";
import useStore from "../../../store/useStore.js";
import api from "../../../lib/api.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardData } from "../../../hooks/useDashboard.js";

const CATEGORY_ICON_MAP = {
  "Food & Dining": Utensils,
  "Food & Groceries": Utensils,
  "Rent & Housing": Home,
  "Housing & Rent": Home,
  "Transport & Fuel": Car,
  "Utilities & Wifi": Wifi,
  "Entertainment": Film,
  "Healthcare": HeartPulse,
  "Shopping": ShoppingBag,
};

export default function BudgetPage() {
  const showToast = useStore((state) => state.showToast);
  const queryClient = useQueryClient();

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState("");
  const [budgetError, setBudgetError] = useState("");

  const { data: budgetData, isLoading: isBudgetLoading } = useQuery({
    queryKey: ["currentBudget"],
    queryFn: async () => {
      try {
        const res = await api.get("/budgets/current");
        return res?.data || res;
      } catch (err) {
        console.warn("Error fetching current budget:", err.message);
        return null;
      }
    },
  });

  const { data: dashboardData } = useDashboardData();

  const totalBudget = budgetData?.totalBudget ? parseFloat(budgetData.totalBudget) : 0;
  const totalSpent = budgetData?.totalSpent ? parseFloat(budgetData.totalSpent) : (dashboardData?.kpi?.expenseTotal || 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const percentUsed = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const categoryBreakdown = dashboardData?.categoryBreakdown || [];

  const handleOpenAdjust = () => {
    setTempBudgetInput(totalBudget > 0 ? String(totalBudget) : "");
    setBudgetError("");
    setIsAdjustModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (amount) => {
      const now = new Date();
      return await api.post("/budgets", {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        totalBudget: amount,
      });
    },
    onSuccess: (data, newAmount) => {
      queryClient.invalidateQueries({ queryKey: ["currentBudget"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast(`Monthly budget updated to ${Number(newAmount).toLocaleString()} ETB!`, "success");
      setIsAdjustModalOpen(false);
    },
    onError: (err) => {
      setBudgetError(err.message || "Failed to update budget");
    },
  });

  const handleSaveBudget = (e) => {
    e.preventDefault();

    const now = new Date();
    const result = budgetSchema.safeParse({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      totalBudget: tempBudgetInput,
    });

    if (!result.success) {
      setBudgetError(result.error.flatten().fieldErrors.totalBudget?.[0] || "Invalid budget amount");
      return;
    }

    setBudgetError("");
    saveMutation.mutate(result.data.totalBudget);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Monthly Budget
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your personal spending limits and live category usage for this month.
          </p>
        </div>

        <button
          onClick={handleOpenAdjust}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-spring" />
          <span>{totalBudget > 0 ? "Adjust Budget" : "Set Budget"}</span>
        </button>
      </div>

      {totalBudget === 0 && !isBudgetLoading && (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">No monthly budget set yet</h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Set a monthly spending limit to monitor your expenses and stay on track.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdjust}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            Set Monthly Budget
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Budget */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Monthly Budget
            </p>
            <div className="w-8 h-8 rounded-lg bg-spring/20 text-onyx flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-gray-900 font-serif">
              {totalBudget.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Spent This Month
            </p>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-gray-900 font-serif">
              {totalSpent.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>

        {/* Safe Remaining */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Left to Spend
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-emerald-700 font-serif">
              {remaining.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>
      </div>

      {/* Category Allocations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 font-serif">
            Live Spending by Category
          </h2>
          <span className="text-xs text-gray-500">
            {categoryBreakdown.length} {categoryBreakdown.length === 1 ? "Category" : "Categories"} Active
          </span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-gray-200 text-center text-gray-500">
            <ReceiptText className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">No expenses recorded for this month</p>
            <p className="text-xs text-gray-400 mt-1">
              When you add expenses, your live spending by category will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryBreakdown.map((item, idx) => {
              const Icon = CATEGORY_ICON_MAP[item.name] || ReceiptText;
              const catPercent = item.percent || 0;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {catPercent}% of total expenses
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500 font-medium">Spent so far</span>
                        <span className="font-bold text-gray-900 font-serif">
                          {Number(item.amount).toLocaleString()} ETB
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-onyx"
                          style={{ width: `${Math.min(100, Math.max(5, catPercent))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Adjust Budget Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-onyx text-spring flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900 font-serif">
                  {totalBudget > 0 ? "Adjust Monthly Budget" : "Set Monthly Budget"}
                </h3>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Total Monthly Budget (ETB)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    placeholder="e.g. 25000"
                    value={tempBudgetInput}
                    onChange={(e) => {
                      setTempBudgetInput(e.target.value);
                      if (budgetError) setBudgetError("");
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-lg font-bold font-serif text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${budgetError
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-gray-200 focus:border-onyx focus:ring-onyx/10"
                      }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    ETB
                  </span>
                </div>
                {budgetError && (
                  <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{budgetError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Budget</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}