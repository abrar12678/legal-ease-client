"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { ClipboardList, Check, X as XIcon, Search, Clock } from "lucide-react";

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  paid: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function LawyerHiringHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await apiFetch("/api/hirings/lawyer-requests");
      if (res.success) {
        const mapped = (res.data.hirings || []).map((r) => ({
          _id: r._id,
          clientName: r.clientName || "Client",
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A",
          status: r.status,
          fee: r.budget ?? 0,
        }));
        setRequests(mapped);
      }
    } catch (err) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await apiFetch(`/api/hirings/${id}/${action}`, {
        method: "PATCH",
      });
      if (res.success) {
        toast.success(action === "accept" ? "Request accepted successfully" : "Request rejected");
        await fetchRequests();
      } else {
        toast.error(res.message || `Failed to ${action} request`);
      }
    } catch (err) {
      toast.error(`Failed to ${action} request`);
    }
  };

  const filtered = requests.filter(
    (r) =>
      !searchQuery ||
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Hiring Requests</h1>
          <p className="text-gray-500 mt-1">Manage incoming client hiring requests</p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 text-sm font-semibold rounded-xl border border-amber-200">
            <Clock size={16} className="animate-pulse" />
            {pendingCount} Pending
          </span>
        )}
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
          />
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
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No requests found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">{req._id?.slice(-6) || req._id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1B2A4A]">{req.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{req.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1B2A4A]">${req.fee}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[req.status]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {req.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction(req._id, "accept")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() => handleAction(req._id, "reject")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <XIcon size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {requests.length} requests</p>
        </div>
      </motion.div>
    </div>
  );
}