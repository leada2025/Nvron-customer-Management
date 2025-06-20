import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [showSupportForm, setShowSupportForm] = useState(false); // NEW
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
      localStorage.setItem("userId", user._id);

      if (user.role === "Customer" && user.position) {
        localStorage.setItem("position", user.position);
      } else {
        localStorage.removeItem("position");
      }

      navigate(redirectTo || "/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e6f7f7] via-[#d0f0f0] to-[#b2eaea] px-4 py-10 space-y-10">
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
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowSupportForm(true)}
            className="text-sm text-[#0b7b7b] underline hover:text-[#095f5f]"
          >
            Forgot your password? Click here to raise a support ticket
          </button>
        </div>
      </div>

      {/* Zoho Support Form - Shown only when user clicks the link */}
      {showSupportForm && (
        <div className="w-full max-w-2xl bg-white p-4 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-[#0b7b7b] mb-3">
            Submit a Support Ticket
          </h3>
          <iframe
            id="zsfeedbackFrame"
            width="100%"
            height="600"
            name="zsfeedbackFrame"
            scrolling="no"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://desk.zoho.in/support/fbw?formType=AdvancedWebForm&fbwId=edbsnfd683d940e08de6d3d6fcd82b7d2d1cffccd0703247a251850960183969be48f&xnQsjsdp=edbsn86faf6f9c4ce0f9a3e47a9f7f4011f09&mode=showNewWidget&displayType=iframe"
            title="Zoho Desk Support Form"
          />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
