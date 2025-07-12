import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b7b7b] text-white py-8 px-4 shadow-inner mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <img
            src="/fishman2.png"
            alt="Fishman Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="text-sm italic text-center md:text-left">
            Empowering better healthcare solutions
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2 text-sm text-white">
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <Link to="/products" className="hover:underline hover:text-gray-200">
            Home
          </Link>
          <Link to="/aboutpage" className="hover:underline hover:text-gray-200">
            About Us
          </Link>
          <Link to="/catalog" className="hover:underline hover:text-gray-200">
            Catalogue
          </Link>
          <Link to="/offers" className="hover:underline hover:text-gray-200">
            Offers
          </Link>
          <Link to="/order-historys" className="hover:underline hover:text-gray-200">
            Order History
          </Link>
          <Link to="/request-services" className="hover:underline hover:text-gray-200">
            Support
          </Link>
          <Link to="/profile/settings" className="hover:underline hover:text-gray-200">
           Settings
          </Link>
        </div>

        {/* Address */}
        <div className="text-sm text-gray-200 space-y-1">
          <h4 className="font-semibold mb-2 text-white">Address</h4>
          <p>V.M. Towers, B2, Selvakumarasamy Gardens,</p>
          <p>Theivanayagi Nagar, Ganapathy,</p>
          <p>Coimbatore, Tamil Nadu - 641006</p>
        </div>

        {/* Get in Touch */}
        <div className="text-sm text-gray-200 space-y-2">
          <h4 className="font-semibold mb-2 text-white">Get in Touch</h4>
          <p>
            📞{" "}
            <a href="tel:8072437202" className="underline hover:text-gray-100">
              8072437202
            </a>
          </p>
          <p>
            ✉️{" "}
            <a
              href="mailto:info@fishmanhealthcare.com"
              className="underline hover:text-gray-100"
            >
              info@fishmanhealthcare.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
