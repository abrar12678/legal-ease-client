"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, apiFetch } from "@/lib/auth-client";
import { toast } from "react-toastify";
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
  GraduationCap,
  Award,
  Globe,
  Briefcase,
  Loader2,
  Heart,
  BadgeCheck,
} from "lucide-react";
import HireModal from "./components/HireModal";


function StarRating({ value, onChange, size = 20, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}


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
        <div className="mt-8 bg-white rounded-2xl p-8 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-3/4 bg-gray-100 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function LawyerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [lawyer, setLawyer] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [isHired, setIsHired] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);

  
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchLawyerDetails() {
      try {
        const res = await fetch(`/api/lawyers/${params.id}`);
        if (!cancelled && res.ok) {
          const json = await res.json();
          if (json.success) {
            setLawyer(json.data.lawyer);
            setComments(json.data.comments || []);
          }
        }
      } catch {
        
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLawyerDetails();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  
  useEffect(() => {
    if (!isPending && user?.role === "user" && params.id) {
      apiFetch(`/api/lawyers/${params.id}/hired-status`).then((res) => {
        if (res.success) {
          setIsHired(res.data.isHired);
          setIsShortlisted(res.data.isShortlisted);
        }
      }).catch(() => {});
    }
  }, [isPending, user, params.id]);

  const handleToggleShortlist = async () => {
    if (!user || user.role !== "user" || shortlistLoading) return;
    setShortlistLoading(true);
    try {
      if (isShortlisted) {
        const res = await apiFetch(`/api/shortlist/${params.id}`, { method: "DELETE" });
        if (res.success) { setIsShortlisted(false); toast.info("Removed from shortlist"); }
      } else {
        const res = await apiFetch("/api/shortlist", { method: "POST", body: JSON.stringify({ lawyerId: params.id }) });
        if (res.success) { setIsShortlisted(true); toast.success("Added to shortlist"); }
        else { toast.error(res.message || "Failed"); }
      }
    } catch { toast.error("Failed to update shortlist"); }
    finally { setShortlistLoading(false); }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    setSubmittingReview(true);

    try {
      const res = await apiFetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          lawyerId: params.id,
          text: reviewText.trim(),
          rating: reviewRating,
        }),
      });

      if (res.success) {
        toast.success("Review submitted successfully!");
        
        const newComment = {
          _id: res.data._id,
          userId: user.id,
          userName: user.name || "You",
          userImage: user.image || null,
          text: reviewText.trim(),
          rating: reviewRating,
          date: new Date().toISOString(),
        };
        setComments((prev) => [newComment, ...prev]);
        setReviewText("");
        setReviewRating(0);

        
        setLawyer((prev) => {
          const oldTotal = prev.reviews || 0;
          const oldAvg = prev.rating || 0;
          const newAvg =
            oldTotal === 0
              ? reviewRating
              : (oldAvg * oldTotal + reviewRating) / (oldTotal + 1);
          return {
            ...prev,
            reviews: oldTotal + 1,
            rating: Number(newAvg.toFixed(1)),
          };
        });
      } else {
        toast.error(res.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

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

  const joinedDate = lawyer.dateJoined
    ? new Date(lawyer.dateJoined).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <Link
          href="/browse-lawyers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1B2A4A] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Browse Lawyers
        </Link>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              {}
              <div className="shrink-0 mx-auto md:mx-0">
                {lawyer.image ? (
                  <div className="w-40 h-40 rounded-2xl overflow-hidden ring-4 ring-[#1B2A4A]/10 shadow-lg">
                    <img
                      src={lawyer.image}
                      alt={lawyer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-2xl ring-4 ring-[#1B2A4A]/10 shadow-lg bg-[#1B2A4A]/10 flex items-center justify-center text-[#1B2A4A] text-4xl font-bold">
                    {lawyer.name?.charAt(0)?.toUpperCase() || "L"}
                  </div>
                )}
              </div>

              {}
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
                  {isHired && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                      <BadgeCheck size={12} /> Hired
                    </span>
                  )}
                </div>

                <p className="text-[#D4A843] font-semibold text-lg mb-4">
                  {lawyer.specialization || "N/A"}
                </p>

                {}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 mb-5 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star
                      size={15}
                      className="fill-amber-400 text-amber-400"
                    />
                    <span className="font-semibold">{lawyer.rating}</span>
                    <span className="text-gray-400">
                      ({lawyer.reviews} reviews)
                    </span>
                  </span>
                  {lawyer.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={15} className="text-gray-400" />
                      {lawyer.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={15} className="text-gray-400" />
                    ${lawyer.hourlyRate}/hr
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={15} className="text-gray-400" />
                    Joined {joinedDate}
                  </span>
                </div>

                {}
                {lawyer.bio && (
                  <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
                    <h3 className="text-sm font-semibold text-[#1B2A4A] mb-2">
                      Professional Summary
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {lawyer.bio}
                    </p>
                  </div>
                )}

                {}
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

                {}
                <div className="flex items-center gap-3">
                  {user?.role === "user" && (
                    <button
                      onClick={handleToggleShortlist}
                      disabled={shortlistLoading}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all ${
                        isShortlisted
                          ? "border-red-200 bg-red-50 text-red-500"
                          : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400 hover:bg-red-50"
                      }`}
                      title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                    >
                      <Heart size={18} className={isShortlisted ? "fill-red-500" : ""} />
                    </button>
                  )}
                  {lawyer.status === "available" ? (
                    <button
                      onClick={() => setHireModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#243A5E] text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm"
                    >
                      <Shield size={18} />
                      Hire {lawyer.name?.split(" ")[0]}
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
          </div>
        </motion.div>

        {}
        {(lawyer.experience > 0 ||
          (lawyer.education && lawyer.education.length > 0) ||
          (lawyer.languages && lawyer.languages.length > 0) ||
          (lawyer.achievements && lawyer.achievements.length > 0) ||
          lawyer.barLicenseNumber) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {}
            {lawyer.experience > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1B2A4A]/[0.06] flex items-center justify-center">
                    <Briefcase size={18} className="text-[#1B2A4A]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1B2A4A]">
                    Experience
                  </h3>
                </div>
                <p className="text-2xl font-bold text-[#1B2A4A]">
                  {lawyer.experience}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    Years
                  </span>
                </p>
              </div>
            )}

            {}
            {lawyer.education && lawyer.education.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1B2A4A]/[0.06] flex items-center justify-center">
                    <GraduationCap size={18} className="text-[#1B2A4A]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1B2A4A]">
                    Education
                  </h3>
                </div>
                <ul className="space-y-1">
                  {lawyer.education.map((edu, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {}
            {lawyer.languages && lawyer.languages.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1B2A4A]/[0.06] flex items-center justify-center">
                    <Globe size={18} className="text-[#1B2A4A]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1B2A4A]">
                    Languages
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#1B2A4A]/[0.06] text-[#1B2A4A] text-sm rounded-lg"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {}
            {lawyer.achievements && lawyer.achievements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#D4A843]/10 flex items-center justify-center">
                    <Award size={18} className="text-[#D4A843]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1B2A4A]">
                    Achievements
                  </h3>
                </div>
                <ul className="space-y-1">
                  {lawyer.achievements.map((ach, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} className="text-[#1B2A4A]" />
            <h2 className="text-xl font-bold text-[#1B2A4A]">
              Client Reviews ({comments.length})
            </h2>
          </div>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No reviews yet. Be the first to review {lawyer.name}!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {comment.userImage ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={comment.userImage}
                            alt={comment.userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#1B2A4A]/10 flex items-center justify-center">
                          <User size={14} className="text-[#1B2A4A]" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-[#1B2A4A]">
                        {comment.userName}
                      </span>
                      <StarRating
                        value={comment.rating}
                        onChange={() => {}}
                        size={13}
                        readonly
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {comment.date
                        ? new Date(comment.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {}
          {user && user.role === "user" && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">
                {comments.length > 0
                  ? "Leave your review"
                  : "Be the first to leave a review"}
              </p>

              {}
              <div className="mb-3">
                <StarRating value={reviewRating} onChange={setReviewRating} />
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && reviewText.trim() && reviewRating > 0) {
                      handleSubmitReview();
                    }
                  }}
                  placeholder="Write your review..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={
                    submittingReview ||
                    !reviewText.trim() ||
                    reviewRating === 0
                  }
                  className="px-4 py-2.5 bg-[#1B2A4A] text-white rounded-xl hover:bg-[#243A5E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {submittingReview ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              {reviewRating === 0 && reviewText.trim() && (
                <p className="text-xs text-amber-600 mt-2">
                  Please select a star rating before submitting.
                </p>
              )}
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
                to leave a review. Only clients who have hired this lawyer can
                comment.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {}
      <HireModal
        lawyer={lawyer}
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
      />
    </div>
  );
}