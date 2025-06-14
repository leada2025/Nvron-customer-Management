import React from "react";
import NotificationsDropdown from "../components/Notification";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  return (
    <header className="h-16 bg-[#0b7b7b] text-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold tracking-wide">Fishman HealthCare</h1>
      <div className="flex items-center gap-5">
        <NotificationsDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
}
