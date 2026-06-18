"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";
import Link from "next/link";

export default function LawyerCard({ lawyer, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(27,42,74,0.1)" }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer"
    >
      <Link href={`/lawyers/${lawyer.id}`} className="block">
        {/* Top: Avatar + Status */}
        <div className="relative pt-7 pb-3 flex flex-col items-center bg-gradient-to-b from-[#1B2A4A]/[0.04] to-transparent">
          <div className="relative">
            <div className="w-22 h-22 rounded-full overflow-hidden ring-4 ring-white shadow-md">
              <img
                src={lawyer.image}
                alt={lawyer.name}
                className="w-[88px] h-[88px] object-cover"
              />
            </div>
            {lawyer.status === "busy" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                Busy
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pb-4 pt-2 text-center">
          <h3 className="text-[15px] font-bold text-[#1B2A4A] group-hover:text-[#D4A843] transition-colors truncate">
            {lawyer.name}
          </h3>
          <p className="text-sm text-[#D4A843] font-medium mt-0.5">
            {lawyer.specialization}
          </p>

          <div className="flex items-center justify-center gap-1 mt-1.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-700">{lawyer.rating}</span>
            <span className="text-xs text-gray-400">({lawyer.reviews})</span>
          </div>

          <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500">
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