"use client";

import React from "react";
import Link from "next/link";
import { ArrowDownLeft, Calendar, CreditCard, User, HandCoins } from "lucide-react";

function DebtSummaryCard({ debts: propDebts }) {
  const debtItems = Array.isArray(propDebts) ? propDebts : [];

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-serif">
            Money Lent & Owed
          </h2>
        </div>
        <Link
          href="/dashboard/debt"
          className="text-xs font-bold text-onyx hover:underline"
        >
          Manage
        </Link>
      </div>

      {debtItems.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <HandCoins className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-semibold text-gray-600">No active debts or loans</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Track money you lend to friends or loans you need to pay back.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {debtItems.map((item) => {
            const isReceivable = item.type === "receivable";

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isReceivable
                        ? "bg-emerald-100/80 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isReceivable ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {item.contact}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{item.dueDate || "No due date"}</span>
                      <span>•</span>
                      <span className={isReceivable ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
                        {isReceivable ? "Owed to You" : "You Owe"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold font-serif text-gray-900">
                    {Number(item.amount || 0).toLocaleString()} ETB
                  </p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                      item.status === "Due Soon"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.status || "Pending"}
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

export default DebtSummaryCard;
