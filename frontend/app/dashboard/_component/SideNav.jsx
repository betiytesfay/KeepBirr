"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownLeft,
  CreditCard,
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  X,
} from "lucide-react";

function SideNav({ onClose }) {
  const pathname = usePathname();

  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Budget",
      icon: PiggyBank,
      path: "/dashboard/budget",
    },
    {
      id: 3,
      name: "Expense",
      icon: ReceiptText,
      path: "/dashboard/expense",
    },
    {
      id: 4,
      name: "Money Lent",
      icon: ArrowDownLeft,
      path: "/dashboard/receivables",
    },
    {
      id: 5,
      name: "Money I Owe",
      icon: CreditCard,
      path: "/dashboard/debt",
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white border-r border-gray-200 shadow-2xs">
      <div>
        {/* Brand Logo & Close button on mobile */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <Image src="/logo.svg" alt="KeepBirr Logo" width={34} height={34} priority />
            <div className="flex items-baseline">
              <span className="font-extrabold text-xl text-onyx tracking-tight">Keep</span>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">Birr</span>
              <span className="w-2 h-2 rounded-full bg-spring ml-1" />
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Navigation Items */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Menu
          </p>
          {menuList.map((menu) => {
            const isActive = pathname === menu.path;
            const Icon = menu.icon;
            return (
              <Link
                key={menu.id}
                href={menu.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-spring/20 text-onyx font-bold border border-spring/50 shadow-2xs"
                    : "text-gray-600 hover:text-onyx hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-onyx" : "text-gray-400"}`} />
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default SideNav;