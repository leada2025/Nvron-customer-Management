import React from "react";
import { Menu } from "lucide-react";
import NotificationsDropdown from "../components/Notification";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="h-[60px] bg-[#0b7b7b] text-white flex items-center justify-between px-4 sm:px-6">
      {/* Left: Logo + Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="block lg:hidden text-white focus:outline-none"
        >
          <Menu size={22} />
        </button>

        {/* Logo Text */}
        <h1 className="text-base sm:text-lg font-semibold tracking-wide whitespace-nowrap">
          Fishman HealthCare
        </h1>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center  sm:gap-6">
        <NotificationsDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
}
