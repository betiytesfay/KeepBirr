import React from "react";
import SideNav from "./_component/SideNav.jsx";
import DashboardHeader from "./_component/DashboardHeader.jsx";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Fixed Left Sidebar */}
      <aside className="fixed top-0 left-0 md:w-64 hidden md:block h-screen bg-white z-40 border-r border-gray-200">
        <SideNav />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col bg-white">
        <DashboardHeader />
        <main className="flex-1 p-6 sm:p-8 bg-gray-50/50 min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;