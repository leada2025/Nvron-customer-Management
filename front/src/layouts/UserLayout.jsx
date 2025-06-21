import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../Pages/Navbar"; // Ensure Navbar has a prop `onMenuClick`
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile toggle

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${collapsed ? "w-16" : "w-64"} transition-all duration-300`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 bg-opacity-50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar Container */}
          <div
            className="relative z-50 w-64 bg-[#e6f7f7] shadow-lg flex flex-col min-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <div className="shadow-md bg-white z-10 sticky top-0">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 bg-white">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
