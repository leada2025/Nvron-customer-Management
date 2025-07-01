import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/Axios";
import { Eye, EyeOff, Mail, Lock, Loader2, LogIn } from "lucide-react";

const PartnerLoginForm = () => {
  const [email, setEmail] = useState(localStorage.getItem("rememberMe") ? localStorage.getItem("email") || "" : "");
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

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post("/api/auth/login", { email, password });
    const { token, user } = res.data;

    // ✅ Check if the user is a partner
    if (user.position !== "Partners") {
      setError("Access denied. Only partners can log in here.");
      setLoading(false);
      return;
    }

    // ✅ Allow login for partners only
    localStorage.setItem("token", token);
    localStorage.setItem("name", user.name);
    localStorage.setItem("role", user.role);
    localStorage.setItem("userId", user._id);
    localStorage.setItem("position", "Partners");

    navigate("/products");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e6f7f7] to-[#b2eaea] px-4 py-8">

   <Link
            to="/distributor-signup"
            className="absolute top-4 right-4 text-[#0b7b7b] text-sm border border-[#0b7b7b] px-3 py-1 rounded hover:bg-[#0b7b7b] hover:text-white transition"
          >
            ← Back
          </Link>
      <img
        src="/fishman.png"
        alt="Fishman Logo"
        className="h-40 md:h-48 md:-mt-20 mb-5 object-contain"
      />

      {/* Form box */}
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-2xl -mt-20">
        <form onSubmit={handleLogin} className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0b7b7b]">Partner Login</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center">{error}</div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 w-full border border-gray-300 p-3 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b7b7b] text-white py-3 rounded-lg hover:bg-[#095f5f] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerLoginForm;
