"use client";

import { useState, useEffect } from "react";
import { useSession, apiFetch } from "@/lib/auth-client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  Star,
  ArrowRight,
} from "lucide-react";

export default function LawyerDashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [statCards, setStatCards] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          apiFetch("/api/lawyers/profile"),
          apiFetch("/api/hirings/lawyer-requests"),
        ]);

        if (!cancelled) {
          if (profileRes.success) {
            setProfile(profileRes.data);
          }

          if (requestsRes.success) {
            const reqs = requestsRes.data.hirings || [];
            setRequests(reqs);

            const total = reqs.length;
            const pending = reqs.filter((r) => r.status === "pending").length;
            const completed = reqs.filter((r) => r.status === "completed" || r.status === "paid").length;
            const revenue = reqs
              .filter((r) => r.status === "paid")
              .reduce((sum, r) => sum + (r.budget || 0), 0);

            setStatCards([
              { label: "Total Hires", value: total, icon: ClipboardList, color: "bg-[#1B2A4A]", iconColor: "text-white" },
              { label: "Pending Requests", value: pending, icon: Clock, color: "bg-amber-50", iconColor: "text-amber-600" },
              { label: "Completed", value: completed, icon: CheckCircle2, color: "bg-green-50", iconColor: "text-green-600" },
              { label: "Total Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: "bg-blue-50", iconColor: "text-blue-600" },
            ]);
          }
        }
      } catch (err) {
        
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

  if (loading || isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-8 flex gap-6">
          <div className="h-28 w-28 bg-gray-200 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-48 bg-gray-200 rounded" />
            <div className="h-5 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const recentRequests = requests.slice(0, 3).map((r) => ({
    _id: r._id,
    clientName: r.clientName || "Client",
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A",
    status: r.status,
    fee: r.budget ?? 0,
  }));

  const statusBadge = (status) => {
    const map = {
      pending: "bg-amber-100 text-amber-700",
      accepted: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      paid: "bg-purple-100 text-purple-700",
      rejected: "bg-red-100 text-red-600",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  const specialization = profile?.specialization || "Attorney";
  const rating = profile?.rating ?? 0;
  const totalReviews = profile?.totalReviews ?? 0;
  const isAvailable = profile?.isAvailable ?? true;

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
          Welcome, {user?.name?.split(" ")[0] || "Lawyer"}
        </h1>
        <p className="text-gray-500 mt-1">Manage your legal services and client requests</p>
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-28 h-28 rounded-2xl bg-[#1B2A4A]/5 flex items-center justify-center text-[#1B2A4A] text-3xl font-bold shrink-0 border-4 border-white shadow-md overflow-hidden">
            {(profile?.image || user?.image) ? (
              <img src={profile?.image || user?.image} alt={profile?.name || user?.name} className="w-full h-full object-cover" />
            ) : (
              <span>{(profile?.name || user?.name)?.charAt(0)?.toUpperCase() || "L"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-[#1B2A4A]">{profile?.name || user?.name || "Lawyer Name"}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <p className="text-[#D4A843] font-semibold mb-2">{specialization}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Mail size={14} />
                {user?.email || "lawyer@example.com"}
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {rating} ({totalReviews} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {user?.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "Joined recently"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {}
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

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1B2A4A]">Recent Hiring Requests</h3>
          <Link
            href="/dashboard/lawyer/hiring-history"
            className="text-sm text-[#D4A843] font-medium hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-sm">No recent requests</td>
                </tr>
              ) : (
                recentRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#1B2A4A]">{req.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{req.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1B2A4A]">${req.fee}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(req.status)}`}>
                        {req.status}
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