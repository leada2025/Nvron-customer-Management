import React, { useState } from "react";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../api/Axios";

const SignForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/distributors/signup", formData);
      if (res.status === 201) {
        setModalMessage("✅ Application submitted successfully. Our sales executives will contact you shortly.");
        setModalSuccess(true);
        setModalOpen(true);
        setFormData({ name: "", email: "", phone: "", password: "" });
      }
    } catch (error) {
      const message = error.response?.data?.message || "❌ Signup failed. Please try again.";
      setModalMessage(message);
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f7f7] flex flex-col relative">
      {/* Header */}
       

      {/* Signup Form */}
      <section className="flex justify-center items-center flex-1 px-4 py-10 relative">
        <Link
          to="/distributor-signup"
          className="absolute top-4 right-4 text-[#0b7b7b] text-sm border border-[#0b7b7b] px-3 py-1 rounded hover:bg-[#0b7b7b] hover:text-white transition"
        >
          ← Back
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <h2 className="text-3xl font-extrabold text-[#0b7b7b] mb-2 text-center">
            Become a Distributor
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Join Fishman and start earning while sharing wellness!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "name", icon: <User />, type: "text", placeholder: "Full Name" },
              { name: "email", icon: <Mail />, type: "email", placeholder: "Email Address" },
              { name: "phone", icon: <Phone />, type: "tel", placeholder: "Phone Number" },
              { name: "password", icon: <Lock />, type: "password", placeholder: "Password" },
            ].map((field, i) => (
              <div key={i} className="relative">
                <span className="absolute left-3 top-3 text-gray-400">{field.icon}</span>
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#0b7b7b] text-sm"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-2 bg-[#0b7b7b] text-white text-sm font-semibold rounded-xl hover:bg-[#095e5e] transition shadow-md"
            >
              Submit Application
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            By signing up, you agree to our{" "}
            <span className="text-[#0b7b7b] underline cursor-pointer">Terms</span> and{" "}
            <span className="text-[#0b7b7b] underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </section>

      {/* Popup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <div className="text-3xl mb-3">{modalSuccess ? "✅" : "❌"}</div>
            <p className="text-sm text-gray-700 mb-5">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-[#0b7b7b] text-white rounded hover:bg-[#095e5e] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#e6f7f7] py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Fishman HealthCare. All rights reserved.
      </footer>
    </div>
  );
};

export default SignForm;
