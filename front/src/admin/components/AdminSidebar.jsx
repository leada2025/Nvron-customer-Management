import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  DollarSign,
  ClipboardList,
  Folder,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "" },
  {
    name: "Customers",
    icon: <Users size={18} />,
    submenu: [{ label: "View/Edit", path: "customer" }],
  },
  {
    name: "Sales Executive",
    icon: <Users size={18} />,
    submenu: [
      { label: "Assign Customers", path: "customer" },
      { label: "Track Activity", path: "customers/add" },
      { label: "Sales Target", path: "customers/reports" },
    ],
  },
  {
    name: "Billing Executives",
    icon: <Users size={18} />,
    submenu: [
      { label: "Assign Tasks", path: "customers/view" },
      { label: "Assign Clients", path: "customers/add" },
      { label: "Track Activity", path: "customers/reports" },
    ],
  },
  {
    name: "Order Management",
    icon: <ClipboardList size={18} />,
    submenu: [
      { label: "View All Orders", path: "orders" },
      { label: "By Sales Executive / Customer", path: "customers/add" },
      { label: "Add/Edit Products", path: "Products" },
      { label: "Upload Product Rates (CSV)", path: "customers/reports" },
    ],
  },
  {
    name: "Price Approval",
    icon: <DollarSign size={18} />,
    submenu: [
      { label: "View All Price Requests", path: "priceconsole" },
      { label: "Approve / Reject / Comment", path: "PriceApproval" },
      { label: "Set Role-Based Limits", path: "pricing/roles" },
      { label: "Price History Log", path: "pricing/history" },
    ],
  },
  {
    name: "Requests",
    icon: <Folder size={18} />,
    submenu: [{ label: "Customer Requests", path: "requests" }],
  },
  {
    name: "Uncalling Pages",
    icon: <AlertCircle size={18} />,
    submenu: [
      { label: "Page Monitor", path: "uncalling/monitor" },
      { label: "Unlinked Modules", path: "uncalling/unlinked" },
    ],
  },
  {
    name: "Update",
    icon: <RefreshCw size={18} />,
    submenu: [
      { label: "Push Updates", path: "update/push" },
      { label: "Changelog", path: "update/logs" },
    ],
  },
];

export default function AdminSidebar({ user, navigate }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const menuRefs = useRef({});

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
        [
          "dashboard",
          "customers",
          "sales executive",
          "order management",
          "requests",
          "price approval",
          "uncalling pages",
        ].includes(link.name.toLowerCase().trim())
      );
    }

    if (role.includes("invoice") || role.includes("bill")) {
      return sidebarLinks.filter((link) =>
        [
          "dashboard",
          "customers",
          "billing executives",
          "price approval",
          "order management",
          "requests",
          "update",
        ].includes(link.name.toLowerCase().trim())
      );
    }

    return [];
  };

  const filteredSidebarLinks = getFilteredSidebarLinks();

  return (
    <aside className="w-64 min-h-screen bg-[#e6f7f7] text-[#0b7b7b] border-r border-[#0b7b7b]">
      <div className="px-6 py-4 ">
        <div className="text-xl font-semibold leading-tight">
          Fishman <br />
          <span className="text-sm text-[#0b7b7b] font-normal opacity-70">
            HealthCare
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-2 px-4 py-6">
        {filteredSidebarLinks.map(({ name, icon, submenu, path }) => {
          const routePath =
            typeof path === "string"
              ? path
              : name.toLowerCase().trim().replace(/\s+/g, "");
          const isSubmenuActive = submenu?.some((item) =>
            location.pathname.toLowerCase().includes(item.path.toLowerCase())
          );
          const isActive = submenu
            ? isSubmenuActive
            : location.pathname.toLowerCase().endsWith(`/admin/${routePath}`);
          const isExpanded = expandedMenu === name;

          if (!menuRefs.current[name]) menuRefs.current[name] = React.createRef();

          return (
            <div key={name} className="relative" ref={menuRefs.current[name]}>
              <button
                onClick={() => {
                  if (submenu) {
                    setExpandedMenu(isExpanded ? null : name);
                  } else {
                    setExpandedMenu(null);
                    navigate(`/admin/${routePath}`);
                  }
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-[#0b7b7b] text-white"
                    : "hover:bg-[#c2efef] text-[#0b7b7b]"
                }`}
              >
                {icon}
                {name}
                {submenu && (
                  <span className="ml-auto text-xs">{isExpanded ? "▲" : "▼"}</span>
                )}
              </button>

              {submenu && isExpanded && (
                <div className="ml-4 mt-2 flex flex-col gap-1">
                  {submenu.map((item) => (
                    <Link
                      key={item.label}
                      to={`/admin/${item.path}`}
                      onClick={() => setExpandedMenu(null)}
                      className={`block px-3 py-1 text-sm rounded-md transition ${
                        location.pathname
                          .toLowerCase()
                          .includes(item.path.toLowerCase())
                          ? "bg-[#0b7b7b] text-white"
                          : "hover:bg-[#c2efef] text-[#0b7b7b]"
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
