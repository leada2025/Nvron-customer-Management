// AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const sidebarLinks = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Users", icon: "👥" },
  { name: "Products", icon: "📦" },
  { name: "Pricing", icon: "💲" },
  { name: "Orders", icon: "📝" },
  { name: "Settings", icon: "⚙️" },
];

export default function AdminLayout({setToken}) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  const currentPath = location.pathname.split("/")[2] || "dashboard";

const handleLogout = () => {
  localStorage.removeItem("token");
  setToken(null); // Update state in App.jsx
  navigate("/", { replace: true }); // Redirect to login
};


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="text-xl font-bold p-6 border-b border-gray-200">
          Nvron Admin
        </div>
        <nav className="flex-grow">
          {sidebarLinks.map(({ name, icon }) => {
            const path = name.toLowerCase() === "dashboard" ? "" : name.toLowerCase();
            return (
              <Link
                key={name}
                to={`/admin/${path}`}
                className={`flex items-center w-full px-6 py-3 text-left hover:bg-blue-100 ${
                  currentPath === path ? "bg-blue-200 font-semibold" : "text-gray-700"
                }`}
              >
                <span className="mr-3">{icon}</span> {name}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-gray-200">
         <button
  onClick={handleLogout}
  className="w-full text-red-600 hover:text-red-800 font-semibold"
>
  Logout
</button>

        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-2xl font-semibold capitalize">{currentPath || "Dashboard"}</h1>
          <div>
            <button className="text-gray-600 hover:text-gray-800">
              {user?.name || "Admin"} ▼
            </button>
          </div>
        </header>

        {/* Nested content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
