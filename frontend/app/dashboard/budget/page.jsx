"use client";

import React, { useState } from "react";
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

// Real imported Lucide Icons mapping for categories (No text emojis!)
const CATEGORY_ICON_MAP = {
  "Food & Dining": Utensils,
  "Rent & Housing": Home,
  "Transport & Fuel": Car,
  "Utilities & Wifi": Wifi,
  "Entertainment": Film,
  "Healthcare": HeartPulse,
  "Shopping": ShoppingBag,
};

const INITIAL_CATEGORY_BUDGETS = [
  {
    id: 1,
    name: "Rent & Housing",
    icon: Home,
    spent: 12000,
    allocated: 15000,
    color: "bg-onyx",
  },
  {
    id: 2,
    name: "Food & Dining",
    icon: Utensils,
    spent: 3800,
    allocated: 6000,
    color: "bg-spring",
  },
  {
    id: 3,
    name: "Transport & Fuel",
    icon: Car,
    spent: 1450,
    allocated: 3000,
    color: "bg-amber-400",
  },
  {
    id: 4,
    name: "Utilities & Wifi",
    icon: Wifi,
    spent: 950,
    allocated: 2000,
    color: "bg-sky-400",
  },
  {
    id: 5,
    name: "Entertainment",
    icon: Film,
    spent: 250,
    allocated: 2000,
    color: "bg-indigo-400",
  },
];

export default function BudgetPage() {
  const showToast = useStore((state) => state.showToast);
  const queryClient = useQueryClient();

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState(45000);
  const [tempBudgetInput, setTempBudgetInput] = useState("45000");
  const [budgetError, setBudgetError] = useState("");

  const totalSpent = 18450;
  const remaining = Math.max(0, totalBudget - totalSpent);
  const percentUsed = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const handleOpenAdjust = () => {
    setTempBudgetInput(String(totalBudget));
    setBudgetError("");
    setIsAdjustModalOpen(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();

    // Zod validation
    const result = budgetSchema.safeParse({
      month: 6,
      year: 2026,
      totalBudget: tempBudgetInput,
    });

    if (!result.success) {
      setBudgetError(result.error.flatten().fieldErrors.totalBudget?.[0] || "Invalid budget amount");
      return;
    }

    setBudgetError("");
    const newAmount = result.data.totalBudget;
    setTotalBudget(newAmount);

    // Call API in background
    api.post("/budgets", { month: 6, year: 2026, totalBudget: newAmount }).catch(() => {});
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });

    showToast(`Monthly budget updated to ${newAmount.toLocaleString()} ETB!`, "success");
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Monthly Budget
          </h1>
        </div>

        <button
          onClick={handleOpenAdjust}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-spring" />
          <span>Set Budget</span>
        </button>
      </div>

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
            Budget by Category
          </h2>
          <span className="text-xs text-gray-500">
            {INITIAL_CATEGORY_BUDGETS.length} Categories Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INITIAL_CATEGORY_BUDGETS.map((item) => {
            const Icon = item.icon;
            const catPercent = Math.min(100, Math.round((item.spent / item.allocated) * 100));
            const isNearLimit = catPercent >= 80;

            return (
              <div
                key={item.id}
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
                          Limit: {item.allocated.toLocaleString()} ETB
                        </p>
                      </div>
                    </div>
                    {isNearLimit && (
                      <span className="p-1 rounded-md bg-amber-50 text-amber-700" title="Near Limit">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Spent so far</span>
                      <span className="font-bold text-gray-900 font-serif">
                        {item.spent.toLocaleString()} / {item.allocated.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${
                          catPercent >= 90
                            ? "bg-rose-500"
                            : catPercent >= 75
                            ? "bg-amber-400"
                            : item.color
                        } h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Remaining:{" "}
                    <strong className="text-gray-800">
                      {(item.allocated - item.spent).toLocaleString()} ETB
                    </strong>
                  </span>
                  <button
                    onClick={handleOpenAdjust}
                    className="text-xs font-bold text-onyx hover:underline cursor-pointer"
                  >
                    Adjust
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjust Budget Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <PiggyBank className="w-5 h-5 text-onyx" />
                <h3 className="text-lg font-bold text-onyx font-serif">
                  Adjust Monthly Budget Limit
                </h3>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Monthly Limit (ETB)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={tempBudgetInput}
                    onChange={(e) => setTempBudgetInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm font-semibold focus:outline-hidden"
                    placeholder="e.g. 50000"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-gray-400">
                    ETB
                  </span>
                </div>
                {budgetError && (
                  <p className="text-xs text-rose-600 font-medium mt-1">
                    {budgetError}
                  </p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
                >
                  Save Budget Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}