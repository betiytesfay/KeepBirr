"use client";

import React, { useState } from "react";
import { ArrowUpRight, BarChart3, PieChart, Sparkles } from "lucide-react";

const CATEGORY_COLORS = [
  "bg-onyx",
  "bg-spring",
  "bg-amber-400",
  "bg-sky-400",
  "bg-indigo-400",
  "bg-rose-400",
  "bg-emerald-500",
];

function DashboardChart({
  monthlyBars: propMonthlyBars,
  categoryBreakdown: propCategories,
  remainingBudget,
}) {
  const [activeTab, setActiveTab] = useState("monthly");

  const defaultMonthlyBars = [
    { label: "Jan", budget: 35000, spent: 28000 },
    { label: "Feb", budget: 38000, spent: 31000 },
    { label: "Mar", budget: 40000, spent: 34500 },
    { label: "Apr", budget: 42000, spent: 29000 },
    { label: "May", budget: 45000, spent: 38200 },
    { label: "Jun", budget: 45000, spent: 18450 },
  ];

  const monthlyBars =
    propMonthlyBars && propMonthlyBars.length > 0
      ? propMonthlyBars
      : defaultMonthlyBars;

  const maxVal = Math.max(
    50000,
    ...monthlyBars.map((b) => Math.max(Number(b.budget || 0), Number(b.spent || 0)))
  );

  const defaultCategories = [
    { name: "Rent & Housing", amount: 12000, total: 15000, percent: 80, color: "bg-onyx" },
    { name: "Food & Groceries", amount: 3800, total: 6000, percent: 63, color: "bg-spring" },
    { name: "Transport & Fuel", amount: 1450, total: 3000, percent: 48, color: "bg-amber-400" },
    { name: "Utilities & Wifi", amount: 950, total: 2000, percent: 47, color: "bg-sky-400" },
    { name: "Entertainment", amount: 250, total: 2000, percent: 12, color: "bg-indigo-400" },
  ];

  const categories =
    propCategories && propCategories.length > 0
      ? propCategories
      : defaultCategories;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Bar Chart (2 cols) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Cashflow & Spending Trend
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-200" />
              <span className="text-gray-500">Budget Limit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-spring border border-emerald-500" />
              <span className="text-gray-800">Actual Spent</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-gray-100">
          {monthlyBars.map((item, idx) => {
            const bVal = Number(item.budget || 0);
            const sVal = Number(item.spent || 0);
            const budgetHeight = Math.min(100, Math.round((bVal / maxVal) * 100));
            const spentHeight = Math.min(100, Math.round((sVal / maxVal) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                  {/* Budget Column */}
                  <div
                    style={{ height: `${budgetHeight}%` }}
                    className="w-3 sm:w-5 bg-gray-100 group-hover:bg-gray-200 rounded-t-md transition-all duration-300 relative"
                    title={`Budget: ${bVal.toLocaleString()} ETB`}
                  />
                  {/* Spent Column */}
                  <div
                    style={{ height: `${spentHeight}%` }}
                    className={`w-3 sm:w-5 rounded-t-md transition-all duration-300 relative ${
                      idx === monthlyBars.length - 1
                        ? "bg-spring shadow-xs"
                        : "bg-onyx group-hover:bg-gray-800"
                    }`}
                    title={`Spent: ${sVal.toLocaleString()} ETB`}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 mt-3">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown (1 col) */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Category Breakdown
            </h2>
            <span className="text-xs font-bold text-onyx bg-spring/30 px-2.5 py-1 rounded-full border border-spring/50">
              June 2026
            </span>
          </div>

          {/* Progress List */}
          <div className="space-y-4">
            {categories.map((cat, idx) => {
              const amountVal = Number(cat.amount || 0);
              const percentVal = Math.min(100, Number(cat.percent || 0));
              const colorClass = cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{cat.name}</span>
                    <span className="text-gray-500">
                      <strong className="text-gray-900">{amountVal.toLocaleString()} ETB</strong>
                      {cat.total ? ` / ${Number(cat.total).toLocaleString()} ETB` : ` (${percentVal}%)`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentVal}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">Remaining Budget</span>
          <span className="font-bold text-onyx font-serif text-base">
            {remainingBudget !== undefined
              ? `${Number(remainingBudget).toLocaleString()} ETB`
              : "26,550 ETB"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashboardChart;
