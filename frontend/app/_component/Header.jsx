"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xs w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image src="/logo.svg" alt="KeepBirr Logo" width={30} height={30} className="sm:w-8 sm:h-8" priority />
          <div className="flex items-baseline">
            <span className="font-extrabold text-lg sm:text-2xl text-onyx tracking-tight">Keep</span>
            <span className="font-extrabold text-lg sm:text-2xl text-gray-900 group-hover:text-onyx tracking-tight">Birr</span>
            <span className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-spring ml-0.5 sm:ml-1 inline-block" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-gray-700">
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

        {/* Action Buttons: Cleanly aligned on mobile & desktop */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/login"
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-onyx hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl bg-spring text-onyx border border-spring shadow-2xs hover:bg-onyx hover:text-spring hover:border-onyx transition-all duration-200 whitespace-nowrap text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;