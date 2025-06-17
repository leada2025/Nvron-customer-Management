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
      { label: "Assign Customers", path: "salesexecutive" },
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
      // { label: "By Sales Executive / Customer", path: "customers/add" },
      { label: "Add/Edit Products", path: "Products" },
      // { label: "Upload Product Rates (CSV)", path: "customers/reports" },
    ],
  },
  {
    name: "Price Approval",
    icon: <DollarSign size={18} />,
    submenu: [
      { label: "View All Price Requests", path: "priceconsole" },
      { label: "Approve / Reject / Comment", path: "PriceApproval" },
      // { label: "Set Role-Based Limits", path: "pricing/roles" },
      { label: "Price History Log", path: "pricing/history" },
    ],
  },
  {
    name: "Requests",
    icon: <Folder size={18} />,
    submenu: [{ label: "Customer Requests", path: "requests" }],
  },

];

export default function AdminSidebar({ user, navigate }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutside = !Object.values(menuRefs.current).some(
        (ref) => ref.current?.contains(e.target)
      );
      if (clickedOutside) setExpandedMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        ].includes(link.name.toLowerCase())
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
        ].includes(link.name.toLowerCase())
      );
    }

    return [];
  };

  const filteredSidebarLinks = getFilteredSidebarLinks();

  return (
    <aside className="w-64 min-h-screen bg-[#e6f7f7] border-r border-[#0b7b7b] text-[#0b7b7b] shadow-md">
      <div className="px-6 py-6 border-b border-[#0b7b7b]/20">
        <h1 className="text-2xl font-bold">Fishman</h1>
        <p className="text-sm opacity-70">HealthCare</p>
      </div>

      <nav className="px-4 py-6 space-y-2">
        {filteredSidebarLinks.map(({ name, icon, submenu, path }) => {
          const routePath =
            typeof path === "string"
              ? path
              : name.toLowerCase().replace(/\s+/g, "");
          const isSubmenuActive = submenu?.some((item) =>
            location.pathname.includes(item.path)
          );
          const isActive = submenu
            ? isSubmenuActive
            : location.pathname.endsWith(`/admin/${routePath}`);
          const isExpanded = expandedMenu === name;

          if (!menuRefs.current[name]) menuRefs.current[name] = React.createRef();

          return (
            <div key={name} ref={menuRefs.current[name]}>
              <button
                onClick={() => {
                  submenu
                    ? setExpandedMenu(isExpanded ? null : name)
                    : (setExpandedMenu(null), navigate(`/admin/${routePath}`));
                }}
                className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg font-medium text-sm transition relative group ${
                  isActive
                    ? "bg-[#0b7b7b] text-white shadow-inner"
                    : "hover:bg-[#c2efef]"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 rounded-r-full ${
                    isActive ? "bg-white" : "group-hover:bg-[#0b7b7b]/50"
                  }`}
                />
                {icon}
                <span className="flex-grow">{name}</span>
                {submenu && (
                  <span className="text-xs">{isExpanded ? "▲" : "▼"}</span>
                )}
              </button>

              {submenu && isExpanded && (
                <div className="ml-6 mt-1 border-l border-[#0b7b7b]/20 pl-3 space-y-1">
                  {submenu.map((item) => (
                    <Link
                      key={item.label}
                      to={`/admin/${item.path}`}
                      onClick={() => setExpandedMenu(null)}
                      className={`block px-3 py-1.5 rounded-md text-sm transition font-medium ${
                        location.pathname.includes(item.path)
                          ? "bg-[#0b7b7b] text-white"
                          : "hover:bg-[#d7f3f3] text-[#0b7b7b]"
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
