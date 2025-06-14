// components/Navbar.jsx
import React from "react";
import NotificationsDropdown from "../components/Notification";
import ProfileDropdown from "./ProfileDropdown";


export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Nvron Portal</h1>
      <div className="flex items-center gap-6">
       <NotificationsDropdown/>
       <ProfileDropdown/>
      </div>
    </header>
  );
}

