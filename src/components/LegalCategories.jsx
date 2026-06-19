"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Building2,
  Users,
  Home,
  Landmark,
  Scale,
  FileCheck,
  Gavel,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  { label: "Criminal Law", icon: Shield, filter: "criminal" },
  { label: "Corporate Law", icon: Building2, filter: "corporate" },
  { label: "Family Law", icon: Users, filter: "family" },
  { label: "Real Estate", icon: Home, filter: "real-estate" },
  { label: "Immigration", icon: Landmark, filter: "immigration" },
  { label: "Civil Litigation", icon: Scale, filter: "civil" },
  { label: "Tax Law", icon: FileCheck, filter: "tax" },
  { label: "Employment Law", icon: Briefcase, filter: "employment" },
  { label: "Intellectual Property", icon: Gavel, filter: "ip" },
  { label: "Personal Injury", icon: Shield, filter: "injury" },
  { label: "Bankruptcy", icon: Building2, filter: "bankruptcy" },
  { label: "Constitutional Law", icon: Landmark, filter: "constitutional" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function getCountForCategory(categoryLabel, categoryCounts) {
  if (!categoryCounts.length) return 0;

  // Exact match (case-insensitive)
  const exact = categoryCounts.find(
    (c) => c.name.toLowerCase() === categoryLabel.toLowerCase()
  );
  if (exact) return exact.count;

  // Loose match: API name contains category label or vice versa
  const loose = categoryCounts.find(
    (c) =>
      c.name.toLowerCase().includes(categoryLabel.toLowerCase()) ||
      categoryLabel.toLowerCase().includes(c.name.toLowerCase())
  );
  if (loose) return loose.count;

  return 0;
}

export default function LegalCategories() {
  const [categoryCounts, setCategoryCounts] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/lawyers/categories");
        if (res.ok) {
          const json = await res.json();
          setCategoryCounts(json.data?.categories || []);
        }
      } catch {
        // silently handle
      }
    }
    fetchCategories();
  }, []);

  const categoriesWithCounts = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        count: getCountForCategory(cat.label, categoryCounts),
      })),
    [categoryCounts]
  );

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
            Legal Categories
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find the right lawyer by browsing through legal specializations
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {categoriesWithCounts.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.filter}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(27,42,74,0.1)" }}
                className="bg-white rounded-xl p-5 text-center border border-gray-100 group cursor-pointer transition-colors hover:border-[#D4A843]/30"
              >
                <Link
                  href={`/browse-lawyers?specialization=${cat.filter}`}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1B2A4A]/5 group-hover:bg-[#D4A843]/10 flex items-center justify-center transition-colors">
                    <Icon
                      size={22}
                      className="text-[#1B2A4A] group-hover:text-[#D4A843] transition-colors"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1B2A4A]">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat.count} lawyers
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Browse All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/browse-lawyers"
            className="inline-flex items-center gap-2 text-[#1B2A4A] font-semibold hover:text-[#D4A843] transition-colors"
          >
            Browse All Categories
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}