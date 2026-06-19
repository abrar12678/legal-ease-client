"use client";

import { useState, useEffect } from "react";
import { useSession, apiFetch } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save, CheckCircle, Loader2 } from "lucide-react";

export default function UpdateProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Populate form from session data (no extra API call needed)
  useEffect(() => {
    if (!isPending && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      });
      if (user.image) {
        setPreviewImage(user.image);
      }
      setLoading(false);
    }
    if (!isPending && !user) {
      setLoading(false);
    }
  }, [isPending, user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    // Upload to imgBB
    setUploading(true);
    try {
      const imgData = new FormData();
      imgData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
        { method: "POST", body: imgData }
      );

      const data = await res.json();
      if (data.success) {
        const imageUrl = data.data.display_url;
        setPreviewImage(imageUrl);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      }
    } catch (err) {
      // silently fail — preview still works locally
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await apiFetch("/api/users/update-profile", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
        }),
      });
      if (res.success) {
        setSaved(true);
        // Refresh session so Navbar shows updated name
        refetch();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto" />
        <div className="bg-white rounded-2xl p-8 space-y-6 max-w-2xl mx-auto">
          <div className="h-32 w-32 bg-gray-200 rounded-2xl mx-auto" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 w-40 bg-gray-200 rounded-xl mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Update Profile</h1>
        <p className="text-gray-500 mt-1">Edit your personal information and profile picture</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-[#1B2A4A]/5 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#1B2A4A]/30">
                  {formData.name.charAt(0).toUpperCase() || "U"}
                </span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                  <Loader2 size={28} className="text-white animate-spin" />
                </div>
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
                placeholder="Enter your full name"
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
            disabled={saving || !formData.name.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1B2A4A] hover:bg-[#243A5E] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
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