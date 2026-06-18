"use client";

import { useState, useEffect } from "react";
import { useSession, apiFetch } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  UserCog,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Camera,
  AlertTriangle,
  DollarSign,
  Briefcase,
} from "lucide-react";

const SPECIALIZATIONS = [
  "Criminal Law",
  "Corporate Law",
  "Family Law",
  "Immigration Law",
  "Real Estate Law",
  "Tax Law",
  "Civil Litigation",
  "Employment Law",
  "Intellectual Property",
  "Personal Injury",
  "Bankruptcy",
  "Constitutional Law",
];

export default function ManageLegalProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", fee: "", specialization: "Criminal Law" });
  const [profileImage, setProfileImage] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    specialization: "Criminal Law",
    bio: "",
    hourlyRate: "",
    phone: "",
    barLicenseNumber: "",
    experience: "",
    education: "",
    languages: "",
    location: "",
    city: "",
    achievements: "",
  });

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/api/lawyers/profile");
        if (!cancelled && res.success && res.data) {
          const p = res.data;
          setProfileForm({
            name: p.name || user?.name || "",
            specialization: p.specialization || "Criminal Law",
            bio: p.bio || "",
            hourlyRate: p.hourlyRate?.toString() || "",
            phone: p.phone || "",
            barLicenseNumber: p.barLicenseNumber || "",
            experience: p.experience?.toString() || "",
            education: Array.isArray(p.education) ? p.education.join(", ") : (p.education || ""),
            languages: Array.isArray(p.languages) ? p.languages.join(", ") : (p.languages || ""),
            location: p.location || "",
            city: p.city || "",
            achievements: Array.isArray(p.achievements) ? p.achievements.join(", ") : (p.achievements || ""),
          });
        } else if (!cancelled) {
          setProfileForm((prev) => ({
            ...prev,
            name: user?.name || "",
          }));
        }
      } catch (err) {
        if (!cancelled) {
          setProfileForm((prev) => ({
            ...prev,
            name: user?.name || "",
          }));
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

  const openAddModal = () => {
    toast.info("Service management coming soon!");
    return;
    setEditingService(null);
    setForm({ name: "", description: "", fee: "", specialization: "Criminal Law" });
    setShowServiceModal(true);
  };

  const openEditModal = (service) => {
    toast.info("Service management coming soon!");
    return;
    setEditingService(service);
    setForm({ name: service.name, description: service.description, fee: String(service.fee), specialization: service.specialization });
    setShowServiceModal(true);
  };

  const handleSaveService = () => {
    if (!form.name || !form.fee) return;
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, name: form.name, description: form.description, fee: Number(form.fee), specialization: form.specialization }
            : s
        )
      );
    } else {
      const newService = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        fee: Number(form.fee),
        specialization: form.specialization,
      };
      setServices((prev) => [...prev, newService]);
    }
    setShowServiceModal(false);
  };

  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const body = {
        name: profileForm.name,
        specialization: profileForm.specialization,
        bio: profileForm.bio,
        hourlyRate: Number(profileForm.hourlyRate) || 0,
        phone: profileForm.phone,
        barLicenseNumber: profileForm.barLicenseNumber,
        experience: Number(profileForm.experience) || 0,
        education: profileForm.education ? profileForm.education.split(",").map((s) => s.trim()).filter(Boolean) : [],
        languages: profileForm.languages ? profileForm.languages.split(",").map((s) => s.trim()).filter(Boolean) : ["English"],
        location: profileForm.location,
        city: profileForm.city,
        achievements: profileForm.achievements ? profileForm.achievements.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      const res = await apiFetch("/api/lawyers/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (res.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-8 h-64" />
        <div className="bg-white rounded-2xl p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Manage Legal Profile</h1>
        <p className="text-gray-500 mt-1">Update your profile information and manage your legal services</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
      >
        <h3 className="text-lg font-bold text-[#1B2A4A] mb-5 flex items-center gap-2">
          <UserCog size={20} />
          Profile Information
        </h3>
        <div className="flex flex-col sm:flex-row items-start gap-8">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="relative group w-32 h-32">
              <div className="w-32 h-32 rounded-2xl bg-[#1B2A4A]/5 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-[#1B2A4A]/30">{profileForm.name.charAt(0)?.toUpperCase() || "L"}</span>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={24} className="text-white" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Click to upload (imgBB)</p>
          </div>

          {/* Profile Form */}
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                <select
                  value={profileForm.specialization}
                  onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20"
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Fee ($)</label>
                <input
                  type="number"
                  value={profileForm.hourlyRate}
                  onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B2A4A] hover:bg-[#243A5E] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {profileSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1B2A4A] flex items-center gap-2">
            <Briefcase size={20} />
            Legal Services ({services.length})
          </h3>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#1B2A4A] text-white rounded-xl hover:bg-[#243A5E] transition-colors"
          >
            <Plus size={16} /> Add Service
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {services.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No services listed</p>
              <p className="text-gray-400 text-sm mt-1">Add your first legal service to get started</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#1B2A4A]">{service.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{service.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs text-[#D4A843] font-semibold">
                      <DollarSign size={12} /> {service.fee}/hr
                    </span>
                    <span className="text-xs text-gray-400">{service.specialization}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(service)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(service.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowServiceModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#1B2A4A]">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h3>
                <button onClick={() => setShowServiceModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Criminal Defense"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe this legal service..."
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee ($/hr)</label>
                    <input
                      type="number"
                      value={form.fee}
                      onChange={(e) => setForm({ ...form, fee: e.target.value })}
                      placeholder="150"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                    <select
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20"
                    >
                      {SPECIALIZATIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveService}
                  disabled={!form.name || !form.fee}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#1B2A4A] text-white rounded-xl hover:bg-[#243A5E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingService ? "Update" : "Add"} Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Delete Service?</h3>
                <p className="text-sm text-gray-500 mb-6">This service will be permanently removed from your profile.</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleDeleteService(deleteId)} className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}