"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  MessageSquare,
  Edit3,
  Trash2,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";

export default function UserCommentsPage() {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchComments = async () => {
      try {
        const res = await apiFetch("/api/comments/my-comments");
        if (!cancelled && res.success) {
          const mapped = (res.data || []).map((c) => ({
            _id: c._id,
            lawyerName: c.lawyerName || "Unknown",
            lawyerSpecialization: c.lawyerSpecialization || "N/A",
            text: c.text,
            rating: c.rating,
            date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A",
          }));
          setComments(mapped);
        }
      } catch (err) {
        
      
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchComments();
    return () => { cancelled = true; };
  }, []);

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await apiFetch(`/api/comments/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({ text: editText, rating: comments.find((c) => c._id === editingId)?.rating }),
      });
      if (res.success) {
        toast.success("Comment updated successfully");
        setComments((prev) =>
          prev.map((c) => (c._id === editingId ? { ...c, text: editText } : c))
        );
        setEditingId(null);
        setEditText("");
      } else {
        toast.error(res.message || "Failed to update comment");
      }
    } catch (err) {
      toast.error("Failed to update comment");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      if (res.success) {
        toast.success("Comment deleted successfully");
        setComments((prev) => prev.filter((c) => c._id !== id));
        setDeleteId(null);
      } else {
        toast.error(res.message || "Failed to delete comment");
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]">My Comments</h1>
        <p className="text-gray-500 mt-1">View and manage your reviews on lawyer profiles</p>
      </div>

      {comments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">No Comments Yet</h3>
          <p className="text-gray-500 text-sm">
            Your reviews will appear here after you hire and comment on a lawyer.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, i) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1B2A4A]">{comment.lawyerName}</h3>
                  <p className="text-xs text-[#D4A843] font-medium">{comment.lawyerSpecialization}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{comment.date}</span>
                  <button
                    onClick={() => handleEdit(comment)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1B2A4A] hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(comment._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {editingId === comment._id ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#1B2A4A] text-white rounded-lg hover:bg-[#243A5E] transition-colors"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {}
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
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Delete Comment?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This action cannot be undone. The comment will be permanently removed.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
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