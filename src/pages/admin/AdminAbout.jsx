import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAbout() {
  const { API_URL, authHeaders, showToast } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode, data }
  const [form, setForm] = useState({
    title: "",
    description: "",
    color: "text-purple",
  });

  const fetchAbout = async () => {
    if (!API_URL) {
      showToast("Backend URL not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/about`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error("Failed to fetch about:", err);
      showToast("Failed to load about cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  useEffect(() => {
    if (modal?.data) {
      setForm({
        title: modal.data.title || "",
        description: modal.data.description || "",
        color: modal.data.color || "text-purple",
      });
    } else {
      setForm({
        title: "",
        description: "",
        color: "text-purple",
      });
    }
  }, [modal]);

  const saveAbout = async () => {
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
        ? `${API_URL}/api/admin/about`
        : `${API_URL}/api/admin/about/${modal.data.id}`;

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
      fetchAbout();
    } catch (err) {
      console.error("Save error:", err);
      showToast(err.message || "Save failed");
    }
  };

  const deleteAbout = async (id) => {
    if (!confirm("Delete this about card?")) return;

    if (!API_URL) {
      showToast("Backend URL not configured");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/about/${id}`, {
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
      fetchAbout();
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.message || "Delete failed");
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
        <h2 className="text-lg font-semibold">About Cards</h2>
        <button
          onClick={() => setModal({ mode: "add", data: null })}
          className="px-3 py-1 rounded-lg bg-purple text-white text-xs hover:bg-purple/80"
        >
          + Add About Card
        </button>
      </div>

      {loading && <p className="text-xs text-gray-400">Loading...</p>}

      <div className="grid gap-3">
        {items.map((a) => (
          <div
            key={a.id}
            className="bg-dark-200 rounded-xl p-4 border border-dark-100 flex items-start justify-between gap-3 text-sm"
          >
            <div>
              <p className="font-semibold text-white">{a.title}</p>
              <p className="text-gray-400 text-xs">{a.description}</p>
              <p className={`${a.color} text-xs mt-1`}>{a.color}</p>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setModal({ mode: "edit", data: a })}
                className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
              >
                Edit
              </button>
              <button
                onClick={() => deleteAbout(a.id)}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-xs text-gray-400">No about cards yet.</p>
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
                {modal.mode === "add" ? "Add About Card" : "Edit About Card"}
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
                  onClick={saveAbout}
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
