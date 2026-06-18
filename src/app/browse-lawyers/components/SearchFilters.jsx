"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";

const SPECIALIZATIONS = [
  "All",
  "Criminal Law",
  "Corporate Law",
  "Family Law",
  "Immigration Law",
  "Real Estate Law",
  "Tax Law",
  "Civil Litigation",
  "Employment Law",
  "Intellectual Property",
  "Personal Injury",
  "Bankruptcy",
  "Constitutional Law",
];

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Rating: Low to High", value: "rating-asc" },
  { label: "Fee: Low to High", value: "fee-asc" },
  { label: "Fee: High to Low", value: "fee-desc" },
  { label: "Most Reviews", value: "reviews-desc" },
];

export default function SearchFilters({ onFilterChange, totalResults }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentSearch = searchParams.get("search") || "";
  const currentSpec = searchParams.get("specialization") || "All";
  const currentSort = searchParams.get("sort") || "default";
  const currentAvailability = searchParams.get("availability") || "all";
  const currentMinFee = searchParams.get("minFee") || "";
  const currentMaxFee = searchParams.get("maxFee") || "";

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All" && value !== "all" && value !== "default") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browse-lawyers?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push("/browse-lawyers");
  };

  const hasActiveFilters =
    currentSearch ||
    currentSpec !== "All" ||
    currentSort !== "default" ||
    currentAvailability !== "all" ||
    currentMinFee ||
    currentMaxFee;

  const filtersContent = (
    <div className="space-y-5">
      {/* Fee Range */}
      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">
          Hourly Fee Range ($)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={currentMinFee}
            onChange={(e) => updateParam("minFee", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={currentMaxFee}
            onChange={(e) => updateParam("maxFee", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
          />
        </div>
      </div>

      {/* Specialization */}
      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">
          Specialization
        </label>
        <div className="relative">
          <select
            value={currentSpec}
            onChange={(e) => updateParam("specialization", e.target.value)}
            className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 pr-9"
          >
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">
          Availability
        </label>
        <div className="flex gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Available", value: "available" },
            { label: "Busy", value: "busy" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("availability", opt.value)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                currentAvailability === opt.value
                  ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">
          Sort By
        </label>
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 pr-9"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X size={14} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Top Bar: Search + Filter Toggle + Sort + Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            defaultValue={currentSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam("search", e.target.value);
              }
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
          />
        </div>

        {/* Desktop Sort */}
        <div className="hidden sm:block relative w-52">
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 pr-9"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Filter Toggle (mobile) */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1B2A4A] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-[#D4A843] text-[#1B2A4A] text-xs font-bold rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-[#1B2A4A]">{totalResults}</span>{" "}
        lawyers
      </p>

      {/* Desktop Sidebar Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        {filtersContent}
      </div>

      {/* Mobile Filter Sheet */}
      {mobileFiltersOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white p-5 overflow-y-auto shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1B2A4A]">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            {filtersContent}
          </motion.div>
        </>
      )}
    </div>
  );
}