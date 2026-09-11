"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowDownLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Phone,
  Plus,
  Search,
  User,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";
import useStore from "../../../store/useStore.js";
import { debtSchema } from "../../../lib/validations.js";
import api from "../../../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";

const INITIAL_RECEIVABLES = [
  {
    id: 1,
    contactName: "Abebe Bikila",
    phone: "0911223344",
    originalAmount: 4500,
    remainingAmount: 4500,
    dueDate: "2026-06-14",
    status: "Due Soon",
    note: "Borrowed for laptop repair",
  },
  {
    id: 2,
    contactName: "Selamawit Tadesse",
    phone: "0922334455",
    originalAmount: 3700,
    remainingAmount: 3700,
    dueDate: "2026-06-20",
    status: "Pending",
    note: "Shared travel expenses to Hawassa",
  },
  {
    id: 3,
    contactName: "Dawit Kebede",
    phone: "0933445566",
    originalAmount: 3500,
    remainingAmount: 0,
    dueDate: "2026-05-27",
    status: "Settled",
    note: "Repaid in full on May 27",
  },
];

export default function ReceivablesPage() {
  const showToast = useStore((state) => state.showToast);
  const queryClient = useQueryClient();

  const [receivables, setReceivables] = useState(INITIAL_RECEIVABLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [repayAmount, setRepayAmount] = useState("");

  // Form state
  const [newContactName, setNewContactName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newNote, setNewNote] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const filtered = receivables.filter(
    (item) =>
      item.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm)
  );

  const totalOutstanding = receivables
    .filter((item) => item.status !== "Settled")
    .reduce((sum, item) => sum + item.remainingAmount, 0);

  const pendingCount = receivables.filter((item) => item.status !== "Settled").length;

  const handleOpenAdd = () => {
    setNewContactName("");
    setNewPhone("");
    setNewAmount("");
    setNewDueDate("");
    setNewNote("");
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleCreateReceivable = (e) => {
    e.preventDefault();

    // Zod validation
    const result = debtSchema.safeParse({
      contactName: newContactName,
      contactPhone: newPhone || undefined,
      originalAmount: newAmount,
      isOwedToYou: true,
      dueDate: newDueDate || undefined,
      description: newNote || undefined,
    });

    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFormErrors({});
    const createdItem = {
      id: Date.now(),
      contactName: result.data.contactName,
      phone: result.data.contactPhone || "Not provided",
      accountNumber: "CBE / telebirr",
      originalAmount: result.data.originalAmount,
      remainingAmount: result.data.originalAmount,
      dueDate: result.data.dueDate || "No due date",
      status: "Pending",
      note: result.data.description || "Peer loan",
    };

    setReceivables([createdItem, ...receivables]);
    showToast(`Recorded ${result.data.originalAmount.toLocaleString()} ETB owed by ${result.data.contactName}`, "success");
    setIsAddModalOpen(false);

    // Sync with backend API
    api.post("/debts", {
      contactName: result.data.contactName,
      contactPhone: result.data.contactPhone,
      originalAmount: result.data.originalAmount,
      isOwedToYou: true,
      dueDate: result.data.dueDate,
      description: result.data.description,
    }).catch(() => {});
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const handleOpenSettle = (item) => {
    setSelectedItem(item);
    setRepayAmount(String(item.remainingAmount));
    setIsSettleModalOpen(true);
  };

  const handleConfirmRepayment = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const amount = parseFloat(repayAmount);
    if (isNaN(amount) || amount <= 0) return;

    setReceivables((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          const newRemaining = Math.max(0, item.remainingAmount - amount);
          return {
            ...item,
            remainingAmount: newRemaining,
            status: newRemaining === 0 ? "Settled" : "Partially Paid",
          };
        }
        return item;
      })
    );

    showToast(`Recorded repayment of ${amount.toLocaleString()} ETB!`, "success");
    setIsSettleModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Money Lent
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-spring" />
          <span>Record Money Lent</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Owed to You
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-gray-900 font-serif">
              {totalOutstanding.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-500">ETB</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              People Who Owe You
            </p>
            <div className="w-8 h-8 rounded-lg bg-spring/20 text-onyx flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-gray-900 font-serif">
              {pendingCount}
            </span>
            <span className="text-xs font-bold text-gray-500">People</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Paid Back to You
            </p>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-emerald-700 font-serif">
              3,500
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
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-onyx focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Receivables List Table */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Person</th>
                <th className="py-3.5 px-6">Phone Number</th>
                <th className="py-3.5 px-6">Payback Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Amount Owed</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((item) => {
                const isSettled = item.status === "Settled";
                const isDueSoon = item.status === "Due Soon";

                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">
                            {item.contactName}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-700">{item.phone || "—"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.dueDate}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          isSettled
                            ? "bg-gray-100 text-gray-600"
                            : isDueSoon
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isSettled ? (
                          <Check className="w-3 h-3" />
                        ) : isDueSoon ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-serif font-bold text-gray-900 text-base">
                      {item.remainingAmount.toLocaleString()} ETB
                    </td>

                    <td className="py-4 px-6 text-center">
                      {!isSettled ? (
                        <button
                          onClick={() => handleOpenSettle(item)}
                          className="px-3 py-1.5 rounded-lg bg-onyx text-white hover:bg-gray-800 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Receivable Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-onyx font-serif">
                  Record Money Lent
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReceivable} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Person's Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dawit Kebede"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                />
                {formErrors.contactName && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.contactName[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0911223344"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                />
                {formErrors.contactPhone && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.contactPhone[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Amount Lent (ETB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 3500"
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
                  Expected Payback Date
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
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shared grocery bill or laptop repair"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Repayment Settlement Modal */}
      {isSettleModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-onyx font-serif">
                Record Payment Received
              </h3>
              <button
                onClick={() => setIsSettleModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRepayment} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500">
                  Person: <strong className="text-gray-900">{selectedItem.contactName}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Remaining Owed: <strong className="text-onyx">{selectedItem.remainingAmount.toLocaleString()} ETB</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Amount Received (ETB)
                </label>
                <input
                  type="number"
                  step="any"
                  max={selectedItem.remainingAmount}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-onyx text-sm font-semibold focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-onyx text-white hover:bg-gray-800 text-xs font-bold shadow-xs transition-all"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}