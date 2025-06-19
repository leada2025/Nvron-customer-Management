import React from "react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#0b7b7b] mb-4">Thank You!</h1>
        <p className="text-gray-700 mb-6">
          We'll process it shortly.
        </p>
        <Link
          to="/products"
          className="inline-block bg-[#0b7b7b] text-white px-6 py-2 rounded-lg hover:bg-[#095e5e] transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
