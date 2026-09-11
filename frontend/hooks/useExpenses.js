"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api.js";

/**
 * ============================================================================
 * REACT QUERY: useExpenses
 * ============================================================================
 * Fetches expenses with optional category and date filtering.
 */
export function useExpenses(filters = {}) {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: async () => {
      const res = await api.get("/expenses", { params: filters });
      return res.data || [];
    },
  });
}

/**
 * ============================================================================
 * REACT QUERY: useCreateExpense
 * ============================================================================
 * Performs POST /api/expenses.
 * On success, automatically invalidates the ['dashboard'] and ['expenses']
 * query caches so the entire UI updates immediately!
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData) => {
      const res = await api.post("/expenses", expenseData);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate queries so TanStack Query immediately refetches fresh data!
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
