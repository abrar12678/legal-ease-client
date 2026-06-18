"use client";

import { useState, useEffect } from "react";
import { useSession, apiFetch } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { User, Mail, Camera, Save, CheckCircle } from "lucide-react";

export default function UpdateProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/api/auth/me");
        if (!cancelled && res.success) {
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
          });
        } else if (!cancelled) {
          setFormData({
            name: user?.name || "",
            email: user?.email || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setFormData({
            name: user?.name || "",
            email: user?.email || "",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (!isPending) {
      fetchProfile();
    }
    return () => { cancelled = true; };
  }, [isPending, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await apiFetch("/api/auth/update-profile", {
        method: "PUT",
        body: JSON.stringify({ name: formData.name }),
      });
      if (res.success) {
        toast.success("Profile updated successfully");
        setSaved(true);
        const storedUser = JSON.parse(localStorage.getItem("legalease_user") || "{}");
        const updatedUser = { ...storedUser, name: formData.name };
        localStorage.setItem("legalease_user", JSON.stringify(updatedUser));
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <div className="h-32 w-32 bg-gray-200 rounded-2xl mx-auto" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 w-40 bg-gray-200 rounded-xl mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Update Profile</h1>
        <p className="text-gray-500 mt-1">Edit your personal information and profile picture</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-[#1B2A4A]/5 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#1B2A4A]/30">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={24} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-3">Click to change profile photo</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1B2A4A] hover:bg-[#243A5E] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle size={18} />
                Profile Updated!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}