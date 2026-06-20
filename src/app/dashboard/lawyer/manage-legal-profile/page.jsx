"use client";

import { useState, useEffect, useRef } from "react";
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
  Phone,
  Award,
  GraduationCap,
  MapPin,
  Globe,
  Hash,
  Clock,
  Upload,
  Loader2,
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

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";


const dbToForm = (p, fallbackName = "") => ({
  name: p.name || fallbackName || "",
  specialization: p.specialization || "Criminal Law",
  bio: p.bio || "",
  hourlyRate: p.hourlyRate?.toString() || "",
  phone: p.phone || "",
  barLicenseNumber: p.barLicenseNumber || "",
  experience: p.experience?.toString() || "",
  education: Array.isArray(p.education) ? p.education.join(", ") : "",
  languages: Array.isArray(p.languages) ? p.languages.join(", ") : "",
  location: p.location || "",
  city: p.city || "",
  achievements: Array.isArray(p.achievements) ? p.achievements.join(", ") : "",
});

export default function ManageLegalProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    fee: "",
    specialization: "Criminal Law",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  const [originalProfile, setOriginalProfile] = useState(null);

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
          
          setOriginalProfile(p);
          setProfileForm(dbToForm(p, user?.name));
          setProfileImage(p.image || null);
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

    const fetchServices = async () => {
      try {
        const res = await apiFetch("/api/lawyers/services");
        if (!cancelled && res.success) {
          setServices(res.data || []);
        }
      } catch {
        
      }
    };

    if (!isPending) {
      fetchProfile();
      fetchServices();
    }
    return () => {
      cancelled = true;
    };
  }, [isPending, user]);

  const openAddModal = () => {
    setEditingService(null);
    setForm({ name: "", description: "", fee: "", specialization: "Criminal Law" });
    setShowServiceModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      name: service.name || "",
      description: service.description || "",
      fee: service.fee?.toString() || "",
      specialization: service.specialization || "Criminal Law",
    });
    setShowServiceModal(true);
  };

  const handleSaveService = async () => {
    if (!form.name.trim() || !form.fee) {
      toast.error("Service name and fee are required");
      return;
    }

    setServiceSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        fee: Number(form.fee) || 0,
        specialization: form.specialization,
      };

      let res;
      if (editingService) {
        res = await apiFetch(`/api/lawyers/services/${editingService._id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        res = await apiFetch("/api/lawyers/services", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      if (res.success) {
        toast.success(editingService ? "Service updated" : "Service added");
        setShowServiceModal(false);
        
        const servicesRes = await apiFetch("/api/lawyers/services");
        if (servicesRes.success) {
          setServices(servicesRes.data || []);
        }
      } else {
        toast.error(res.message || "Failed to save service");
      }
    } catch {
      toast.error("Failed to save service");
    } finally {
      setServiceSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await apiFetch(`/api/lawyers/services/${id}`, {
        method: "DELETE",
      });
      if (res.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        toast.success("Service deleted");
      } else {
        toast.error(res.message || "Failed to delete service");
      }
    } catch {
      toast.error("Failed to delete service");
    }
    setDeleteId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        setProfileImage(data.data.display_url);
        toast.success("Image uploaded");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  
  const formToDb = () => ({
    name: profileForm.name.trim(),
    specialization: profileForm.specialization,
    bio: profileForm.bio.trim(),
    hourlyRate: Number(profileForm.hourlyRate) || 0,
    phone: profileForm.phone.trim(),
    barLicenseNumber: profileForm.barLicenseNumber.trim(),
    experience: Number(profileForm.experience) || 0,
    education: profileForm.education.trim()
      ? profileForm.education.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    languages: profileForm.languages.trim()
      ? profileForm.languages.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    location: profileForm.location.trim(),
    city: profileForm.city.trim(),
    achievements: profileForm.achievements.trim()
      ? profileForm.achievements.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
  });

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setProfileSaving(true);
    try {
      const currentDb = formToDb();

      
      const body = {};
      const orig = originalProfile || {};

      if (currentDb.name !== (orig.name || "")) body.name = currentDb.name;
      if (currentDb.specialization !== (orig.specialization || "Criminal Law")) body.specialization = currentDb.specialization;
      if (currentDb.bio !== (orig.bio || "")) body.bio = currentDb.bio;
      if (currentDb.hourlyRate !== (orig.hourlyRate || 0)) body.hourlyRate = currentDb.hourlyRate;
      if (currentDb.phone !== (orig.phone || "")) body.phone = currentDb.phone;
      if (currentDb.barLicenseNumber !== (orig.barLicenseNumber || "")) body.barLicenseNumber = currentDb.barLicenseNumber;
      if (currentDb.experience !== (orig.experience || 0)) body.experience = currentDb.experience;
      if (JSON.stringify(currentDb.education) !== JSON.stringify(orig.education || [])) body.education = currentDb.education;
      if (JSON.stringify(currentDb.languages) !== JSON.stringify(orig.languages || [])) body.languages = currentDb.languages;
      if (currentDb.location !== (orig.location || "")) body.location = currentDb.location;
      if (currentDb.city !== (orig.city || "")) body.city = currentDb.city;
      if (JSON.stringify(currentDb.achievements) !== JSON.stringify(orig.achievements || [])) body.achievements = currentDb.achievements;

      
      if (profileImage && profileImage !== (orig.image || "")) {
        body.image = profileImage;
      }

      
      if (!body.name) body.name = currentDb.name;

      const res = await apiFetch("/api/lawyers/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (res.success) {
        toast.success("Profile updated successfully");
        
        const fresh = await apiFetch("/api/lawyers/profile");
        if (fresh.success && fresh.data) {
          const p = fresh.data;
          setOriginalProfile(p);
          setProfileForm(dbToForm(p));
          setProfileImage(p.image || null);
        }
        refetch();
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
        <div className="h-8 w-64 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-8 h-96" />
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
      {}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
          Manage Legal Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Update your professional information and manage your legal services
        </p>
      </div>

      {}
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
          {}
          <div className="shrink-0">
            <div className="relative group w-32 h-32">
              <div className="w-32 h-32 rounded-2xl bg-[#1B2A4A]/5 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-[#1B2A4A]/30">
                    {profileForm.name.charAt(0)?.toUpperCase() || "L"}
                  </span>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {imageUploading ? (
                  <Upload size={24} className="text-white animate-pulse" />
                ) : (
                  <Camera size={24} className="text-white" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Click to upload
            </p>
          </div>

          {}
          <div className="flex-1 w-full space-y-4">
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  placeholder="John Smith"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Specialization</label>
                <select
                  value={profileForm.specialization}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      specialization: e.target.value,
                    })
                  }
                  className={inputClass + " bg-white"}
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} /> Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Hash size={13} /> Bar License Number
                  </span>
                </label>
                <input
                  type="text"
                  value={profileForm.barLicenseNumber}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      barLicenseNumber: e.target.value,
                    })
                  }
                  placeholder="e.g. BAR-12345"
                  className={inputClass}
                />
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <DollarSign size={13} /> Hourly Fee ($)
                  </span>
                </label>
                <input
                  type="number"
                  value={profileForm.hourlyRate}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      hourlyRate: e.target.value,
                    })
                  }
                  placeholder="150"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} /> Experience (years)
                  </span>
                </label>
                <input
                  type="number"
                  value={profileForm.experience}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      experience: e.target.value,
                    })
                  }
                  placeholder="10"
                  className={inputClass}
                />
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} /> Location / Address
                  </span>
                </label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="123 Main Street"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} /> City
                  </span>
                </label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, city: e.target.value })
                  }
                  placeholder="New York"
                  className={inputClass}
                />
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={13} /> Education
                  </span>
                </label>
                <input
                  type="text"
                  value={profileForm.education}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      education: e.target.value,
                    })
                  }
                  placeholder="LLB Harvard, JD Yale (comma separated)"
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Separate multiple degrees with commas
                </p>
              </div>
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe size={13} /> Languages
                  </span>
                </label>
                <input
                  type="text"
                  value={profileForm.languages}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      languages: e.target.value,
                    })
                  }
                  placeholder="English, Spanish, Bengali"
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Separate multiple languages with commas
                </p>
              </div>
            </div>

            {}
            <div>
              <label className={labelClass}>Professional Bio</label>
              <textarea
                rows={4}
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                placeholder="Tell clients about your expertise, approach, and what makes you unique..."
                className={inputClass + " resize-none"}
              />
            </div>

            {}
            <div>
              <label className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Award size={13} /> Achievements
                </span>
              </label>
              <input
                type="text"
                value={profileForm.achievements}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    achievements: e.target.value,
                  })
                }
                placeholder="Top 100 Lawyers 2024, Best Attorney Award (comma separated)"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate multiple achievements with commas
              </p>
            </div>

            {}
            <div className="pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B2A4A] hover:bg-[#243A5E] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {profileSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {}
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
              <Briefcase
                size={40}
                className="mx-auto text-gray-300 mb-3"
              />
              <p className="text-gray-500 font-medium">No services listed</p>
              <p className="text-gray-400 text-sm mt-1">
                Add your first legal service to get started
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#1B2A4A]">
                    {service.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs text-[#D4A843] font-semibold">
                      <DollarSign size={12} /> {service.fee}/hr
                    </span>
                    <span className="text-xs text-gray-400">
                      {service.specialization}
                    </span>
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
                    onClick={() => setDeleteId(service._id)}
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

      {}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowServiceModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#1B2A4A]">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h3>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Service Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Corporate Consultation"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Briefly describe this service..."
                    className={inputClass + " resize-none"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Fee per Hour ($) *</label>
                    <input
                      type="number"
                      value={form.fee}
                      onChange={(e) => setForm({ ...form, fee: e.target.value })}
                      placeholder="150"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Specialization</label>
                    <select
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      className={inputClass + " bg-white"}
                    >
                      {SPECIALIZATIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowServiceModal(false)}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveService}
                    disabled={serviceSaving}
                    className="flex-1 py-2.5 text-sm font-semibold bg-[#1B2A4A] text-white hover:bg-[#243A5E] rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {serviceSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    {editingService ? "Update" : "Add Service"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDeleteId(null)}
            />
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
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">
                  Delete Service?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  This service will be permanently removed from your profile.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteService(deleteId)}
                    className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors"
                  >
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
