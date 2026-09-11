"use client";

import React, { useState } from "react";
import SideNav from "./_component/SideNav.jsx";
import DashboardHeader from "./_component/DashboardHeader.jsx";

function DashboardLayout({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex w-full max-w-full overflow-x-hidden">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="fixed top-0 left-0 md:w-64 hidden md:block h-screen bg-white z-40 border-r border-gray-200">
        <SideNav />
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-72 max-w-[80vw] h-full bg-white z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <SideNav onClose={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 md:ml-64 min-h-screen flex flex-col bg-white w-full max-w-full overflow-x-hidden">
        <DashboardHeader onToggleMobileNav={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-[calc(100vh-65px)] w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;