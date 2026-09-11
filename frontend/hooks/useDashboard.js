"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../lib/api.js";

/**
 * Default fallback data used if the backend is not yet populated or offline
 */
const DEFAULT_DASHBOARD_FALLBACK = {
  period: "June 2026",
  kpi: {
    budgetTotal: 45000,
    expenseTotal: 18450,
    receivablesTotal: 8200,
    debtTotal: 3500,
    percentSpent: 41,
  },
  monthlyBars: [
    { label: "Jan", budget: 35000, spent: 28000 },
    { label: "Feb", budget: 38000, spent: 31000 },
    { label: "Mar", budget: 40000, spent: 34500 },
    { label: "Apr", budget: 42000, spent: 29000 },
    { label: "May", budget: 45000, spent: 38200 },
    { label: "Jun", budget: 45000, spent: 18450 },
  ],
  categoryBreakdown: [
    { name: "Rent & Housing", amount: 12000, percent: 65, color: "bg-onyx" },
    { name: "Food & Groceries", amount: 3800, percent: 21, color: "bg-spring" },
    { name: "Transport & Fuel", amount: 1450, percent: 8, color: "bg-amber-400" },
    { name: "Utilities & Wifi", amount: 950, percent: 5, color: "bg-sky-400" },
    { name: "Entertainment", amount: 250, percent: 1, color: "bg-indigo-400" },
  ],
  recentTransactions: [
    {
      id: 1,
      name: "Fresh Corner Supermarket",
      category: "Food & Groceries",
      amount: -1250,
      date: "Today, 10:45 AM",
      type: "expense",
    },
    {
      id: 2,
      name: "TotalEnergies Fuel Station",
      category: "Transport",
      amount: -850,
      date: "Yesterday, 4:20 PM",
      type: "expense",
    },
    {
      id: 3,
      name: "Apartment Monthly Rent",
      category: "Housing",
      amount: -12000,
      date: "Jun 01, 2026",
      type: "expense",
    },
    {
      id: 4,
      name: "Ethio Telecom Fiber Internet",
      category: "Utilities",
      amount: -950,
      date: "May 28, 2026",
      type: "expense",
    },
  ],
  activeDebts: [
    {
      id: 1,
      contact: "Abebe Bikila",
      type: "receivable",
      amount: 4500,
      dueDate: "In 3 days",
      status: "Pending",
    },
    {
      id: 2,
      contact: "Selamawit T.",
      type: "receivable",
      amount: 3700,
      dueDate: "Jun 20, 2026",
      status: "Pending",
    },
    {
      id: 3,
      contact: "CBE Bank Personal Loan",
      type: "debt",
      amount: 3500,
      dueDate: "In 5 days",
      status: "Due Soon",
    },
  ],
};

/**
 * ============================================================================
 * REACT QUERY: useDashboardData
 * ============================================================================
 * Queries /api/dashboard/overview. If backend fails or token is missing,
 * falls back to rich default state smoothly.
 */
export function useDashboardData(month, year) {
  return useQuery({
    queryKey: ["dashboard", { month, year }],
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard/overview", {
          params: { month, year },
        });
        return res.data || DEFAULT_DASHBOARD_FALLBACK;
      } catch (err) {
        console.warn("Using offline/fallback dashboard state:", err.message);
        return DEFAULT_DASHBOARD_FALLBACK;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
}
