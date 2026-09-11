"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../lib/api.js";

/**
 * Clean zeroed fallback state when user is newly registered or data is loading
 */
const EMPTY_DASHBOARD = {
  period: "This Month",
  kpi: {
    budgetTotal: 0,
    expenseTotal: 0,
    receivablesTotal: 0,
    debtTotal: 0,
    percentSpent: 0,
  },
  monthlyBars: [],
  categoryBreakdown: [],
  recentTransactions: [],
  activeDebts: [],
};

/**
 * ============================================================================
 * REACT QUERY: useDashboardData
 * ============================================================================
 * Queries /api/dashboard/overview from the live backend.
 */
export function useDashboardData(month, year) {
  return useQuery({
    queryKey: ["dashboard", { month, year }],
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard/overview", {
          params: { month, year },
        });
        // Axios interceptor returns the response body { success: true, data: {...} }
        return res?.data || res || EMPTY_DASHBOARD;
      } catch (err) {
        console.warn("Could not fetch live dashboard overview:", err.message);
        return EMPTY_DASHBOARD;
      }
    },
    staleTime: 1000 * 30, // 30 seconds cache
  });
}
