"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LawyerCard from "./components/LawyerCard";
import LawyerSkeleton from "./components/LawyerSkeleton";
import EmptyState from "./components/EmptyState";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";

/* ─── Fake Lawyer Data ─── */
const ALL_LAWYERS = [
  { id: 1, name: "Sarah Johnson", specialization: "Criminal Law", hourlyRate: 150, rating: 4.9, reviews: 128, location: "New York, USA", status: "available", image: "https://i.pravatar.cc/300?img=1" },
  { id: 2, name: "Michael Chen", specialization: "Corporate Law", hourlyRate: 200, rating: 4.8, reviews: 95, location: "San Francisco, USA", status: "available", image: "https://i.pravatar.cc/300?img=3" },
  { id: 3, name: "Emily Williams", specialization: "Family Law", hourlyRate: 120, rating: 4.7, reviews: 210, location: "Chicago, USA", status: "busy", image: "https://i.pravatar.cc/300?img=5" },
  { id: 4, name: "David Martinez", specialization: "Immigration Law", hourlyRate: 130, rating: 4.9, reviews: 167, location: "Houston, USA", status: "available", image: "https://i.pravatar.cc/300?img=8" },
  { id: 5, name: "Jessica Brown", specialization: "Real Estate Law", hourlyRate: 160, rating: 4.6, reviews: 83, location: "Miami, USA", status: "available", image: "https://i.pravatar.cc/300?img=9" },
  { id: 6, name: "Robert Taylor", specialization: "Tax Law", hourlyRate: 180, rating: 4.8, reviews: 142, location: "Boston, USA", status: "available", image: "https://i.pravatar.cc/300?img=12" },
  { id: 7, name: "Amanda Davis", specialization: "Employment Law", hourlyRate: 140, rating: 4.7, reviews: 98, location: "Seattle, USA", status: "available", image: "https://i.pravatar.cc/300?img=16" },
  { id: 8, name: "James Wilson", specialization: "Civil Litigation", hourlyRate: 170, rating: 4.5, reviews: 76, location: "Denver, USA", status: "busy", image: "https://i.pravatar.cc/300?img=18" },
  { id: 9, name: "Lisa Anderson", specialization: "Intellectual Property", hourlyRate: 220, rating: 4.9, reviews: 64, location: "San Jose, USA", status: "available", image: "https://i.pravatar.cc/300?img=20" },
  { id: 10, name: "Christopher Lee", specialization: "Personal Injury", hourlyRate: 135, rating: 4.6, reviews: 189, location: "Los Angeles, USA", status: "available", image: "https://i.pravatar.cc/300?img=25" },
  { id: 11, name: "Rachel Thompson", specialization: "Bankruptcy", hourlyRate: 110, rating: 4.4, reviews: 55, location: "Phoenix, USA", status: "available", image: "https://i.pravatar.cc/300?img=28" },
  { id: 12, name: "Daniel Garcia", specialization: "Constitutional Law", hourlyRate: 190, rating: 4.8, reviews: 42, location: "Washington D.C., USA", status: "available", image: "https://i.pravatar.cc/300?img=33" },
  { id: 13, name: "Sophia Martinez", specialization: "Family Law", hourlyRate: 125, rating: 4.7, reviews: 176, location: "Austin, USA", status: "available", image: "https://i.pravatar.cc/300?img=44" },
  { id: 14, name: "Andrew Robinson", specialization: "Criminal Law", hourlyRate: 165, rating: 4.6, reviews: 91, location: "Philadelphia, USA", status: "busy", image: "https://i.pravatar.cc/300?img=53" },
  { id: 15, name: "Michelle Kim", specialization: "Corporate Law", hourlyRate: 210, rating: 4.9, reviews: 87, location: "New York, USA", status: "available", image: "https://i.pravatar.cc/300?img=47" },
  { id: 16, name: "Thomas Clark", specialization: "Immigration Law", hourlyRate: 125, rating: 4.5, reviews: 134, location: "Dallas, USA", status: "available", image: "https://i.pravatar.cc/300?img=59" },
  { id: 17, name: "Jennifer White", specialization: "Real Estate Law", hourlyRate: 155, rating: 4.7, reviews: 72, location: "Portland, USA", status: "available", image: "https://i.pravatar.cc/300?img=32" },
  { id: 18, name: "Kevin Harris", specialization: "Tax Law", hourlyRate: 175, rating: 4.6, reviews: 108, location: "Atlanta, USA", status: "available", image: "https://i.pravatar.cc/300?img=57" },
];

const SPECIALIZATIONS = [
  "All", "Criminal Law", "Corporate Law", "Family Law", "Immigration Law",
  "Real Estate Law", "Tax Law", "Civil Litigation", "Employment Law",
  "Intellectual Property", "Personal Injury", "Bankruptcy", "Constitutional Law",
];

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Rating: Low to High", value: "rating-asc" },
  { label: "Fee: Low to High", value: "fee-asc" },
  { label: "Fee: High to Low", value: "fee-desc" },
  { label: "Most Reviews", value: "reviews-desc" },
];

const LAWYERS_PER_PAGE = 9;

