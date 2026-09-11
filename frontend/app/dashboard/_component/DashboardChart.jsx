"use client";

import React, { useState } from "react";
import { ArrowUpRight, BarChart3, PieChart, Sparkles, ReceiptText } from "lucide-react";

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
  const monthlyBars = Array.isArray(propMonthlyBars) ? propMonthlyBars : [];
  const categories = Array.isArray(propCategories) ? propCategories : [];

  const maxVal = Math.max(
    1000,
    ...monthlyBars.map((b) => Math.max(Number(b.budget || 0), Number(b.spent || 0)))
  );

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

        {monthlyBars.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 border-b border-gray-100">
            <BarChart3 className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No monthly trends recorded yet</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Set monthly budgets and track daily expenses to see historical comparisons.
            </p>
          </div>
        ) : (
          /* Visual Bar Chart */
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
                      style={{ height: `${Math.max(4, budgetHeight)}%` }}
                      className="w-3 sm:w-5 bg-gray-100 group-hover:bg-gray-200 rounded-t-md transition-all duration-300 relative"
                      title={`Budget: ${bVal.toLocaleString()} ETB`}
                    />
                    {/* Spent Column */}
                    <div
                      style={{ height: `${Math.max(4, spentHeight)}%` }}
                      className={`w-3 sm:w-5 rounded-t-md transition-all duration-300 relative ${
                        idx === monthlyBars.length - 1
                          ? "bg-spring shadow-xs"
                          : "bg-onyx group-hover:bg-gray-800"
                      }`}
                      title={`Spent: ${sVal.toLocaleString()} ETB`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 mt-2">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Breakdown (1 col) */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Category Breakdown
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <ReceiptText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-semibold text-gray-600">No category data yet</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Record expenses with categories to see your spending distribution.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.slice(0, 5).map((cat, idx) => {
                const colorClass = cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                const pct = cat.percent || 0;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                        <span className="text-gray-700">{cat.name}</span>
                      </div>
                      <span className="text-gray-900 font-serif">
                        {Number(cat.amount || 0).toLocaleString()} ETB ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorClass}`}
                        style={{ width: `${Math.min(100, Math.max(3, pct))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardChart;
