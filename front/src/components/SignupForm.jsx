import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";

const SignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        setSuccess("Signup successful! Redirecting to login...");
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Customer Signup</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md">{error}</div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded-md">{success}</div>
      )}

      {/* form inputs */}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full border p-3 rounded-md"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full border p-3 rounded-md"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          name="password"
          required
          className="w-full border p-3 rounded-md"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          required
          className="w-full border p-3 rounded-md"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Sign Up
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
