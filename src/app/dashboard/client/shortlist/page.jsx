"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  Heart,
  Trash2,
  Star,
  MapPin,
  Clock,
  Loader2,
  User,
} from "lucide-react";

export default function ShortlistPage() {
  const [loading, setLoading] = useState(true);
  const [shortlist, setShortlist] = useState([]);

  const fetchShortlist = async () => {
    try {
      const res = await apiFetch("/api/shortlist");
      if (res.success) {
        setShortlist(res.data.shortlist || []);
      }
    } catch {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemove = async (lawyerId, lawyerName) => {
    try {
      const res = await apiFetch(`/api/shortlist/${lawyerId}`, {
        method: "DELETE",
      });
      if (res.success) {
        toast.info(`${lawyerName} removed from shortlist`);
        setShortlist((prev) => prev.filter((s) => s.lawyerId !== lawyerId));
      } else {
        toast.error(res.message || "Failed to remove");
      }
    } catch {
      toast.error("Failed to remove from shortlist");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
          My Shortlist
        </h1>
        <p className="text-gray-500 mt-1">
          Lawyers you have saved for later
        </p>
      </div>

      {shortlist.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-16 text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-[#1B2A4A] dark:text-white mb-1">
            No Shortlisted Lawyers
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Browse lawyers and click the heart icon to add them to your shortlist.
          </p>
          <Link
            href="/browse-lawyers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B2A4A] hover:bg-[#243A5E] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Browse Lawyers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortlist.map((item, i) => (
            <motion.div
              key={item.lawyerId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {}
                  <div className="w-14 h-14 rounded-xl bg-[#1B2A4A]/5 dark:bg-white/10 flex items-center justify-center text-[#1B2A4A] dark:text-white text-lg font-bold shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{item.name?.charAt(0)?.toUpperCase() || "L"}</span>
                    )}
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/lawyers/${item.lawyerId}`}
                      className="text-sm font-bold text-[#1B2A4A] dark:text-white hover:text-[#D4A843] transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-[#D4A843] font-medium mt-0.5 truncate">
                      {item.specialization}
                    </p>

                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {item.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({item.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        ${item.hourlyRate}/hr
                      </span>
                    </div>
                  </div>

                  {}
                  <button
                    onClick={() => handleRemove(item.lawyerId, item.name)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove from shortlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {}
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/lawyers/${item.lawyerId}`}
                    className="flex-1 text-center px-3 py-2 text-xs font-semibold bg-[#1B2A4A] text-white rounded-lg hover:bg-[#243A5E] transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
