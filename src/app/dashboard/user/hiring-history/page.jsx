"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/auth-client";
import { ClipboardList, Search, Filter, CreditCard, Loader2 } from "lucide-react";

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  paid: "bg-purple-100 text-purple-700",
};

export default function UserHiringHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [hirings, setHirings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchHirings = async () => {
      try {
        const res = await apiFetch("/api/hirings/my-hirings");
        if (!cancelled && res.success) {
          const mapped = (res.data.hirings || []).map((h) => ({
            _id: h._id,
            lawyerName: h.lawyerName || "Unknown",
            specialization: h.lawyerSpecialization || "N/A",
            fee: h.budget ?? 0,
            date: h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "N/A",
            status: h.status,
          }));
          setHirings(mapped);
        }
      } catch {
        // silently handle
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHirings();
    return () => { cancelled = true; };
  }, []);

  const handlePay = async (hiringId) => {
    setPayingId(hiringId);
    try {
      const res = await apiFetch("/api/payments/create-checkout", {
        method: "POST",
        body: JSON.stringify({ hiringId }),
      });

      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch {
      // silently handle
    } finally {
      setPayingId(null);
    }
  };

  const filtered = hirings.filter((h) => {
    const matchStatus = statusFilter === "all" || h.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      h.lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="bg-white rounded-2xl p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Hiring History</h1>
        <p className="text-gray-500 mt-1">Track all your hiring requests and their status</p>
      </div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by lawyer name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
            />
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            {["all", "pending", "accepted", "paid", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-[#1B2A4A] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lawyer</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Specialization</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No hiring records found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((hire) => (
                  <tr key={hire._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">{hire._id?.slice(-6) || hire._id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1B2A4A]">{hire.lawyerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{hire.specialization}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1B2A4A]">${hire.fee}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{hire.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[hire.status] || "bg-gray-100 text-gray-600"}`}>
                        {hire.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {hire.status === "accepted" && (
                        <button
                          onClick={() => handlePay(hire._id)}
                          disabled={payingId === hire._id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#D4A843] text-[#1B2A4A] hover:bg-[#c49a38] rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {payingId === hire._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CreditCard size={14} />
                          )}
                          {payingId === hire._id ? "Redirecting..." : "Pay Now"}
                        </button>
                      )}
                      {hire.status === "paid" && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-purple-100 text-purple-700 rounded-lg">
                          Paid
                        </span>
                      )}
                      {hire.status !== "accepted" && hire.status !== "paid" && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer Count */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {hirings.length} records</p>
        </div>
      </motion.div>
    </div>
  );
}