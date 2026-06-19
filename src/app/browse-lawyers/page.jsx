"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LawyerCard from "./components/LawyerCard";
import LawyerSkeleton from "./components/LawyerSkeleton";
import EmptyState from "./components/EmptyState";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";

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

function buildQueryParams(searchParams, page) {
  const params = new URLSearchParams();
  const search = searchParams.get("search");
  const spec = searchParams.get("specialization");
  const availability = searchParams.get("availability");
  const minFee = searchParams.get("minFee");
  const maxFee = searchParams.get("maxFee");
  const sort = searchParams.get("sort");

  if (search) params.set("search", search);
  if (spec && spec !== "All") params.set("specialization", spec);
  if (availability && availability !== "all") params.set("availability", availability);
  if (minFee) params.set("minFee", minFee);
  if (maxFee) params.set("maxFee", maxFee);
  if (sort && sort !== "default") params.set("sort", sort);
  params.set("page", page);
  params.set("limit", LAWYERS_PER_PAGE);

  return params.toString();
}

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
    params.delete("page");
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
  const [lawyers, setLawyers] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalResults / LAWYERS_PER_PAGE);

  const fetchLawyers = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQueryParams(searchParams, currentPage);
      const res = await fetch(`/api/lawyers?${qs}`);
      if (res.ok) {
        const json = await res.json();
        setLawyers(json.data?.lawyers || []);
        setTotalResults(json.data?.total || 0);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page);
    }
    router.push(`/browse-lawyers?${params.toString()}`, { scroll: false });
  };

  const searchQuery = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "default";

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
                  params.delete("page");
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
                params.delete("page");
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
          Showing <span className="font-semibold text-[#1B2A4A]">{totalResults}</span> lawyers
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
            ) : lawyers.length === 0 ? (
              <EmptyState searchQuery={searchQuery} />
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {lawyers.map((lawyer, i) => (<LawyerCard key={lawyer.id} lawyer={lawyer} index={i} />))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-[#1B2A4A] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
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