"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  Fuel,
  Home,
  ReceiptText,
  ShoppingBag,
  Wifi,
} from "lucide-react";

function RecentExpenseList({ transactions: propTransactions }) {
  const defaultTransactions = [
    {
      id: 1,
      name: "Fresh Corner Supermarket",
      category: "Food & Groceries",
      icon: Coffee,
      date: "Today, 10:45 AM",
      amount: -1250,
      type: "expense",
    },
    {
      id: 2,
      name: "TotalEnergies Fuel Station",
      category: "Transport",
      icon: Fuel,
      date: "Yesterday, 4:20 PM",
      amount: -850,
      type: "expense",
    },
    {
      id: 3,
      name: "Apartment Monthly Rent",
      category: "Housing",
      icon: Home,
      date: "Jun 01, 2026",
      amount: -12000,
      type: "expense",
    },
    {
      id: 4,
      name: "Ethio Telecom Fiber Internet",
      category: "Utilities",
      icon: Wifi,
      date: "May 28, 2026",
      amount: -950,
      type: "expense",
    },
    {
      id: 5,
      name: "Repayment from Dawit K.",
      category: "Receivable Paid",
      icon: ArrowDownLeft,
      date: "May 27, 2026",
      amount: 3500,
      type: "income",
    },
  ];

  const transactions = propTransactions && propTransactions.length > 0 ? propTransactions : defaultTransactions;

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-serif">
            Recent Transactions
          </h2>
        </div>
        <Link
          href="/dashboard/expense"
          className="text-xs font-bold text-onyx hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-100">
        {transactions.map((item) => {
          const isExpense = item.amount < 0;
          const Icon = item.icon || (isExpense ? ReceiptText : ArrowDownLeft);

          return (
            <div
              key={item.id}
              className="py-3.5 flex items-center justify-between hover:bg-gray-50/80 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isExpense ? "bg-gray-100 text-gray-700" : "bg-spring/30 text-onyx"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-gray-400">
                      {item.date}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold font-serif ${
                    isExpense ? "text-gray-900" : "text-emerald-600"
                  }`}
                >
                  {isExpense ? "-" : "+"}
                  {Math.abs(Number(item.amount || 0)).toLocaleString()} ETB
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentExpenseList;
