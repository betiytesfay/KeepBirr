"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Menu, Plus, Search, User as UserIcon } from "lucide-react";
import useStore from "../../../store/useStore.js";
import { useRouter } from "next/navigation";

function DashboardHeader({ onToggleMobileNav }) {
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-2xs w-full max-w-full min-w-0">
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-md">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-onyx hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-onyx focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          type="button"
          onClick={openAddExpense}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-spring text-onyx font-bold text-xs sm:text-sm border border-spring shadow-xs hover:bg-onyx hover:text-spring hover:border-onyx transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">Add Expense</span>
          <span className="xs:hidden">Add</span>
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-spring/20 border border-spring/50 flex items-center justify-center text-onyx font-bold text-xs shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-gray-700 truncate max-w-[100px]">
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