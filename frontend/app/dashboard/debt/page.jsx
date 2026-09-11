"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Plus,
  Search,
  User,
  Wallet,
  X,
  HandCoins,
  Loader2,
} from "lucide-react";
import useStore from "../../../store/useStore.js";
import { debtSchema } from "../../../lib/validations.js";
import api from "../../../lib/api.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function DebtPage() {
  const showToast = useStore((state) => state.showToast);
  const queryClient = useQueryClient();

  // Fetch live debts (isOwedToYou: false)
  const { data: serverDebts, isLoading } = useQuery({
    queryKey: ["debts", "debt"],
    queryFn: async () => {
      try {
        const res = await api.get("/debts?type=debt");
        return res?.data || res || [];
      } catch (err) {
        console.warn("Could not fetch debts:", err.message);
        return [];
      }
    },
  });

  const debts = Array.isArray(serverDebts) ? serverDebts : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  // Form State
  const [newCreditor, setNewCreditor] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const filteredDebts = debts.filter((item) => {
    const nameMatch = (item.contactName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const accountMatch = (item.contactAccountNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || descMatch || accountMatch;
  });

  const totalOwed = debts
    .filter((item) => parseFloat(item.remainingAmount || 0) > 0)
    .reduce((sum, item) => sum + parseFloat(item.remainingAmount || 0), 0);

  const activeCount = debts.filter(
    (item) => parseFloat(item.remainingAmount || 0) > 0
  ).length;

  const totalPaid = debts.reduce((sum, item) => {
    const orig = parseFloat(item.originalAmount || 0);
    const rem = parseFloat(item.remainingAmount || 0);
    return sum + Math.max(0, orig - rem);
  }, 0);

  const handleOpenAdd = () => {
    setNewCreditor("");
    setNewAccount("");
    setNewAmount("");
    setNewDueDate("");
    setNewNotes("");
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      return await api.post("/debts", payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast(
        `Debt of ${Number(variables.originalAmount).toLocaleString()} ETB recorded`,
        "info"
      );
      setIsAddModalOpen(false);
    },
    onError: (err) => {
      showToast(err.message || "Failed to record debt", "error");
    },
  });

  const handleCreateDebt = (e) => {
    e.preventDefault();

    const result = debtSchema.safeParse({
      contactName: newCreditor,
      originalAmount: newAmount,
      isOwedToYou: false,
      dueDate: newDueDate || undefined,
      description: newNotes || undefined,
    });

    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFormErrors({});
    createMutation.mutate({
      contactName: result.data.contactName,
      contactAccountNumber: newAccount,
      originalAmount: result.data.originalAmount,
      isOwedToYou: false,
      dueDate: result.data.dueDate,
      description: result.data.description,
    });
  };

  const handleOpenPay = (debt) => {
    setSelectedDebt(debt);
    setPayAmount(String(debt.remainingAmount));
    setIsPayModalOpen(true);
  };

  // Payment mutation
  const payMutation = useMutation({
    mutationFn: async ({ debtId, amount }) => {
      return await api.post(`/debts/${debtId}/payments`, { amount });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast(
        `Payment of ${Number(variables.amount).toLocaleString()} ETB recorded!`,
        "success"
      );
      setIsPayModalOpen(false);
    },
    onError: (err) => {
      showToast(err.message || "Failed to record payment", "error");
    },
  });

  const handleConfirmPay = (e) => {
    e.preventDefault();
    if (!selectedDebt) return;

    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return;

    payMutation.mutate({
      debtId: selectedDebt.id,
      amount,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Money I Owe
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track bank loans, credit lines, and debts you need to pay back.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-spring" />
          <span>Record Debt to Pay</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total You Owe
            </p>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-gray-900 font-serif">
              {totalOwed.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active Debts
            </p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-gray-900 font-serif">
              {activeCount}
            </span>
            <span className="text-xs font-bold text-gray-500">
              {activeCount === 1 ? "Debt" : "Debts"}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Paid Off
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-emerald-700 font-serif">
              {totalPaid.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by creditor or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-onyx focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Debts Table */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Who You Owe</th>
                <th className="py-3.5 px-6">Payment Account</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Amount to Pay</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredDebts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-gray-400">
                    <HandCoins className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-gray-700 text-sm">No debts recorded</p>
                    <p className="text-xs text-gray-400 mt-0.5 mb-3">
                      You are debt-free! If you take out a loan or borrow money, record it here.
                    </p>
                    <button
                      onClick={handleOpenAdd}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-spring" />
                      <span>Record Debt to Pay</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredDebts.map((item) => {
                  const rem = parseFloat(item.remainingAmount || 0);
                  const isSettled = rem <= 0;
                  const dateStr = item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No due date";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">
                              {item.contactName}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {item.description || "Loan obligation"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-mono font-medium text-gray-800">
                            {item.contactAccountNumber || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            isSettled
                              ? "bg-gray-100 text-gray-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {isSettled ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{isSettled ? "Settled" : "Pending"}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right font-serif font-bold text-gray-900 text-base">
                        {rem.toLocaleString()} ETB
                      </td>

                      <td className="py-4 px-6 text-center">
                        {!isSettled ? (
                          <button
                            onClick={() => handleOpenPay(item)}
                            className="px-3 py-1.5 rounded-lg bg-onyx text-white hover:bg-gray-800 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            Make Payment
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">Settled</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Debt Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold text-onyx font-serif">
                  Record Debt to Pay
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDebt} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Who You Owe (Creditor / Bank / Person) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Commercial Bank of Ethiopia or Selam"
                  value={newCreditor}
                  onChange={(e) => setNewCreditor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                />
                {formErrors.contactName && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.contactName[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Account / Loan Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CBE 100028912345 or telebirr"
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Total Amount Owed (ETB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 5000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-gray-400">
                    ETB
                  </span>
                </div>
                {formErrors.originalAmount && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.originalAmount[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Laptop installment payment"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Debt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Make Payment Modal */}
      {isPayModalOpen && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-onyx font-serif">
                Record Payment Made
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPay} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500">
                  Creditor: <strong className="text-gray-900">{selectedDebt.contactName}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Remaining to Pay:{" "}
                  <strong className="text-rose-600">
                    {parseFloat(selectedDebt.remainingAmount || 0).toLocaleString()} ETB
                  </strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Amount Paid (ETB)
                </label>
                <input
                  type="number"
                  step="any"
                  max={selectedDebt.remainingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm font-semibold focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {payMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}