import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSkills() {
  const { API_URL, authHeaders, showToast } = useOutletContext();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const fetchSkills = async () => {
    if (!API_URL) {
      showToast("Backend URL not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/skills`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setSkills(data.data || []);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      showToast("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (modal?.data) {
      setForm({
        title: modal.data.title || "",
        description: modal.data.description || "",
        tags: modal.data.tags || "",
      });
    } else {
      setForm({ title: "", description: "", tags: "" });
    }
  }, [modal]);

  const saveSkill = async () => {
    if (!form.title || !form.description) {
      showToast("Title and description are required");
      return;
    }

    if (!API_URL) {
      showToast("Backend URL not configured");
      return;
    }

    const method = modal.mode === "add" ? "POST" : "PUT";
    const url =
      modal.mode === "add"
        ? `${API_URL}/api/admin/skills`
        : `${API_URL}/api/admin/skills/${modal.data.id}`;
    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to save");
      }
      showToast("Saved");
      setModal(null);
      fetchSkills();
    } catch (err) {
      console.error("Save error:", err);
      showToast(err.message || "Save failed");
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm("Delete this skill?")) return;

    if (!API_URL) {
      showToast("Backend URL not configured");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/skills/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete");
      }
      showToast("Deleted");
      fetchSkills();
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Skills</h2>
        <button
          onClick={() => setModal({ mode: "add", data: null })}
          className="px-3 py-1 rounded-lg bg-purple text-white text-xs hover:bg-purple/80"
        >
          + Add Skill
        </button>
      </div>

      {loading && <p className="text-xs text-gray-400">Loading...</p>}

      <div className="grid gap-3">
        {skills.map((s) => (
          <div
            key={s.id}
            className="bg-dark-200 rounded-xl p-4 border border-dark-100 flex items-start justify-between gap-3 text-sm"
          >
            <div>
              <p className="font-semibold text-white">{s.title}</p>
              <p className="text-gray-400 text-xs">{s.description}</p>
              <p className="text-blue-400 text-xs mt-1">{s.tags}</p>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setModal({ mode: "edit", data: s })}
                className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSkill(s.id)}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && skills.length === 0 && (
          <p className="text-xs text-gray-400">No skills yet.</p>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-dark-200 rounded-2xl p-6 w-full max-w-md space-y-3"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold text-white">
                {modal.mode === "add" ? "Add Skill" : "Edit Skill"}
              </h3>
              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
              <textarea
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  onClick={() => setModal(null)}
                  className="px-3 py-1 rounded-lg bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSkill}
                  className="px-3 py-1 rounded-lg bg-purple text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
