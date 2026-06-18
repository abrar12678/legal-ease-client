import { SearchX } from "lucide-react";

export default function EmptyState({ searchQuery }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <SearchX size={36} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-[#1B2A4A] mb-2">
        No Lawyers Found
      </h3>
      <p className="text-gray-500 text-sm max-w-md">
        {searchQuery
          ? `No results match "${searchQuery}". Try a different search term or adjust your filters.`
          : "No lawyers match your current filters. Try removing some filters to see more results."}
      </p>
    </div>
  );
}