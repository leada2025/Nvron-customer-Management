import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/Axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  LogIn,
} from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState(
    localStorage.getItem("rememberMe") ? localStorage.getItem("email") || "" : ""
  );
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(!!localStorage.getItem("rememberMe"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (remember) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }
  }, [remember, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user, redirectTo } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user._id);

      if (remember) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      if (user.role === "Customer" && user.position) {
        localStorage.setItem("position", user.position);
      } else {
        localStorage.removeItem("position");
      }

      navigate(redirectTo || "/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#e6f7f7] via-[#d0f0f0] to-[#b2eaea] px-4 py-8">
      
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/fishman.png"
          alt="Fishman Logo"
          className="h-20 md:h-24 object-contain transition-transform duration-300 scale-350"
        />
      </div>

      {/* Login Box */}
      <div className="w-full max-w-md bg-white bg-opacity-95 p-6 md:p-8 rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0b7b7b]">
            Login
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-md text-sm text-center transition-all duration-300">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b7b7b] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b7b7b] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-[#0b7b7b] underline hover:text-[#095f5f]"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[#0b7b7b] text-white py-3 rounded-lg hover:bg-[#095f5f] disabled:opacity-50 transition font-semibold flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
