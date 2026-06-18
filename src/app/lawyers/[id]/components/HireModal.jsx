"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function HireModal({ lawyer, isOpen, onClose }) {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [submitting, setSubmitting] = useState(false);

  const canHire = user && user.role === "user";

  const handleHire = async () => {
    if (!canHire) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1B2A4A]">
                Confirm Hiring Request
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Lawyer Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-[#1B2A4A] truncate">
                    {lawyer.name}
                  </h4>
                  <p className="text-sm text-[#D4A843] font-medium">
                    {lawyer.specialization}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    ${lawyer.hourlyRate}/hr consultation
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg mb-5">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  A hiring request will be sent to {lawyer.name}. You can pay
                  the consultation fee after the lawyer accepts your request.
                </p>
              </div>

              {/* Auth Check: Not logged in */}
              {!user && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg mb-5">
                  <User size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Login Required</p>
                    <p className="mt-0.5">
                      Please{" "}
                      <Link
                        href="/auth/signIn"
                        className="underline font-semibold hover:text-blue-900"
                      >
                        sign in
                      </Link>
                      {" "}or{" "}
                      <Link
                        href="/auth/signUp"
                        className="underline font-semibold hover:text-blue-900"
                      >
                        create an account
                      </Link>
                      {" "}to hire a lawyer.
                    </p>
                  </div>
                </div>
              )}

              {/* Auth Check: Wrong role */}
              {user && user.role !== "user" && (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg mb-5">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    Only clients can hire lawyers. Your current role is{" "}
                    <span className="font-semibold capitalize">{user.role}</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {canHire ? (
                <button
                  onClick={handleHire}
                  disabled={submitting || lawyer.status === "busy"}
                  className="px-6 py-2.5 text-sm font-semibold bg-[#1B2A4A] text-white rounded-lg hover:bg-[#243A5E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Confirm Hire"
                  )}
                </button>
              ) : (
                <Link
                  href="/auth/signUp"
                  className="px-6 py-2.5 text-sm font-semibold bg-[#D4A843] text-[#1B2A4A] rounded-lg hover:bg-[#c49a38] transition-colors"
                >
                  Sign Up to Hire
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}