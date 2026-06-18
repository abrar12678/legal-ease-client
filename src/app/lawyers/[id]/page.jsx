"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CalendarDays,
  Shield,
  User,
  MessageSquare,
  Send,
} from "lucide-react";
import HireModal from "./components/HireModal";

/* ─── Fake Data ─── */
const LAWYERS_DB = {
  1: {
    id: 1,
    name: "Sarah Johnson",
    specialization: "Criminal Law",
    hourlyRate: 150,
    rating: 4.9,
    reviews: 128,
    totalHires: 324,
    location: "New York, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=1",
    dateJoined: "2024-01-15",
    bio: "Experienced criminal defense attorney with over 15 years of courtroom experience. Specializes in felony defense, DUI cases, and white-collar crimes. Former prosecutor turned defense advocate with a proven 95% success rate in trial outcomes. Licensed to practice in New York, New Jersey, and Connecticut.",
    comments: [
      { id: 1, userName: "John D.", date: "2025-03-15", text: "Sarah was incredible during my case. Her expertise and dedication made all the difference. Highly recommend!" },
      { id: 2, userName: "Maria S.", date: "2025-02-20", text: "Very professional and thorough. She explained every step clearly and fought hard for my rights." },
    ],
  },
  2: {
    id: 2,
    name: "Michael Chen",
    specialization: "Corporate Law",
    hourlyRate: 200,
    rating: 4.8,
    reviews: 95,
    totalHires: 256,
    location: "San Francisco, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=3",
    dateJoined: "2023-11-20",
    bio: "Senior corporate lawyer specializing in mergers & acquisitions, startup formation, and venture capital financing. Advised over 200 companies from seed to Series C. Former partner at a top-10 law firm, now running an independent practice serving tech companies and startups in the Bay Area.",
    comments: [
      { id: 3, userName: "Alex R.", date: "2025-04-01", text: "Michael helped us close our Series A in record time. Brilliant legal mind." },
    ],
  },
  3: {
    id: 3,
    name: "Emily Williams",
    specialization: "Family Law",
    hourlyRate: 120,
    rating: 4.7,
    reviews: 210,
    totalHires: 289,
    location: "Chicago, USA",
    status: "busy",
    image: "https://i.pravatar.cc/300?img=5",
    dateJoined: "2023-06-10",
    bio: "Compassionate family law attorney handling divorce, child custody, adoption, and domestic violence cases. Certified family law specialist with 12 years of practice. Known for her empathetic approach and ability to achieve favorable settlements without unnecessary courtroom battles.",
    comments: [
      { id: 4, userName: "Lisa P.", date: "2025-03-28", text: "Emily handled my custody case with so much care and professionalism. She truly cares about families." },
      { id: 5, userName: "Tom H.", date: "2025-01-15", text: "Excellent mediator. Helped us reach a fair agreement without going to trial." },
    ],
  },
  4: {
    id: 4,
    name: "David Martinez",
    specialization: "Immigration Law",
    hourlyRate: 130,
    rating: 4.9,
    reviews: 167,
    totalHires: 289,
    location: "Houston, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=8",
    dateJoined: "2024-02-28",
    bio: "Dedicated immigration attorney helping families and businesses navigate visas, green cards, citizenship, and deportation defense. Multilingual in English, Spanish, and Portuguese. Has successfully helped over 1,000 clients achieve legal immigration status in the United States.",
    comments: [
      { id: 6, userName: "Carlos M.", date: "2025-02-10", text: "David made the green card process so smooth. Thank you for everything!" },
    ],
  },
  5: {
    id: 5,
    name: "Jessica Brown",
    specialization: "Real Estate Law",
    hourlyRate: 160,
    rating: 4.6,
    reviews: 83,
    totalHires: 198,
    location: "Miami, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=9",
    dateJoined: "2024-04-05",
    bio: "Real estate attorney specializing in residential and commercial property transactions, landlord-tenant disputes, and zoning issues. Closed over 500 transactions in her career. Trusted by both first-time homebuyers and seasoned real estate investors across South Florida.",
    comments: [],
  },
  6: {
    id: 6,
    name: "Robert Taylor",
    specialization: "Tax Law",
    hourlyRate: 180,
    rating: 4.8,
    reviews: 142,
    totalHires: 220,
    location: "Boston, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=12",
    dateJoined: "2023-09-18",
    bio: "Tax attorney and CPA with expertise in individual and corporate tax planning, IRS disputes, and international tax law. Former IRS counsel with unique insight into audit procedures. Helps clients minimize tax liability while maintaining full compliance.",
    comments: [
      { id: 7, userName: "David K.", date: "2025-03-05", text: "Robert saved our business over $200K in tax liability. Absolute genius." },
    ],
  },
  7: {
    id: 7,
    name: "Amanda Davis",
    specialization: "Employment Law",
    hourlyRate: 140,
    rating: 4.7,
    reviews: 98,
    totalHires: 175,
    location: "Seattle, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=16",
    dateJoined: "2024-01-22",
    bio: "Employment law specialist representing employees and employers in wrongful termination, discrimination, wage disputes, and workplace harassment cases. Former HR director turned attorney, bringing unique perspective to employment disputes.",
    comments: [],
  },
  8: {
    id: 8,
    name: "James Wilson",
    specialization: "Civil Litigation",
    hourlyRate: 170,
    rating: 4.5,
    reviews: 76,
    totalHires: 150,
    location: "Denver, USA",
    status: "busy",
    image: "https://i.pravatar.cc/300?img=18",
    dateJoined: "2023-12-01",
    bio: "Civil litigation attorney with a strong track record in personal injury, contract disputes, and business torts. Over 100 jury trials completed with an 85% success rate. Known for his aggressive courtroom style and meticulous case preparation.",
    comments: [],
  },
  9: {
    id: 9,
    name: "Lisa Anderson",
    specialization: "Intellectual Property",
    hourlyRate: 220,
    rating: 4.9,
    reviews: 64,
    totalHires: 130,
    location: "San Jose, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=20",
    dateJoined: "2024-03-14",
    bio: "IP attorney specializing in patent prosecution, trademark registration, and copyright enforcement. Former patent examiner at the USPTO with a computer science background. Ideal for tech startups and software companies seeking patent protection.",
    comments: [],
  },
  10: {
    id: 10,
    name: "Christopher Lee",
    specialization: "Personal Injury",
    hourlyRate: 135,
    rating: 4.6,
    reviews: 189,
    totalHires: 310,
    location: "Los Angeles, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=25",
    dateJoined: "2023-08-30",
    bio: "Personal injury attorney recovering millions for accident victims. Handles car accidents, slip & fall, medical malpractice, and wrongful death cases on contingency. No fee unless you win philosophy ensures every client gets representation regardless of financial situation.",
    comments: [
      { id: 8, userName: "Sarah L.", date: "2025-04-10", text: "Chris fought tirelessly for my case and got me a settlement beyond my expectations." },
    ],
  },
  11: {
    id: 11,
    name: "Rachel Thompson",
    specialization: "Bankruptcy",
    hourlyRate: 110,
    rating: 4.4,
    reviews: 55,
    totalHires: 120,
    location: "Phoenix, USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=28",
    dateJoined: "2024-05-10",
    bio: "Bankruptcy attorney helping individuals and small businesses file Chapter 7 and Chapter 13 bankruptcy. Provides compassionate, judgment-free debt relief solutions. Free initial consultation to help determine the best path to financial freedom.",
    comments: [],
  },
  12: {
    id: 12,
    name: "Daniel Garcia",
    specialization: "Constitutional Law",
    hourlyRate: 190,
    rating: 4.8,
    reviews: 42,
    totalHires: 95,
    location: "Washington D.C., USA",
    status: "available",
    image: "https://i.pravatar.cc/300?img=33",
    dateJoined: "2024-02-01",
    bio: "Constitutional law scholar and litigator focusing on civil rights, First Amendment issues, and government accountability. Former constitutional law professor at Georgetown with extensive Supreme Court appellate experience.",
    comments: [],
  },
};

