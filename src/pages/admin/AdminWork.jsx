import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminWork() {
  const { API_URL, authHeaders, showToast } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
    color: "text-purple",
  });

  const fetchWork = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/work`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load work experience");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWork();
  }, []);

  useEffect(() => {
    if (modal?.data) {
      setForm({
        role: modal.data.role || "",
        company: modal.data.company || "",
        duration: modal.data.duration || "",
        description: modal.data.description || "",
        color: modal.data.color || "text-purple",
      });
    } else {
      setForm({
        role: "",
        company: "",
        duration: "",
        description: "",
        color: "text-purple",
      });
    }
  }, [modal]);

  const saveWork = async () => {
    const method = modal.mode === "add" ? "POST" : "PUT";
    const url =
      modal.mode === "add"
        ? `${API_URL}/api/admin/work`
        : `${API_URL}/api/admin/work/${modal.data.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      showToast("Saved");
      setModal(null);
      fetchWork();
    } catch (err) {
      console.error(err);
      showToast("Save failed");
    }
  };

  const deleteWork = async (id) => {
    if (!confirm("Delete this work experience?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/work/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      showToast("Deleted");
      fetchWork();
    } catch (err) {
      console.error(err);
      showToast("Delete failed");
    }
  };

  const colorOptions = [
    "text-purple",
    "text-pink",
    "text-blue",
    "text-yellow-400",
    "text-green-400",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Work Experience</h2>
        <button
          onClick={() => setModal({ mode: "add", data: null })}
          className="px-3 py-1 rounded-lg bg-purple text-white text-xs hover:bg-purple/80"
        >
          + Add Work
        </button>
      </div>

      {loading && <p className="text-xs text-gray-400">Loading...</p>}

      <div className="grid gap-3">
        {items.map((w) => (
          <div
            key={w.id}
            className="bg-dark-200 rounded-xl p-4 border border-dark-100 flex items-start justify-between gap-3 text-sm"
          >
            <div>
              <p className="font-semibold text-white">
                {w.role} @ {w.company}
              </p>
              <p className="text-gray-400 text-xs">{w.duration}</p>
              <p className="text-gray-300 text-xs mt-1">{w.description}</p>
              <p className={`${w.color} text-[11px] mt-1`}>{w.color}</p>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setModal({ mode: "edit", data: w })}
                className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
              >
                Edit
              </button>
              <button
                onClick={() => deleteWork(w.id)}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-xs text-gray-400">No work experience yet.</p>
        )}
      </div>

      {/* Modal */}
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
                {modal.mode === "add" ? "Add Work Experience" : "Edit Work Experience"}
              </h3>

              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Role"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              />
              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Company"
                value={form.company}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
              />
              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Duration (e.g. 2024 - Present)"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
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

              <div className="space-y-1">
                <p className="text-xs text-gray-400">Color class</p>
                <select
                  className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                  value={form.color}
                  onChange={(e) =>
                    setForm({ ...form, color: e.target.value })
                  }
                >
                  {colorOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  onClick={() => setModal(null)}
                  className="px-3 py-1 rounded-lg bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveWork}
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
