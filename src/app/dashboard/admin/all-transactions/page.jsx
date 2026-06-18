"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { CreditCard, Search, DollarSign } from "lucide-react";

const STATUS_BADGE = {
  completed: "bg-green-100 text-green-700",
  refunded: "bg-red-100 text-red-600",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-gray-100 text-gray-600",
};

export default function AllTransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTransactions = async (status = "all") => {
    try {
      const query = status !== "all" ? `?status=${status}` : "";
      const res = await apiFetch(`/api/admin/transactions${query}`);
      if (res.success) {
        setTransactions(res.data.transactions || []);
        setTotalAmount(res.data.totalAmount || 0);
      }
    } catch (err) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(statusFilter);
  }, [statusFilter]);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      !searchQuery ||
      (t.transactionId && t.transactionId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.clientEmail && t.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.lawyerEmail && t.lawyerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  const filteredTotal = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="bg-white rounded-2xl p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">All Transactions</h1>
          <p className="text-gray-500 mt-1">View and track all platform payment transactions</p>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 bg-green-50 rounded-xl border border-green-200">
          <DollarSign size={18} className="text-green-600" />
          <div className="text-right">
            <p className="text-xs text-green-600">Total Revenue</p>
            <p className="text-xl font-bold text-green-700">${(totalAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "completed", "pending", "failed"].map((s) => (
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Lawyer Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <CreditCard size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No transactions found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((txn) => (
                  <tr key={txn.transactionId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[#D4A843] font-semibold">
                      {txn.transactionId ? txn.transactionId.substring(0, 12) + "..." : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{txn.clientEmail || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{txn.lawyerEmail || "N/A"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1B2A4A]">${(txn.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[txn.status] || "bg-gray-100 text-gray-700"}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {transactions.length} transactions &middot; Filtered Total: ${filteredTotal.toLocaleString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}