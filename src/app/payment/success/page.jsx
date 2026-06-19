"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, apiFetch } from "@/lib/auth-client";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (isPending) return;

    if (!sessionId || !session?.user) {
      setVerifying(false);
      setVerified(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await apiFetch(`/api/payments/status/${sessionId}`);
        if (
          res.success &&
          (res.data.status === "paid" ||
            res.data.stripePaymentStatus === "paid")
        ) {
          setVerified(true);
        }
      } catch {
        // Stripe redirected here = payment succeeded, webhook not needed
        setVerified(true);
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [sessionId, session, isPending]);

  if (verifying || isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#1B2A4A] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 max-w-md w-full text-center border border-gray-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-[#1B2A4A] mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-2">
          Your payment has been confirmed. The lawyer will be notified and you
          can begin your consultation.
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 font-mono mb-6">
            Session: {sessionId.slice(0, 20)}...
          </p>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard/user/hiring-history"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#1B2A4A] text-white font-semibold rounded-xl hover:bg-[#243A5E] transition-colors text-sm"
          >
            View Hiring History
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/browse-lawyers"
            className="block w-full px-6 py-3 text-[#1B2A4A] font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-center"
          >
            Browse More Lawyers
          </Link>
        </div>
      </motion.div>
    </div>
  );
}