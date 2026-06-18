"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Star, ArrowRight } from "lucide-react";

const TOP_EXPERTS = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialization: "Criminal Defense",
    totalHires: 324,
    rating: 4.9,
    image: "https://i.pravatar.cc/300?img=1",
  },
  {
    id: 2,
    name: "David Martinez",
    specialization: "Immigration Law",
    totalHires: 289,
    rating: 4.9,
    image: "https://i.pravatar.cc/300?img=8",
  },
  {
    id: 3,
    name: "Michael Chen",
    specialization: "Corporate Law",
    totalHires: 256,
    rating: 4.8,
    image: "https://i.pravatar.cc/300?img=3",
  },
];

export default function TopLegalExperts() {
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

        {/* Experts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOP_EXPERTS.map((expert, index) => (
            <motion.div
              key={expert.id}
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
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#D4A843]/30 mb-4">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                <h3 className="text-lg font-bold">{expert.name}</h3>
                <p className="text-[#D4A843] text-sm font-medium mt-1">
                  {expert.specialization}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-3">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{expert.rating}</span>
                </div>

                {/* Total Hires */}
                <div className="mt-4 bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-2xl font-bold">{expert.totalHires}</p>
                  <p className="text-xs text-white/60">Total Hires</p>
                </div>

                {/* View Profile Link */}
                <Link
                  href={`/lawyers/${expert.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-[#D4A843] hover:text-white transition-colors font-medium"
                >
                  View Profile
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}