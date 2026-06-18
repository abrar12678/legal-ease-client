"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Shield,
  Trash2,
  X,
  AlertTriangle,
  Ban,
  CheckCircle2,
} from "lucide-react";

const ROLE_COLORS = {
  client: "bg-blue-100 text-blue-700",
  lawyer: "bg-green-100 text-green-700",
  admin: "bg-purple-100 text-purple-700",
};

const ROLES = ["client", "lawyer", "admin"];

// Backend stores "user" but we display "client"
function displayRole(role) {
  return role === "user" ? "client" : role;
}

export default function ManageUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [changeRoleId, setChangeRoleId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await apiFetch("/api/admin/users");
        if (res.success) {
          const rawUsers = res.data.users || [];
          // Normalize "user" → "client" for consistent display & filtering
          const normalized = rawUsers.map((u) => ({
            ...u,
            role: displayRole(u.role),
          }));
          setUsers(normalized);
          setRoleCounts(res.data.roleCounts || {});
        }
      } catch (err) {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentState) => {
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !currentState }),
      });
      if (res.success) {
        toast.success(`User ${!currentState ? "blocked" : "unblocked"} successfully`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: !currentState } : u))
        );
      } else {
        toast.error(res.message || "Failed to update user status");
      }
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      if (res.success) {
        toast.success(`Role updated to ${newRole} successfully`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setChangeRoleId(null);
      } else {
        toast.error(res.message || "Failed to update role");
      }
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.success) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setDeleteId(null);
      } else {
        toast.error(res.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "all" || displayRole(u.role) === roleFilter;
    const matchSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="bg-white rounded-2xl p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">Manage Users</h1>
        <p className="text-gray-500 mt-1">View all users, change roles, and manage accounts</p>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "client", "lawyer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  roleFilter === r
                    ? "bg-[#1B2A4A] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {r} {r !== "all" && `(${roleCounts[r] || 0})`}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Users size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No users found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#1B2A4A]/5 flex items-center justify-center text-[#1B2A4A] text-sm font-bold shrink-0">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-[#1B2A4A] block truncate">{user.name}</span>
                          {user.isBlocked && (
                            <span className="text-[11px] text-red-500 font-medium">Blocked</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            user.isBlocked
                              ? "text-green-600 hover:bg-green-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {user.isBlocked ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => setChangeRoleId(user._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1B2A4A] hover:bg-[#1B2A4A]/5 rounded-lg transition-colors"
                          title="Change Role"
                        >
                          <Shield size={13} /> Role
                        </button>
                        <button
                          onClick={() => setDeleteId(user._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {users.length} users</p>
        </div>
      </motion.div>

      {/* Change Role Modal */}
      <AnimatePresence>
        {changeRoleId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setChangeRoleId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#1B2A4A]">Change Role</h3>
                <button onClick={() => setChangeRoleId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Select new role for <span className="font-semibold text-[#1B2A4A]">{users.find((u) => u._id === changeRoleId)?.name}</span>:
              </p>
              <div className="space-y-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleChangeRole(changeRoleId, role)}
                    disabled={users.find((u) => u._id === changeRoleId)?.role === role}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors capitalize ${
                      users.find((u) => u._id === changeRoleId)?.role === role
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 text-gray-700 hover:bg-[#1B2A4A]/5 hover:text-[#1B2A4A]"
                    }`}
                  >
                    <span className="flex items-center gap-2 capitalize">{role}</span>
                    {users.find((u) => u._id === changeRoleId)?.role === role && (
                      <span className="text-xs text-gray-400">Current</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Delete User?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This will permanently remove <span className="font-semibold">{users.find((u) => u._id === deleteId)?.name}</span> and all their data.
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors">
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