"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  UserCog,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
  X,
  Heart,
} from "lucide-react";

const SIDEBAR_LINKS = {
  user: [
    { label: "My Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
    { label: "Hiring History", href: "/dashboard/user/hiring-history", icon: ClipboardList },
    { label: "My Shortlist", href: "/dashboard/user/shortlist", icon: Heart },
    { label: "My Comments", href: "/dashboard/user/comments", icon: MessageSquare },
    { label: "Update Profile", href: "/dashboard/user/update-profile", icon: UserCog },
  ],
  lawyer: [
    { label: "My Dashboard", href: "/dashboard/lawyer", icon: LayoutDashboard },
    { label: "Hiring History", href: "/dashboard/lawyer/hiring-history", icon: ClipboardList },
    { label: "Manage Profile", href: "/dashboard/lawyer/manage-legal-profile", icon: UserCog },
  ],
  admin: [
    { label: "Admin Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
    { label: "All Transactions", href: "/dashboard/admin/all-transactions", icon: CreditCard },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  ],
};

export default function DashboardSidebar({ role = "user", isOpen, onClose }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const links = SIDEBAR_LINKS[role] || SIDEBAR_LINKS.user;

  const handleSignOut = async () => {
    await signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Legal<span className="text-[#D4A843]">Ease</span>
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center text-[#D4A843] font-bold text-sm overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-white/50 capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#D4A843]/15 text-[#D4A843]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:top-16 lg:w-64 bg-[#1B2A4A] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 top-16 w-72 bg-[#1B2A4A] z-50 rounded-tr-xl"
            >
              {/* Mobile Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}