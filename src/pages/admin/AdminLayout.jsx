import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// --------- Simple Toast Component ----------
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-purple text-white text-sm px-4 py-2 rounded-lg shadow-lg">
        {message}
      </div>
    </div>
  );
}

// --------- Layout Component ----------
export default function AdminLayout() {
  const [toast, setToast] = useState("");
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    // Fetch quick stats for dashboard cards
    const fetchStats = async () => {
      try {
        const [p, s, a, w, c] = await Promise.all([
          fetch(`${API_URL}/api/admin/projects`, {
            headers: authHeaders,
          }).then((r) => r.json()),
          fetch(`${API_URL}/api/admin/skills`, {
            headers: authHeaders,
          }).then((r) => r.json()),
          fetch(`${API_URL}/api/admin/about`, {
            headers: authHeaders,
          }).then((r) => r.json()),
          fetch(`${API_URL}/api/admin/work`, {
            headers: authHeaders,
          }).then((r) => r.json()),
          fetch(`${API_URL}/api/admin/contacts`, {
            headers: authHeaders,
          }).then((r) => r.json()),
        ]);

        setStats({
          projects: p.data?.length || 0,
          skills: s.data?.length || 0,
          about: a.data?.length || 0,
          work: w.data?.length || 0,
          contacts: c.data?.length || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const navItems = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/projects", label: "Projects" },
    { to: "/admin/skills", label: "Skills" },
    { to: "/admin/about", label: "About" },
    { to: "/admin/work", label: "Work" },
    { to: "/admin/contacts", label: "Contacts" },
  ];

  return (
    <div className="min-h-screen flex bg-dark-300 text-gray-100">
      <Toast message={toast} />

      {/* Sidebar */}
      <aside className="w-64 bg-dark-400 border-r border-dark-100 hidden md:flex flex-col">
        <div className="px-6 py-4 border-b border-dark-100">
          <h1 className="text-xl font-bold text-purple">Dnyaneshwar Panchal</h1>
          <p className="text-xs text-gray-400">
            Logged in as <span className="text-purple">Dnyanu</span>
          </p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  active
                    ? "bg-purple text-white"
                    : "text-gray-300 hover:bg-dark-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-dark-100">
          <button
            onClick={logout}
            className="w-full px-3 py-2 rounded-lg bg-red-600 text-xs hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-dark-100 bg-dark-300">
          <span className="text-sm font-semibold text-white">
            Portfolio Admin
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 rounded-lg bg-red-600 text-xs hover:bg-red-500"
          >
            Logout
          </button>
        </header>

        {/* Main */}
        <main className="px-4 md:px-8 py-6 space-y-6">
          {/* Stats on overview route */}
          {location.pathname === "/admin" && stats && (
            <OverviewCards stats={stats} />
          )}

          {/* Nested pages */}
          <Outlet
            context={{
              API_URL,
              authHeaders,
              showToast,
            }}
          />
        </main>
      </div>
    </div>
  );
}

// --------- Overview Cards -----------
function OverviewCards({ stats }) {
  const cards = [
    { label: "Projects", value: stats.projects, color: "text-purple" },
    { label: "Skills", value: stats.skills, color: "text-blue-400" },
    { label: "About Cards", value: stats.about, color: "text-pink-400" },
    { label: "Work Experience", value: stats.work, color: "text-yellow-400" },
    { label: "Messages", value: stats.contacts, color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((c) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-dark-200 rounded-2xl p-4 shadow"
        >
          <p className="text-xs text-gray-400">{c.label}</p>
          <p className={`text-2xl font-bold mt-2 ${c.color}`}>{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
