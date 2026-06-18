export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-[#1B2A4A]/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-[#1B2A4A] rounded-full animate-spin" />
        </div>
        <p className="text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}