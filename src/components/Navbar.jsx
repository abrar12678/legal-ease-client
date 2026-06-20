"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Moon,
  Sun,
  Heart,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Lawyers", href: "/browse-lawyers" },
];

const DASHBOARD_LINKS = {
  user: [
    { label: "My Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
    { label: "My Shortlist", href: "/dashboard/user/shortlist", icon: Heart },
    { label: "Hiring History", href: "/dashboard/user/hiring-history", icon: User },
    { label: "My Comments", href: "/dashboard/user/comments", icon: User },
    { label: "Update Profile", href: "/dashboard/user/update-profile", icon: User },
  ],
  lawyer: [
    { label: "My Dashboard", href: "/dashboard/lawyer", icon: LayoutDashboard },
    { label: "Hiring History", href: "/dashboard/lawyer/hiring-history", icon: User },
    { label: "Manage Profile", href: "/dashboard/lawyer/manage-legal-profile", icon: User },
  ],
  admin: [
    { label: "Admin Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: User },
    { label: "All Transactions", href: "/dashboard/admin/all-transactions", icon: User },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: LayoutDashboard },
  ],
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const user = session?.user;

  useEffect(() => {
    // Initialize dark mode from localStorage
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse-lawyers?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ fetchOptions: { onSuccess: () => { router.push("/"); router.refresh(); } } });
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const dashboardItems = user?.role
    ? DASHBOARD_LINKS[user.role] || DASHBOARD_LINKS.user
    : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "dark:bg-slate-800/95 bg-white/95 backdrop-blur-md shadow-md"
          : "dark:bg-slate-800 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#1B2A4A] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1B2A4A] dark:text-white tracking-tight">
              Legal<span className="text-[#D4A843]">Ease</span>
            </span>
          </Link>

          {/* Desktop Nav Links + Search + Auth */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[#1B2A4A]/10 text-[#1B2A4A]"
                    : "text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dashboard Dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith("/dashboard")
                      ? "bg-[#1B2A4A]/10 text-[#1B2A4A]"
                      : "text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {dashboardItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1B2A4A] transition-colors"
                        >
                          <item.icon size={16} />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Desktop: Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 transition-all"
              />
            </form>
          </div>

          {/* Desktop: Auth Buttons + Dark Mode */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {user.name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signIn"
                  className="px-4 py-2 text-sm font-medium text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signUp"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] hover:bg-[#243A5E] rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#1B2A4A] transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden dark:bg-slate-800 bg-white border-t border-gray-100 dark:border-slate-700"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20"
                />
              </form>

              {/* Mobile Nav Links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#1B2A4A]/10 text-[#1B2A4A]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Dashboard Links */}
              {user && (
                <>
                  <div className="border-t border-gray-100 pt-2">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Dashboard
                    </p>
                    {dashboardItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1B2A4A] transition-colors"
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2.5 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}

                  <div className="border-t border-gray-100 dark:border-slate-700 pt-3 space-y-2">
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center gap-2 px-3 py-2.5 w-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                      {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                  </div>
                  {!user && (
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <Link
                    href="/auth/signIn"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-4 py-2.5 text-sm font-medium text-[#1B2A4A] border border-[#1B2A4A] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signUp"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-4 py-2.5 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#243A5E] transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}