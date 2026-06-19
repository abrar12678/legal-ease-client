"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = pathname.includes("/admin")
    ? "admin"
    : pathname.includes("/lawyer")
    ? "lawyer"
    : "client";

  return (
    <div className="min-h-screen bg-gray-50/70">
      {/* Mobile sidebar toggle - below fixed Navbar (h-16) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md border border-gray-200 text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-50 transition-colors"
      >
        <Menu size={20} />
      </button>

      <DashboardSidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-64 min-h-screen pt-4 lg:pt-4">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}