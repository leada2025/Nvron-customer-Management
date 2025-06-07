// AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const sidebarLinks = [
  { name: "Dashboard", icon: "🏠" },
  // { name: "Users", icon: "👥" },
  {
    name: "Customers",
    icon: "👥",
    submenu: [
      { label: "View/Edit ", path: "customer" },
      { label: "Reset Password", path: "customers/reports" },
    ],
  },
    {
    name: "Sales Executive",
    icon: "👥",
    submenu: [
      { label: "Assign Clients ", path: "customers/view" },
      { label: "Track Activity", path: "customers/add" },
      { label: "Sales Target", path: "customers/reports" },
    ],
  },
     {
    name: "Invoice Executives",
    icon: "👥",
    submenu: [
      { label: "Assign Tasks ", path: "customers/view" },
      { label: "Assign Clients ", path: "customers/add" },
      { label: "Track Activity", path: "customers/reports" },
    ],
  
  },
  // { name: "Products", icon: "📦" },
  // { name: "Pricing", icon: "💲" },
  {
    name: " Order Management",
    icon: "👥",
    submenu: [
      { label: "View All Orders ", path: "orders" },
      { label: " Filter: By Client, Sales Rep, Status, Date ", path: "customers/add" },                
     
       { label: "Add/Edit Products to Catalogue", path: "Products" },
       { label: "Upload Product Rates (CSV)", path: "customers/reports" },
    ],
  
  },
    {
    name: "Price Approval Control",
    icon: "💰",
    submenu: [
      { label: "View All Price Requests", path: "unapproved" },
      { label: "Approve / Reject / Comment", path: "proposals" },
      { label: "Set Role-Based Approval Limits", path: "pricing/roles" },
      { label: "Price History Log", path: "pricing/history" },
    ],
  },
  //  { name: "Orders", icon: "📝" },
  { name: "Requests", icon: "📨" },
  {
    name: "Settings",
    icon: "💰",
    submenu: [
      { label: "  Set User Roles & Permissions",path: "Users" },
      { label: " Add/Remove Admins", path: "pricing/actions" },
      { label: "Edit Branding (Logo, Footer, etc.)", path: "pricing/roles" },
      { label: "Update Terms / Policies", path: "pricing/history" },
    ],
  },
];



export default function AdminLayout({setToken}) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(null);


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
  {sidebarLinks.map(({ name, icon, submenu }) => {
    const path = name.toLowerCase() === "dashboard" ? "" : name.toLowerCase();
    const isExpanded = expandedMenu === name;

    return (
      <div key={name}>
        <button
          onClick={() => {
            if (submenu) {
              setExpandedMenu(isExpanded ? null : name);
            } else {
              setExpandedMenu(null);
              navigate(`/admin/${path}`);
            }
          }}
          className={`flex items-center justify-between w-full px-6 py-3 hover:bg-blue-100 ${
            location.pathname.includes(path) || isExpanded ? "bg-blue-200 font-semibold" : "text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span>{name}</span>
          </div>
          {submenu && (
            <span className="ml-2 text-sm">{isExpanded ? "▲" : "▼"}</span>
          )}
        </button>

        {submenu && isExpanded && (
          <div className="bg-blue-50">
            {submenu.map((item) => (
              <Link
                key={item.label}
                to={`/admin/${item.path}`}
                className={`block py-2 pl-12 pr-4 text-sm hover:bg-blue-100 ${
                  location.pathname.includes(item.path)
                    ? "text-blue-700 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
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
        
        </header>

        {/* Nested content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
