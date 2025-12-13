import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      window.location.href = "/admin";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!API_URL) {
      setErrorMsg("Backend URL is not configured. Please contact the administrator.");
      return;
    }

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.message || "You are NOT Admin 😼");
        return;
      }

      if (!data.token) {
        setErrorMsg("No token received from server.");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin";
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-300 px-4">
      <div className="max-w-md w-full bg-dark-200 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-white">
          Admin Login
        </h1>
        <p className="text-sm text-center text-gray-400">
          Only <span className="text-purple font-semibold">Dnyanu Admin</span> is allowed here 😉
        </p>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/60 text-red-200 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
            <span className="text-lg">🚫</span>
            <div>
              <p className="font-semibold">Access Denied</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-dark-100 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-dark-100 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-purple text-white font-semibold py-2 rounded-lg hover:bg-purple/90 transition shadow-md"
          >
            Login as Admin
          </button>
        </form>

        <p className="text-xs text-center text-gray-500">
          If you're not the right admin…{" "}
          <span className="text-red-300 font-semibold">You are NOT Admin 😼</span>
        </p>
      </div>
    </div>
  );
}
