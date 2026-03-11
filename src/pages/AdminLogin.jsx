import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, User, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Invalid admin credentials");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-stone-900 p-10 rounded-[2.5rem] shadow-2xl shadow-stone-300 border border-stone-800">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-800 rounded-2xl mb-6">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">ADMIN PANEL</h1>
            <p className="text-stone-500 text-sm font-medium">Restricted access for authorized personnel</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-900/20 text-red-400 text-xs font-bold rounded-2xl border border-red-900/30 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-stone-800 border border-stone-700 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-sm font-medium text-white placeholder:text-stone-600"
                  placeholder="admin_username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-stone-800 border border-stone-700 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-sm font-medium text-white placeholder:text-stone-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-stone-900 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-stone-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 group"
            >
              <span>{loading ? "Authenticating..." : "Access Dashboard"}</span>
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-stone-800 text-center">
            <Link 
              to="/login" 
              className="text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
            >
              Return to User Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
