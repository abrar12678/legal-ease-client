"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, apiFetch } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  Edit3,
  ArrowRight,
} from "lucide-react";

export default function UserDashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [allHirings, setAllHirings] = useState([]);
  const [recentHires, setRecentHires] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const res = await apiFetch("/api/hirings/my-hirings?limit=100");
        if (!cancelled && res.success) {
          const hirings = res.data.hirings || [];
          setAllHirings(hirings);
          setRecentHires(hirings.slice(0, 3).map((h) => ({
            _id: h._id,
            lawyerName: h.lawyerName || "Unknown",
            specialization: h.lawyerSpecialization || "N/A",
            fee: h.budget ?? 0,
            date: h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "N/A",
            status: h.status,
          })));
        }
      } catch (err) {
        if (!cancelled) {
          // silently fail — new users have no data yet
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (!isPending) {
      fetchData();
    } else {
      setLoading(false);
    }
    return () => { cancelled = true; };
  }, [isPending]);

  // Compute stats from hirings
  const totalHires = allHirings.length;
  const pendingCount = allHirings.filter((h) => h.status === "pending").length;
  const completedCount = allHirings.filter((h) => h.status === "completed" || h.status === "paid").length;
  const totalSpent = allHirings
    .filter((h) => h.status === "paid")
    .reduce((sum, h) => sum + (h.budget || 0), 0);

  const statCards = [
    { label: "Total Hires", value: totalHires, icon: ClipboardList, color: "bg-[#1B2A4A]", iconColor: "text-white" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "bg-green-50", iconColor: "text-green-600" },
    { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "bg-blue-50", iconColor: "text-blue-600" },
  ];

  if (loading || isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const statusBadge = (status) => {
    const map = {
      pending: "bg-amber-100 text-amber-700",
      accepted: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-600",
      paid: "bg-purple-100 text-purple-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-gray-500 mt-1">Manage your hiring activity and profile</p>
        </div>
        <Link
          href="/dashboard/user/update-profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B2A4A] hover:bg-[#243A5E] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Edit3 size={16} />
          Update Profile
        </Link>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#1B2A4A]/5 flex items-center justify-center text-[#1B2A4A] text-2xl font-bold shrink-0 overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#1B2A4A]">{user?.name || "User Name"}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Mail size={14} />
                {user?.email || "user@example.com"}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} />
                <span className="capitalize">{user?.role || "user"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {user?.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "Joined recently"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={20} className={card.iconColor} />
              </div>
              <p className="text-2xl font-bold text-[#1B2A4A]">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Hiring Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1B2A4A]">Recent Hires</h3>
          <Link
            href="/dashboard/user/hiring-history"
            className="text-sm text-[#D4A843] font-medium hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lawyer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Specialization</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentHires.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">No recent hires</td>
                </tr>
              ) : (
                recentHires.map((hire) => (
                  <tr key={hire._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#1B2A4A]">{hire.lawyerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{hire.specialization}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1B2A4A]">${hire.fee}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{hire.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(hire.status)}`}>
                        {hire.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}