import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", { email, password });

      const { token, user, redirectTo } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("role", user.role);

      if (user.role === "Customer" && user.position) {
        localStorage.setItem("position", user.position);
      } else {
        localStorage.removeItem("position");
      }

      navigate(redirectTo || "/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f7f7] via-[#d0f0f0] to-[#b2eaea] px-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-6 text-center text-[#0b7b7b]">
            Login
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium text-[#0b7b7b]">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-[#0b7b7b]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                className="w-full border border-gray-300 p-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0b7b7b] text-white py-3 rounded-lg hover:bg-[#095f5f] transition text-base font-medium"
          >
            Login
          </button>

          <p className="text-center text-sm mt-4 text-[#0b7b7b]">
            Create account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
