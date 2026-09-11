"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.svg" alt="KeepBirr Logo" width={36} height={36} priority />
          <div className="flex items-baseline">
            <span className="font-extrabold text-2xl text-onyx tracking-tight">Keep</span>
            <span className="font-extrabold text-2xl text-gray-900 group-hover:text-onyx tracking-tight">Birr</span>
            <span className="w-2.5 h-2.5 rounded-full bg-spring ml-1 inline-block" />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/dashboard" className="hover:text-onyx transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/budget" className="hover:text-onyx transition-colors">
            Budgets
          </Link>
          <Link href="/dashboard/expense" className="hover:text-onyx transition-colors">
            Expenses
          </Link>
          <Link href="/dashboard/debt" className="hover:text-onyx transition-colors">
            Debts & Loans
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-onyx transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2 text-sm font-bold rounded-lg bg-spring text-onyx border border-spring shadow-sm hover:bg-onyx hover:text-spring hover:border-onyx transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;