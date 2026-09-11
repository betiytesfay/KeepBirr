"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Plus, Search, User as UserIcon } from "lucide-react";
import useStore from "../../../store/useStore.js";
import { useRouter } from "next/navigation";

function DashboardHeader() {
  const router = useRouter();
  const openAddExpense = useStore((state) => state.openAddExpense);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const storeUser = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);

  // Sync user from localStorage if not in store
  React.useEffect(() => {
    if (!storeUser && typeof window !== "undefined") {
      const savedUser = localStorage.getItem("keepbirr_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }
  }, [storeUser, setUser]);

  const displayName = storeUser?.name ? storeUser.name.split(" ")[0] : "Beti";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Search Bar / Page Indicator */}
      <div className="flex items-center gap-3 w-64 sm:w-80">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses, budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-onyx focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={openAddExpense}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-spring text-onyx font-bold text-xs sm:text-sm border border-spring shadow-xs hover:bg-onyx hover:text-spring hover:border-onyx transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-spring/20 border border-spring/50 flex items-center justify-center text-onyx font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-gray-700">
              {displayName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;