/* ─── Skeleton Loader ─── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="bg-white rounded-2xl p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-40 h-40 rounded-2xl bg-gray-200 shrink-0 mx-auto md:mx-0" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="h-5 w-1/3 bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-5/6 bg-gray-100 rounded" />
              <div className="h-10 w-40 bg-gray-200 rounded-lg mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function LawyerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hireModalOpen, setHireModalOpen] = useState(false);

  // Simulate fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      const found = LAWYERS_DB[params.id] || null;
      setLawyer(found);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [params.id]);

  if (loading) return <DetailSkeleton />;
  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1B2A4A] mb-2">
            Lawyer Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The lawyer you are looking for does not exist.
          </p>
          <Link
            href="/browse-lawyers"
            className="text-[#D4A843] font-medium hover:underline"
          >
            &larr; Back to Browse Lawyers
          </Link>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(lawyer.dateJoined).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/browse-lawyers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1B2A4A] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Browse Lawyers
        </Link>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-40 h-40 rounded-2xl overflow-hidden ring-4 ring-[#1B2A4A]/10 shadow-lg">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
                    {lawyer.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lawyer.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {lawyer.status === "available" ? "Available" : "Busy"}
                  </span>
                </div>

                <p className="text-[#D4A843] font-semibold text-lg mb-4">
                  {lawyer.specialization}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-5 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{lawyer.rating}</span>
                    <span className="text-gray-400">({lawyer.reviews} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={15} className="text-gray-400" />
                    {lawyer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={15} className="text-gray-400" />
                    ${lawyer.hourlyRate}/hr
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={15} className="text-gray-400" />
                    Joined {joinedDate}
                  </span>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-[#1B2A4A] mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {lawyer.bio}
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#1B2A4A]/[0.04] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-[#1B2A4A]">
                      {lawyer.totalHires}
                    </p>
                    <p className="text-xs text-gray-500">Total Hires</p>
                  </div>
                  <div className="bg-[#1B2A4A]/[0.04] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-[#1B2A4A]">
                      {lawyer.reviews}
                    </p>
                    <p className="text-xs text-gray-500">Reviews</p>
                  </div>
                  <div className="bg-[#1B2A4A]/[0.04] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-[#1B2A4A]">
                      {lawyer.rating}
                    </p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>

                {/* Hire Button */}
                {lawyer.status === "available" ? (
                  <button
                    onClick={() => setHireModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#243A5E] text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm"
                  >
                    <Shield size={18} />
                    Hire {lawyer.name.split(" ")[0]}
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 font-semibold px-7 py-3 rounded-xl cursor-not-allowed text-sm"
                  >
                    Currently Unavailable
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} className="text-[#1B2A4A]" />
            <h2 className="text-xl font-bold text-[#1B2A4A]">
              Client Reviews ({lawyer.comments.length})
            </h2>
          </div>

          {lawyer.comments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No reviews yet. Be the first to review {lawyer.name}!
            </p>
          ) : (
            <div className="space-y-4">
              {lawyer.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1B2A4A]/10 flex items-center justify-center">
                        <User size={14} className="text-[#1B2A4A]" />
                      </div>
                      <span className="text-sm font-semibold text-[#1B2A4A]">
                        {comment.userName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment (only for logged-in users who hired) */}
          {user && user.role === "user" && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">
                {lawyer.comments.length > 0
                  ? "Leave your review"
                  : "Be the first to leave a review"}
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Write your review..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
                />
                <button className="px-4 py-2.5 bg-[#1B2A4A] text-white rounded-xl hover:bg-[#243A5E] transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                <Link
                  href="/auth/signIn"
                  className="text-[#D4A843] font-medium hover:underline"
                >
                  Sign in
                </Link>{" "}
                to leave a review. Only clients who have hired this lawyer can comment.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Hire Modal */}
      <HireModal
        lawyer={lawyer}
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
      />
    </div>
  );
}