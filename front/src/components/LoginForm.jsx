import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";

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
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // On success, server returns token, role, name
      const { token, role, name } = res.data;

      // Save token & user info to localStorage or context/state
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
   
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md">{error}</div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full border p-3 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Password</label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            required
            className="w-full border p-3 rounded-md pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </button>

      <p className="text-center text-sm mt-4">
        Create account?{" "}
        <a href="/" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
