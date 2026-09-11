"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PiggyBank, ReceiptText, Sparkles, Wallet } from "lucide-react";

function Hero() {
  return (
    <div className="bg-white text-gray-900 w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">

        {/* Small Top Pill Badge - adds breathing space and modern polish */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spring/25 border border-spring/50 text-onyx text-[11px] sm:text-xs font-bold mb-5 sm:mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-onyx" />
          <span>Simple Financial Tracking</span>
        </div>

        {/* Main Title - Responsive sizing with generous top space */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-3xl leading-[1.25] sm:leading-tight">
          <span>Manage Your </span>
          <span className="text-onyx underline decoration-spring decoration-2 underline-offset-4 sm:underline-offset-6">
            Expenses
          </span>
          <span> & Build Lasting Savings</span>
        </h1>

        {/* Subtitle - Shortened, punchy copy with good vertical space */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-500 max-w-md leading-relaxed px-2">
          Plan budgets, track daily expenses, and manage debts with ease.
        </p>

        {/* Call to Actions */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-3.5 rounded-xl bg-spring text-onyx text-sm sm:text-base font-bold border border-spring shadow-md hover:bg-onyx hover:text-spring hover:border-onyx transition-all duration-200"
          >
            <span>Start Tracking Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:px-6 sm:py-3.5 rounded-xl border-2 border-onyx text-onyx text-sm sm:text-base font-semibold hover:bg-spring/20 transition-all duration-200"
          >
            <span>View Live Demo</span>
          </Link>
        </div>

        {/* Highlights List */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-onyx shrink-0" />
            <span>100% Free to Use</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-onyx shrink-0" />
            <span>Real-time Expense Feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-onyx shrink-0" />
            <span>Multi-Account & Debt Tracking</span>
          </div>
        </div>

        {/* Dashboard Preview Frame - Generous white space above */}
        <div className="mt-20 sm:mt-28 lg:mt-32 w-full max-w-5xl rounded-2xl border border-gray-200 bg-gray-50/50 p-1.5 sm:p-3 shadow-xl sm:shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-t-xl border-b border-gray-200 mb-1.5 sm:mb-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-300" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-spring border border-spring" />
            </div>
            <span className="text-[11px] sm:text-xs text-gray-500 font-mono ml-2">keepbirr.com/dashboard</span>
          </div>
          <Image
            src="/dashboard.png"
            alt="KeepBirr Financial Dashboard Preview"
            width={1100}
            height={700}
            priority
            className="rounded-lg w-full object-cover border border-gray-100 shadow-inner"
          />
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-onyx">
            Everything You Need to Master Your Money
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-600">
            Smart, intuitive tools designed to give you clarity and confidence in every financial decision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {/* Card 1 */}
          <div className="p-5 sm:p-7 rounded-2xl border border-gray-200 bg-white hover:border-spring hover:shadow-lg transition-all duration-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-spring/25 flex items-center justify-center text-onyx mb-4 sm:mb-5 border border-spring/50">
              <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-onyx mb-2">Smart Budgeting</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Set monthly spending targets for categories like food, bills, and entertainment to prevent overspending before it happens.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 sm:p-7 rounded-2xl border border-gray-200 bg-white hover:border-spring hover:shadow-lg transition-all duration-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-spring/25 flex items-center justify-center text-onyx mb-4 sm:mb-5 border border-spring/50">
              <ReceiptText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-onyx mb-2">Expense Logging</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Record daily expenses in seconds with categorized tags and clean visual transaction histories.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 sm:p-7 rounded-2xl border border-gray-200 bg-white hover:border-spring hover:shadow-lg transition-all duration-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-spring/25 flex items-center justify-center text-onyx mb-4 sm:mb-5 border border-spring/50">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-onyx mb-2">Debts & Receivables</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Keep precise track of loans you need to repay and money owed to you so nothing slips through the cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Clean Footer */}
      <footer className="py-6 sm:py-8 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} KeepBirr. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Hero;