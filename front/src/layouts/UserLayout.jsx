// layouts/UserLayout.js
import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../Pages/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <Sidebar />
      <div className="md:ml-61 min-h-screen">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
