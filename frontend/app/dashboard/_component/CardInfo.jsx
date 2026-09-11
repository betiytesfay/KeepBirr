"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight, CreditCard, PiggyBank, ReceiptText, TrendingUp } from "lucide-react";

function CardInfo({
  budgetTotal = 0,
  expenseTotal = 0,
  receivablesTotal = 0,
  debtTotal = 0,
}) {
  const bTotal = Number(budgetTotal || 0);
  const eTotal = Number(expenseTotal || 0);
  const rTotal = Number(receivablesTotal || 0);
  const dTotal = Number(debtTotal || 0);

  const percentSpent = bTotal > 0 ? Math.round((eTotal / bTotal) * 100) : 0;

  const cardData = [
    {
      title: "Total Budget",
      amount: bTotal.toLocaleString(),
      unit: "ETB",
      icon: PiggyBank,
      accentBg: "bg-spring/25",
      accentText: "text-onyx",
      progress: percentSpent,
      progressBarColor: "bg-spring",
    },
    {
      title: "Total Spent",
      amount: eTotal.toLocaleString(),
      unit: "ETB",
      icon: ReceiptText,
      accentBg: "bg-rose-50",
      accentText: "text-rose-600",
      progress: null,
    },
    {
      title: "Money Owed to You",
      amount: rTotal.toLocaleString(),
      unit: "ETB",
      icon: ArrowDownLeft,
      accentBg: "bg-emerald-50",
      accentText: "text-emerald-700",
      progress: null,
    },
    {
      title: "Money You Owe",
      amount: dTotal.toLocaleString(),
      unit: "ETB",
      icon: CreditCard,
      accentBg: "bg-amber-50",
      accentText: "text-amber-700",
      progress: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
                    {card.amount}
                  </span>
                  <span className="text-xs font-bold text-gray-500">{card.unit}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.accentBg} flex items-center justify-center ${card.accentText} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {card.progress !== null && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${card.progressBarColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(card.progress, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CardInfo;
