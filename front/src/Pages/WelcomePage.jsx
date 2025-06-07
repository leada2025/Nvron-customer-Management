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
      navigate("/dashboard");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleStart = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <div className="bg-white p-10 md:p-16 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 uppercase mb-4">
          Welcome
        </h1>
        {name && (
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 uppercase tracking-wider mb-4">
            {name}
          </h2>
        )}
        <p className="text-gray-500 mb-6 text-lg">We’re glad to see you back 🎉</p>
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </button>
        <p className="text-sm text-gray-400 mt-3">Redirecting in 5 seconds...</p>
      </div>
    </div>
  );
};

export default WelcomePage;
