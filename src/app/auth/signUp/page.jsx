"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import authClient, { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, ArrowRight, EyeOff, CheckCircle, XCircle } from "lucide-react";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState("");
  const [emailCheck, setEmailCheck] = useState({ status: "", message: "" });
  let emailTimer = null;

  const checkEmailUniqueness = useCallback(async (email) => {
    if (!email || !email.includes("@") || email.length < 5) {
      setEmailCheck({ status: "", message: "" });
      return;
    }
    setEmailCheck({ status: "checking", message: "Checking availability..." });
    try {
      const res = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=demo&email=${encodeURIComponent(email)}`
      );
      // Fallback: try the backend to see if user exists
      const backendRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`
      );
      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.exists) {
          setEmailCheck({ status: "taken", message: "This email is already registered" });
        } else {
          setEmailCheck({ status: "available", message: "This email is available" });
        }
      } else {
        setEmailCheck({ status: "available", message: "Email looks good" });
      }
    } catch {
      setEmailCheck({ status: "available", message: "Email looks good" });
    }
  }, []);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    clearTimeout(emailTimer);
    if (!email || email.length < 5 || !email.includes("@")) {
      setEmailCheck({ status: "", message: "" });
      return;
    }
    emailTimer = setTimeout(() => checkEmailUniqueness(email.trim()), 800);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    document.title = "Sign Up | LegalEase";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        role: role,
      });

      if (data) {
        router.push("/");
        router.refresh();
      }

      if (signUpError) {
        setError(
          signUpError.message || "Sign-up failed. Try a different email or check your password."
        );
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch {
      setError("Google sign-up failed. Please try again.");
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 transition-all bg-white";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";
  const eyeBtnClass =
    "absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Join LegalEase and find expert legal counsel
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className={iconClass} />
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className={iconClass} />
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  onChange={handleEmailChange}
                  className={inputClass}
                />
                {emailCheck.status && (
                  <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${
                    emailCheck.status === "taken" ? "text-red-500" :
                    emailCheck.status === "available" ? "text-green-600" : "text-gray-400"
                  }`}>
                    {emailCheck.status === "taken" ? <XCircle size={13} /> :
                     emailCheck.status === "available" ? <CheckCircle size={13} /> :
                     <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                    {emailCheck.message}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className={iconClass} />
                <input
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className={inputClass}
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className={eyeBtnClass}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className={iconClass} />
                <input
                  name="confirmPassword"
                  type={showConfirmPwd ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  className={inputClass}
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className={eyeBtnClass}
                >
                  {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === "user"
                      ? "border-[#1B2A4A] bg-[#1B2A4A]/[0.04]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <User size={22} className={role === "user" ? "text-[#1B2A4A]" : "text-gray-400"} />
                  <span className={`text-sm font-semibold ${role === "user" ? "text-[#1B2A4A]" : "text-gray-600"}`}>
                    Client
                  </span>
                  <span className="text-xs text-gray-400 text-center leading-tight">
                    Hire legal experts
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("lawyer")}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === "lawyer"
                      ? "border-[#D4A843] bg-[#D4A843]/[0.04]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={role === "lawyer" ? "#D4A843" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <span className={`text-sm font-semibold ${role === "lawyer" ? "text-[#D4A843]" : "text-gray-600"}`}>
                    Lawyer
                  </span>
                  <span className="text-xs text-gray-400 text-center leading-tight">
                    Offer legal services
                  </span>
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                name="agreeTerms"
                required
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#1B2A4A]"
              />
              <span className="text-sm text-gray-500 leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-[#1B2A4A] font-medium hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#1B2A4A] font-medium hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1B2A4A] hover:bg-[#243A5E] text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wide whitespace-nowrap">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignUp}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/signIn"
              className="text-[#1B2A4A] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}