"use client";

import { useState, useEffect } from "react";
import { useSession, apiFetch } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";

const ACTIVITY_ICONS = {
  user: "bg-blue-100 text-blue-600",
  hire: "bg-green-100 text-green-600",
  payment: "bg-purple-100 text-purple-600",
  lawyer: "bg-amber-100 text-amber-600",
  admin: "bg-gray-100 text-gray-600",
};

export default function AdminDashboardPage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes] = await Promise.all([
          apiFetch("/api/admin/stats"),
          apiFetch("/api/admin/users"),
        ]);

        if (statsRes.success) {
          setStats(statsRes.data);
        }

        if (usersRes.success) {
          const allUsers = usersRes.data.users || [];
          const sorted = [...allUsers].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentUsers(sorted.slice(0, 5));
        }
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 h-64" />
      </div>
    );
  }

  const STAT_CARDS = [
    { label: "Total Users", value: (stats?.totalUsers ?? 0).toLocaleString(), icon: Users, color: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Total Lawyers", value: stats?.totalLawyers ?? 0, icon: UserCheck, color: "bg-green-50", iconColor: "text-green-600" },
    { label: "Total Hires", value: (stats?.totalHires ?? 0).toLocaleString(), icon: Briefcase, color: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "bg-purple-50", iconColor: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
          <TrendingUp size={16} />
          <span className="text-sm font-semibold">{(stats?.totalUsers ?? 0)} users on platform</span>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className={card.iconColor} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1B2A4A]">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Manage Users", href: "/dashboard/admin/manage-users", desc: "View and manage all platform users", icon: Users, count: stats?.totalUsers ?? 0 },
          { label: "All Transactions", href: "/dashboard/admin/all-transactions", desc: "View transaction history", icon: DollarSign, count: "$" + (stats?.totalRevenue ?? 0).toLocaleString(), sub: (stats?.paidHires ?? 0) + " transactions" },
          { label: "Analytics", href: "/dashboard/admin/analytics", desc: "Detailed platform analytics", icon: Activity, count: (stats?.totalHires ?? 0) + " hires" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-[#D4A843]/30 transition-all group cursor-pointer block"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={22} className="text-[#1B2A4A] group-hover:text-[#D4A843] transition-colors" />
                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#D4A843] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2A4A] group-hover:text-[#D4A843] transition-colors">{item.label}</h3>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              <p className="text-lg font-bold text-[#1B2A4A] mt-2">{item.count}</p>
              {item.sub && <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>}
            </motion.a>
          );
        })}
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1B2A4A] flex items-center gap-2">
            <Activity size={20} />
            Recent Registrations
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentUsers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Activity size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Activity log will appear as users interact with the platform</p>
            </div>
          ) : (
            recentUsers.map((user) => (
              <div key={user._id} className="px-6 py-4 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${ACTIVITY_ICONS[user.role === "lawyer" ? "lawyer" : "user"]}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{user.name}</span> joined
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{getRelativeTime(user.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

function getRelativeTime(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}