import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../Pages/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-[#e6f7f7] border-r border-[#0b7b7b] hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <div className="shadow-md bg-white z-10 sticky top-0">
          <Navbar />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
