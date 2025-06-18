import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }

    const timer = setTimeout(() => {
      navigate("/products");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleStart = () => {
    navigate("/products");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#e0f7fa] to-white flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto bg-white p-10 sm:p-16 rounded-2xl shadow-2xl text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-[#0b7b7b] uppercase mb-6">
          Welcome
        </h1>

        {name && (
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 uppercase tracking-wide mb-4">
            {name}
          </h2>
        )}

        <p className="text-gray-600 mb-8 text-lg">We’re glad to see you back 🎉</p>

        <button
          onClick={handleStart}
          className="bg-[#0b7b7b] text-white px-10 py-3 rounded-xl text-lg font-medium hover:bg-[#095f5f] transition duration-200"
        >
          Get Started
        </button>

        <p className="text-sm text-gray-400 mt-6">Redirecting in 5 seconds...</p>
      </div>
    </div>
  );
};

export default WelcomePage;
