"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Heart, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useSession, apiFetch } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function LawyerCard({ lawyer, index = 0 }) {
  const [isShortlisted, setIsShortlisted] = useState(lawyer.isShortlisted || false);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const { data: session } = useSession();
  const isUser = session?.user?.role === "client";

  const handleToggleShortlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUser || shortlistLoading) return;

    setShortlistLoading(true);
    try {
      if (isShortlisted) {
        const res = await apiFetch(`/api/shortlist/${lawyer.id}`, { method: "DELETE" });
        if (res.success) {
          setIsShortlisted(false);
          toast.info("Removed from shortlist");
        }
      } else {
        const res = await apiFetch("/api/shortlist", {
          method: "POST",
          body: JSON.stringify({ lawyerId: lawyer.id }),
        });
        if (res.success) {
          setIsShortlisted(true);
          toast.success("Added to shortlist");
        } else {
          toast.error(res.message || "Failed to add to shortlist");
        }
      }
    } catch {
      toast.error("Failed to update shortlist");
    } finally {
      setShortlistLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(27,42,74,0.1)" }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 group cursor-pointer relative"
    >
      {/* Hired Badge */}
      {lawyer.isHired && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-[11px] font-bold rounded-full shadow-sm">
          <BadgeCheck size={12} />
          Hired
        </div>
      )}

      {/* Shortlist Heart Button */}
      {isUser && (
        <button
          onClick={handleToggleShortlist}
          disabled={shortlistLoading}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-all"
          title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isShortlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
          />
        </button>
      )}

      <Link href={`/lawyers/${lawyer.id}`} className="block">
        {/* Top: Avatar + Status */}
        <div className="relative pt-7 pb-3 flex flex-col items-center bg-gradient-to-b from-[#1B2A4A]/[0.04] dark:from-white/[0.03] to-transparent">
          <div className="relative">
            <div className="w-22 h-22 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md">
              {lawyer.image ? (
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-[88px] h-[88px] object-cover"
                />
              ) : (
                <div className="w-[88px] h-[88px] bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-400 dark:text-gray-300 text-2xl font-bold">
                  {lawyer.name?.charAt(0)?.toUpperCase() || "L"}
                </div>
              )}
            </div>
            {lawyer.status === "busy" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                Busy
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pb-4 pt-2 text-center">
          <h3 className="text-[15px] font-bold text-[#1B2A4A] dark:text-white group-hover:text-[#D4A843] transition-colors truncate">
            {lawyer.name}
          </h3>
          <p className="text-sm text-[#D4A843] font-medium mt-0.5">
            {lawyer.specialization}
          </p>

          <div className="flex items-center justify-center gap-1 mt-1.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{lawyer.rating}</span>
            <span className="text-xs text-gray-400">({lawyer.reviews})</span>
          </div>

          <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {lawyer.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              ${lawyer.hourlyRate}/hr
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
