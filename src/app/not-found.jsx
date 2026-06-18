import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-[#1B2A4A]/5 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-bold text-[#1B2A4A]">404</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Please check the
          URL or navigate back to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#243A5E] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}