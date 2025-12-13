import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProjects() {
  const { API_URL, authHeaders, showToast } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // {mode, data}
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    tech: "",
    demo: "",
    code: "",
  });

  const fetchProjects = async () => {
    if (!API_URL) {
      showToast("Backend URL not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/projects`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      showToast("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (modal?.data) {
      setForm({
        title: modal.data.title || "",
        description: modal.data.description || "",
        image: modal.data.image || "",
        tech: modal.data.tech || "",
        demo: modal.data.demo || "",
        code: modal.data.code || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        image: "",
        tech: "",
        demo: "",
        code: "",
      });
    }
  }, [modal]);

  const saveProject = async () => {
    // Validation
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
        ? `${API_URL}/api/admin/projects`
        : `${API_URL}/api/admin/projects/${modal.data.id}`;

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
      fetchProjects();
    } catch (err) {
      console.error("Save error:", err);
      showToast(err.message || "Save failed");
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;

    if (!API_URL) {
      showToast("Backend URL not configured");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/projects/${id}`, {
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
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <button
          onClick={() => setModal({ mode: "add", data: null })}
          className="px-3 py-1 rounded-lg bg-purple text-white text-xs hover:bg-purple/80"
        >
          + Add Project
        </button>
      </div>

      {loading && <p className="text-xs text-gray-400">Loading...</p>}

      <div className="grid gap-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-dark-200 rounded-xl p-4 border border-dark-100 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-white">{p.title}</p>
              <p className="text-gray-400 text-xs">{p.description}</p>
              <p className="text-purple text-xs mt-1">{p.tech}</p>
              <div className="flex gap-3 text-[11px] mt-1">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    Demo
                  </a>
                )}
                {p.code && (
                  <a
                    href={p.code}
                    target="_blank"
                    className="text-green-400 underline"
                  >
                    Code
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setModal({ mode: "edit", data: p })}
                className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && projects.length === 0 && (
          <p className="text-xs text-gray-400">No projects yet.</p>
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
                {modal.mode === "add" ? "Add Project" : "Edit Project"}
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
                placeholder="Tech (comma separated)"
                value={form.tech}
                onChange={(e) =>
                  setForm({ ...form, tech: e.target.value })
                }
              />
              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />
              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Demo URL"
                value={form.demo}
                onChange={(e) =>
                  setForm({ ...form, demo: e.target.value })
                }
              />
              <input
                className="w-full bg-dark-100 border border-dark-50 px-3 py-2 rounded-md text-xs text-white"
                placeholder="Code URL"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
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
                  onClick={saveProject}
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