function SidebarFilters({ searchParams, router }) {
  const currentSpec = searchParams.get("specialization") || "All";
  const currentAvailability = searchParams.get("availability") || "all";
  const currentSort = searchParams.get("sort") || "default";
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

  const hasFilters =
    currentSpec !== "All" ||
    currentAvailability !== "all" ||
    currentMinFee ||
    currentMaxFee ||
    currentSort !== "default";

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">Hourly Fee Range ($)</label>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={currentMinFee} onChange={(e) => updateParam("minFee", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30" />
          <span className="text-gray-400 text-sm">—</span>
          <input type="number" placeholder="Max" value={currentMaxFee} onChange={(e) => updateParam("maxFee", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">Specialization</label>
        <div className="relative">
          <select value={currentSpec} onChange={(e) => updateParam("specialization", e.target.value)} className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 pr-9">
            {SPECIALIZATIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">Availability</label>
        <div className="flex gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Available", value: "available" },
            { label: "Busy", value: "busy" },
          ].map((opt) => (
            <button key={opt.value} onClick={() => updateParam("availability", opt.value)} className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${currentAvailability === opt.value ? "bg-[#1B2A4A] text-white border-[#1B2A4A]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1B2A4A] mb-2">Sort By</label>
        <div className="relative">
          <select value={currentSort} onChange={(e) => updateParam("sort", e.target.value)} className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 pr-9">
            {SORT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearAll} className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const searchQuery = (searchParams.get("search") || "").toLowerCase();
  const specFilter = searchParams.get("specialization") || "";
  const availabilityFilter = searchParams.get("availability") || "";
  const minFee = parseFloat(searchParams.get("minFee")) || 0;
  const maxFee = parseFloat(searchParams.get("maxFee")) || Infinity;
  const sortBy = searchParams.get("sort") || "default";
  const currentSort = sortBy;

  const filteredLawyers = useMemo(() => {
    let result = [...ALL_LAWYERS];
    if (searchQuery) {
      result = result.filter((l) => l.name.toLowerCase().includes(searchQuery) || l.specialization.toLowerCase().includes(searchQuery));
    }
    if (specFilter && specFilter !== "All") {
      result = result.filter((l) => l.specialization === specFilter);
    }
    if (availabilityFilter && availabilityFilter !== "all") {
      result = result.filter((l) => l.status === availabilityFilter);
    }
    if (minFee > 0) result = result.filter((l) => l.hourlyRate >= minFee);
    if (maxFee < Infinity) result = result.filter((l) => l.hourlyRate <= maxFee);
    switch (sortBy) {
      case "rating-desc": result.sort((a, b) => b.rating - a.rating); break;
      case "rating-asc": result.sort((a, b) => a.rating - b.rating); break;
      case "fee-asc": result.sort((a, b) => a.hourlyRate - b.hourlyRate); break;
      case "fee-desc": result.sort((a, b) => b.hourlyRate - a.hourlyRate); break;
      case "reviews-desc": result.sort((a, b) => b.reviews - a.reviews); break;
    }
    return result;
  }, [searchQuery, specFilter, availabilityFilter, minFee, maxFee, sortBy]);

  const totalPages = Math.ceil(filteredLawyers.length / LAWYERS_PER_PAGE);
  const paginatedLawyers = filteredLawyers.slice((currentPage - 1) * LAWYERS_PER_PAGE, currentPage * LAWYERS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1B2A4A]">Browse Lawyers</h1>
          <p className="text-gray-500 mt-2">Find and hire the right legal expert for your needs</p>
        </div>

        {/* Top Bar: Search + Sort + Filter Toggle + Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              defaultValue={searchQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const params = new URLSearchParams(searchParams.toString());
                  if (e.target.value.trim()) {
                    params.set("search", e.target.value.trim());
                  } else {
                    params.delete("search");
                  }
                  router.push(`/browse-lawyers?${params.toString()}`);
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
            />
          </div>

          {/* Desktop Sort */}
          <div className="hidden sm:block relative w-52">
            <select
              value={currentSort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value && e.target.value !== "default") params.set("sort", e.target.value);
                else params.delete("sort");
                router.push(`/browse-lawyers?${params.toString()}`, { scroll: false });
              }}
              className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 pr-9"
            >
              {SORT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1B2A4A] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-[#1B2A4A]">{filteredLawyers.length}</span> lawyers
        </p>

        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <SidebarFilters searchParams={searchParams} router={router} />
            </div>
          </aside>

          {/* Lawyer Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (<LawyerSkeleton key={i} />))}
              </div>
            ) : paginatedLawyers.length === 0 ? (
              <EmptyState searchQuery={searchQuery} />
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginatedLawyers.map((lawyer, i) => (<LawyerCard key={lawyer.id} lawyer={lawyer} index={i} />))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-[#1B2A4A] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1B2A4A]">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
                <X size={18} />
              </button>
            </div>
            <SidebarFilters searchParams={searchParams} router={router} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrowseLawyersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-10 w-48 bg-gray-200 rounded-lg mb-2 animate-pulse" />
            <div className="h-5 w-72 bg-gray-100 rounded animate-pulse mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (<LawyerSkeleton key={i} />))}
            </div>
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}