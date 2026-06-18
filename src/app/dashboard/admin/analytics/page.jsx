"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const SPEC_COLORS = [
  "bg-[#1B2A4A]",
  "bg-[#2D4A7A]",
  "bg-[#3D5A8A]",
  "bg-[#4D6A9A]",
  "bg-[#D4A843]",
  "bg-[#c49a38]",
  "bg-[#1B2A4A]/70",
  "bg-[#2D4A7A]/70",
];

function SimpleBarChart({ data, maxVal, color = "bg-[#1B2A4A]" }) {
  const max = maxVal || Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-gray-500 font-medium">
            {item.value >= 1000 ? `${(item.value / 1000).toFixed(0)}K` : item.value}
          </span>
          <div
            className={`w-full rounded-t-lg ${color} transition-all duration-500`}
            style={{ height: `${(item.value / max) * 100}%`, minHeight: "4px" }}
          />
          <span className="text-[10px] text-gray-400">{item.month}</span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBar({ label, value, maxValue, color }) {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
        <div
          className={`h-full ${color} rounded-lg transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-[#1B2A4A] w-12 text-right">{value}</span>
    </div>
  );
}

function computeGrowth(data) {
  if (!data || data.length < 2) return null;
  const last = data[data.length - 1].value;
  const prev = data[data.length - 2].value;
  if (prev === 0) return last > 0 ? "Live" : null;
  const pct = ((last - prev) / prev) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%";
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          apiFetch("/api/admin/stats"),
          apiFetch("/api/admin/analytics"),
        ]);

        if (statsRes.success) {
          setStats(statsRes.data);
        } else {
          toast.error("Failed to load stats");
        }

        if (analyticsRes.success) {
          setAnalytics(analyticsRes.data);
        } else {
          toast.error("Failed to load analytics");
        }
      } catch (err) {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 h-64" />
          <div className="bg-white rounded-2xl p-6 h-64" />
        </div>
      </div>
    );
  }

  const mainCards = [
    { label: "Total Users", value: (stats?.totalUsers ?? 0).toLocaleString(), icon: Users, color: "bg-blue-50", iconColor: "text-blue-600", change: computeGrowth(analytics?.monthlyUsers) || "Live" },
    { label: "Total Lawyers", value: stats?.totalLawyers ?? 0, icon: UserCheck, color: "bg-green-50", iconColor: "text-green-600", change: "Live" },
    { label: "Total Hires", value: (stats?.totalHires ?? 0).toLocaleString(), icon: Briefcase, color: "bg-amber-50", iconColor: "text-amber-600", change: computeGrowth(analytics?.monthlyHires) || "Live" },
    { label: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "bg-purple-50", iconColor: "text-purple-600", change: computeGrowth(analytics?.monthlyRevenue) || "Live" },
  ];

  const topSpecs = (analytics?.topSpecializations || []).map((spec, i) => ({
    ...spec,
    color: SPEC_COLORS[i % SPEC_COLORS.length],
  }));

  const maxSpecCount = topSpecs.length > 0 ? Math.max(...topSpecs.map((s) => s.count)) : 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed platform performance metrics and insights</p>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((card, i) => {
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
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#1B2A4A]">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Users Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-[#1B2A4A]" />
            <h3 className="text-lg font-bold text-[#1B2A4A]">New Users (Last 6 Months)</h3>
          </div>
          <SimpleBarChart data={analytics?.monthlyUsers || []} color="bg-[#1B2A4A]" />
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <DollarSign size={20} className="text-[#D4A843]" />
            <h3 className="text-lg font-bold text-[#1B2A4A]">Revenue (Last 6 Months)</h3>
          </div>
          <SimpleBarChart
            data={analytics?.monthlyRevenue || []}
            color="bg-[#D4A843]"
          />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hires Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Briefcase size={20} className="text-green-600" />
            <h3 className="text-lg font-bold text-[#1B2A4A]">Monthly Hires (Last 6 Months)</h3>
          </div>
          <SimpleBarChart data={analytics?.monthlyHires || []} color="bg-green-500" />
        </motion.div>

        {/* Top Specializations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-[#1B2A4A]" />
            <h3 className="text-lg font-bold text-[#1B2A4A]">Top Specializations</h3>
          </div>
          <div className="space-y-3">
            {topSpecs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No specialization data available</p>
            ) : (
              topSpecs.map((spec) => (
                <HorizontalBar
                  key={spec.name}
                  label={spec.name}
                  value={spec.count}
                  maxValue={maxSpecCount}
                  color={spec.color}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}