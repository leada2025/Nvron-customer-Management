
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b7b7b] text-white py-6 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left - Logo / Brand */}
        <div className="text-lg font-bold tracking-wide">Fishman HealthCare</div>

        {/* Center - Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0 text-sm">
          <Link to="/products" className="hover:underline hover:text-gray-200 transition">
            Home
          </Link>
          <Link to="/catalog" className="hover:underline hover:text-gray-200 transition">
            Catalogue
          </Link>
          <Link to="/offers" className="hover:underline hover:text-gray-200 transition">
            Offers
          </Link>
          <Link to="/order-historys" className="hover:underline hover:text-gray-200 transition">
            Order History
          </Link>
          <Link to="/request-services" className="hover:underline hover:text-gray-200 transition">
            Support
          </Link>
        </div>

        {/* Right - Tagline or Extra Info */}
        <div className="mt-4 md:mt-0 text-xs text-gray-200 italic">
          Empowering better healthcare solutions.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
