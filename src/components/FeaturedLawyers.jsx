"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/lawyers/featured");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setLawyers((data.data.lawyers || []).slice(0, 6));
          }
        }
      } catch (err) {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-3">
            Featured Lawyers
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover top-rated legal professionals ready to help with your case
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse">
                <div className="pt-8 pb-4 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200" />
                </div>
                <div className="px-5 pb-5 pt-3 text-center space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg mx-auto w-32" />
                  <div className="h-4 bg-gray-100 rounded-lg mx-auto w-24" />
                  <div className="h-4 bg-gray-100 rounded-lg mx-auto w-20" />
                  <div className="flex justify-center gap-4">
                    <div className="h-3 bg-gray-100 rounded w-20" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : lawyers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No featured lawyers available yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Lawyer Cards Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {lawyers.map((lawyer) => (
                <motion.div
                  key={lawyer._id}
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(27,42,74,0.12)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer"
                >
                  <Link href={`/lawyers/${lawyer._id}`} className="block">
                    {/* Card Top - Avatar + Status */}
                    <div className="relative pt-8 pb-4 flex flex-col items-center bg-gradient-to-b from-[#1B2A4A]/5 to-transparent">
                      <div className="relative">
                        {lawyer.image ? (
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                            <img
                              src={lawyer.image}
                              alt={lawyer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full ring-4 ring-white shadow-lg bg-[#1B2A4A]/10 flex items-center justify-center text-[#1B2A4A] text-2xl font-bold">
                            {lawyer.name?.charAt(0)?.toUpperCase() || "L"}
                          </div>
                        )}
                        {/* Status Badge */}
                        <span
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold ${
                            lawyer.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {lawyer.isAvailable ? "Available" : "Busy"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 pb-5 pt-3 text-center">
                      <h3 className="text-lg font-bold text-[#1B2A4A] group-hover:text-[#D4A843] transition-colors">
                        {lawyer.name}
                      </h3>
                      <p className="text-sm text-[#D4A843] font-medium mt-1">
                        {lawyer.specialization || "N/A"}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          {lawyer.rating}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({lawyer.totalReviews} reviews)
                        </span>
                      </div>

                      {/* Info Row */}
                      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {lawyer.city || lawyer.location || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          ${lawyer.hourlyRate || 0}/hr
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/browse-lawyers"
            className="inline-flex items-center gap-2 text-[#1B2A4A] font-semibold hover:text-[#D4A843] transition-colors text-base"
          >
            View All Lawyers
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}