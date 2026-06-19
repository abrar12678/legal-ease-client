"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, User } from "lucide-react";

const defaultAvatar = "/images/default-avatar.png";

export default function TopLegalExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopExperts() {
      try {
        const res = await fetch("/api/lawyers/top-experts");
        if (res.ok) {
          const json = await res.json();
          setExperts(json.data?.lawyers || []);
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchTopExperts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Trophy size={16} />
            Top Rated
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-3">
            Top Legal Experts
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our most hired legal professionals with proven track records
          </p>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gradient-to-br from-[#1B2A4A] to-[#2D4A7A] rounded-2xl p-6 h-[320px]"
              >
                <div className="flex flex-col items-center pt-4">
                  <div className="w-20 h-20 rounded-full bg-white/10 mb-4" />
                  <div className="w-32 h-4 bg-white/10 rounded mb-2" />
                  <div className="w-24 h-3 bg-white/10 rounded mb-3" />
                  <div className="w-20 h-10 bg-white/10 rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && experts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              No hiring data yet. Top experts will appear here once lawyers
              start getting hired.
            </p>
          </div>
        )}

        {/* Experts Cards */}
        {!loading && experts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <motion.div
                key={expert._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -4 }}
                className="relative bg-gradient-to-br from-[#1B2A4A] to-[#2D4A7A] rounded-2xl p-6 text-white overflow-hidden group"
              >
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />

                {/* Rank Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-[#D4A843] rounded-full flex items-center justify-center text-[#1B2A4A] text-sm font-bold">
                  #{index + 1}
                </div>

                <div className="relative z-10 flex flex-col items-center text-center pt-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#D4A843]/30 mb-4 bg-white/10">
                    {expert.image ? (
                      <Image
                        src={expert.image}
                        alt={expert.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/60">
                        <User size={32} />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold">{expert.name}</h3>
                  {expert.specialization && (
                    <p className="text-[#D4A843] text-sm font-medium mt-1">
                      {expert.specialization}
                    </p>
                  )}

                  {/* Total Hires */}
                  <div className="mt-4 bg-white/10 rounded-lg px-4 py-2">
                    <p className="text-2xl font-bold">{expert.totalHires}</p>
                    <p className="text-xs text-white/60">Total Hires</p>
                  </div>

                  {/* View Profile Link */}
                  <Link
                    href={`/lawyers/${expert._id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm text-[#D4A843] hover:text-white transition-colors font-medium"
                  >
                    View Profile
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}