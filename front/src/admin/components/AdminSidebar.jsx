import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiDollarSign,
  FiClipboard,
  FiFolder,
} from "react-icons/fi";

const sidebarLinks = [
  { name: "Dashboard", icon: <FiHome />, path: "" },
  {
    name: "Customers",
    icon: <FiUsers />,
    submenu: [{ label: "View/Edit", path: "customer" }],
  },
  {
    name: "Sales Executive",
    icon: <FiUsers />,
    submenu: [
      { label: "Assign Customers", path: "customer" },
      { label: "Track Activity", path: "customers/add" },
      { label: "Sales Target", path: "customers/reports" },
    ],
  },
  {
    name: "Invoice Executives",
    icon: <FiUsers />,
    submenu: [
      { label: "Assign Tasks", path: "customers/view" },
      { label: "Assign Clients", path: "customers/add" },
      { label: "Track Activity", path: "customers/reports" },
    ],
  },
  {
    name: "Order Management",
    icon: <FiClipboard />,
    submenu: [
      { label: "View All Orders", path: "orders" },
      { label: "By Sales Executive / Customer", path: "customers/add" },
      { label: "Add/Edit Products", path: "Products" },
      { label: "Upload Product Rates (CSV)", path: "customers/reports" },
    ],
  },
  {
    name: "Price Approval ",
    icon: <FiDollarSign />,
    submenu: [
      { label: "View All Price Requests", path: "priceconsole" },
      { label: "Approve / Reject / Comment", path: "PriceApproval" },
      { label: "Set Role-Based Limits", path: "pricing/roles" },
      { label: "Price History Log", path: "pricing/history" },
    ],
  },
  {
    name: "Requests",
    icon: <FiFolder />,
    submenu: [{ label: "Customer Requests", path: "requests" }],
  },
];

export default function AdminSidebar({ user, navigate }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const menuRefs = useRef({});
  const location = useLocation();

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      const isClickInsideAnyMenu = Object.values(menuRefs.current).some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (!isClickInsideAnyMenu) setExpandedMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, []);

  const getFilteredSidebarLinks = () => {
    const role = user?.role;
    if (!role || role === "admin") return sidebarLinks;

    if (role.includes("sale")) {
      return sidebarLinks.filter((link) =>
        ["dashboard", "customers", "sales executive", "order management", "requests", "price approval "].includes(
          link.name.toLowerCase().trim()
        )
      );
    }

    if (role.includes("invoice") || role.includes("bill")) {
      return sidebarLinks.filter((link) =>
        ["dashboard", "customers", "invoice executives", "price approval", "order management", "requests"].includes(
          link.name.toLowerCase().trim()
        )
      );
    }

    return [];
  };

  const filteredSidebarLinks = getFilteredSidebarLinks();

  return (
    <aside className={`bg-white shadow-md flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-bold text-lg">{!isSidebarCollapsed ? "Nvron Admin" : "N"}</span>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-sm text-gray-600"
        >
          {isSidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="flex-grow relative">
        {filteredSidebarLinks.map(({ name, icon, submenu, path }) => {
          const routePath = typeof path === "string" ? path : name.toLowerCase().trim().replace(/\s+/g, "");
          const isSubmenuActive = submenu?.some((item) =>
            location.pathname.toLowerCase().includes(item.path.toLowerCase())
          );
          const isActive = submenu
            ? isSubmenuActive
            : location.pathname.toLowerCase().replace(/\/+$/, "") === `/admin/${routePath}`.replace(/\/+$/, "");
          const isExpanded = expandedMenu === name;

          if (!menuRefs.current[name]) menuRefs.current[name] = React.createRef();

          return (
            <div key={name} className="relative" ref={menuRefs.current[name]}>
              <button
                onClick={() => {
                  if (submenu) setExpandedMenu(isExpanded ? null : name);
                  else {
                    setExpandedMenu(null);
                    navigate(`/admin/${routePath}`);
                  }
                }}
                className={`flex items-center gap-4 px-4 py-3 w-full rounded-md transition-all duration-200 relative z-20 ${
                  isActive ? "bg-blue-200 font-semibold text-blue-900" : "text-gray-600 hover:bg-blue-100"
                }`}
                title={name}
              >
                <span className="text-lg">{icon}</span>
                {!isSidebarCollapsed && <span>{name.trim()}</span>}
                {!isSidebarCollapsed && submenu && (
                  <span className={`ml-auto transform transition-transform duration-300 text-sm ${isExpanded ? "rotate-150" : "rotate-0"}`}>
                    ▼
                  </span>
                )}
              </button>

              {submenu && isExpanded && (
                <div className="absolute left-full top-0 mt-2 ml-2 w-56 rounded-lg border border-gray-200 bg-white shadow-xl z-30 transform transition-all duration-300 animate-fade-slide-down">
                  {submenu.map((item) => (
                    <Link
                      key={item.label}
                      to={`/admin/${item.path}`}
                      onClick={() => setExpandedMenu(null)}
                      className={`block px-4 py-2 text-sm rounded-md mx-1 my-1 transition-all duration-150 ${
                        location.pathname.toLowerCase().includes(item.path.toLowerCase())
                          ? "bg-blue-100 text-blue-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
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
    </aside>
  );
}
