import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../Pages/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 p-6 bg-white">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
