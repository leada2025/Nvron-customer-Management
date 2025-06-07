import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b7b7b] text-white py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left - Logo or Company Name */}
        <div className="text-lg font-semibold">© 2025 Nvron</div>

        {/* Center - Navigation Links */}
        <div className="flex space-x-4 mt-3 md:mt-0">
          <Link to="/products" className="hover:underline">
            Products
          </Link>
          <Link to="/order-summary" className="hover:underline">
            Order Summary
          </Link>
          <Link to="/request-services" className="hover:underline">
            Request Services
          </Link>
        </div>

        {/* Right - Optional Message */}
        <div className="mt-3 md:mt-0 text-sm text-gray-400">
          Empowering better business.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
