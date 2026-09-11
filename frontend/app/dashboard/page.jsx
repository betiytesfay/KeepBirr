"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Download,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import CardInfo from "./_component/CardInfo.jsx";
import DashboardChart from "./_component/DashboardChart.jsx";
import RecentExpenseList from "./_component/RecentExpenseList.jsx";
import DebtSummaryCard from "./_component/DebtSummaryCard.jsx";
import AddExpenseDialog from "../../components/AddExpenseDialog.jsx";
import { useDashboardData } from "../../hooks/useDashboard.js";
import useStore from "../../store/useStore.js";

export default function DashboardPage() {
  /**
   * ==========================================================================
   * 1. ZUSTAND CLIENT STATE: Modals, Filters, and Toast Notifications
   * ==========================================================================
   */
  const openAddExpense = useStore((state) => state.openAddExpense);
  const selectedPeriod = useStore((state) => state.selectedPeriod);
  const toast = useStore((state) => state.toast);
  const clearToast = useStore((state) => state.clearToast);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  // Sync user from localStorage if present
  React.useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const saved = localStorage.getItem("keepbirr_user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user, setUser]);

  /**
   * ==========================================================================
   * 2. TANSTACK REACT QUERY: Server State Caching & Background Refetch
   * ==========================================================================
   */
  const { data, isLoading, isFetching, refetch } = useDashboardData();

  const kpi = data?.kpi || {
    budgetTotal: 0,
    expenseTotal: 0,
    receivablesTotal: 0,
    debtTotal: 0,
    percentSpent: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0 relative">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Beti"}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{selectedPeriod}</span>
          </div>

          <button
            onClick={() => refetch()}
            title="Refresh Data via React Query"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-onyx hover:bg-gray-50 text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-emerald-600" : ""}`} />
          </button>

          {/* Record Expense Button: Triggers Zustand openAddExpense() */}
          <button
            onClick={openAddExpense}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-spring" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <section aria-label="Key Performance Indicators">
        <CardInfo
          budgetTotal={kpi.budgetTotal}
          expenseTotal={kpi.expenseTotal}
          receivablesTotal={kpi.receivablesTotal}
          debtTotal={kpi.debtTotal}
        />
      </section>

      {/* Visual Analytics & Breakdown */}
      <section aria-label="Cashflow Trends and Breakdown">
        <DashboardChart
          monthlyBars={data?.monthlyBars}
          categoryBreakdown={data?.categoryBreakdown}
        />
      </section>

      {/* Activity Feeds: Recent Expenses & Debts */}
      <section aria-label="Recent Transactions and Debts" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentExpenseList transactions={data?.recentTransactions} />
        <DebtSummaryCard debts={data?.activeDebts} />
      </section>

      {/* Add Expense Modal: Managed globally by Zustand & validated by Zod */}
      <AddExpenseDialog />

      {/* Zustand Global Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl border border-spring/60 bg-onyx text-white text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="w-2 h-2 rounded-full bg-spring shrink-0 animate-pulse" />
          <span>{toast.message}</span>
          <button
            onClick={clearToast}
            className="text-gray-400 hover:text-white ml-2 p-0.5 hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}