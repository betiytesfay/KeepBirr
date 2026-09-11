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
  const transactions = Array.isArray(propTransactions) ? propTransactions : [];

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

      {transactions.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <ReceiptText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-semibold text-gray-600">No recent transactions</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Your recorded expenses and repayments will appear here.
          </p>
        </div>
      ) : (
        /* Transaction List */
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
      )}
    </div>
  );
}

export default RecentExpenseList;
