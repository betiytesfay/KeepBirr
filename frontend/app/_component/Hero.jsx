"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PiggyBank, ReceiptText, Wallet } from "lucide-react";

function Hero() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">

        {/* Main Title */}
        <h1 className="text-5xl sm:text-5xl font-bold tracking-tight text-gray-900 max-w-3xl leading-tight">
          <span className="block">
            Manage Your <span className="text-onyx underline decoration-spring decoration-2 underline-offset-6">Expenses</span> & Build
          </span>
          <span className="block mt-1 sm:mt-2">
            Lasting Savings
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
          Take total control of your money. Plan monthly budgets, record daily expenses, and keep track of debts and receivables effortlessly.
        </p>

        {/* Call to Actions with Spring and Onyx */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-spring text-onyx text-base font-bold border border-spring shadow-md hover:bg-onyx hover:text-spring hover:border-onyx transition-all duration-200"
          >
            <span>Start Tracking Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-onyx text-onyx text-base font-semibold hover:bg-spring/20 transition-all duration-200"
          >
            <span>View Live Demo</span>
          </Link>
        </div>

        {/* Highlights List */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-onyx" />
            <span>100% Free to Use</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-onyx" />
            <span>Real-time Expense Feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-onyx" />
            <span>Multi-Account & Debt Tracking</span>
          </div>
        </div>

        {/* Dashboard Preview Frame */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl border border-gray-200 bg-gray-50/50 p-2 sm:p-3 shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-t-xl border-b border-gray-200 mb-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-300" />
              <div className="w-3 h-3 rounded-full bg-spring border border-spring" />
            </div>
            <span className="text-xs text-gray-500 font-mono ml-2">keepbirr.com/dashboard</span>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx">
            Everything You Need to Master Your Money
          </h2>
          <p className="mt-3 text-gray-600">
            Smart, intuitive tools designed to give you clarity and confidence in every financial decision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl border border-gray-200 bg-white hover:border-spring hover:shadow-lg transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-spring/25 flex items-center justify-center text-onyx mb-5 border border-spring/50">
              <PiggyBank className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-onyx mb-2">Smart Budgeting</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Set monthly spending targets for categories like food, bills, and entertainment to prevent overspending before it happens.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl border border-gray-200 bg-white hover:border-spring hover:shadow-lg transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-spring/25 flex items-center justify-center text-onyx mb-5 border border-spring/50">
              <ReceiptText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-onyx mb-2">Expense Logging</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Record daily expenses in seconds with categorized tags and clean visual transaction histories.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl border border-gray-200 bg-white hover:border-spring hover:shadow-lg transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-spring/25 flex items-center justify-center text-onyx mb-5 border border-spring/50">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-onyx mb-2">Debts & Receivables</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Keep precise track of loans you need to repay and money owed to you so nothing slips through the cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Clean Footer */}
      <footer className="py-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} KeepBirr. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Hero;