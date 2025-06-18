import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ClipboardList,
  Folder,
} from "lucide-react";

const sidebarLinks = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "",
    roles: ["admin", "sales", "billing", "customer"],
  },
  {
    name: "Customers",
    icon: <Users size={18} />,
    submenu: [
      {
        label: "Customer View/Edit",
        path: "customer",
        icon: <Users size={18} />,
        roles: ["admin", "sales"],
      },
    ],
  },
  {
    name: "Sales Executive",
    icon: <Users size={18} />,
    submenu: [
      { label: "Assign Customers", path: "salesexecutive", roles: ["admin"] },
      { label: "Track Activity", path: "customers/add", roles: ["admin"] },
      { label: "Sales Target", path: "customers/reports", roles: ["admin"] },
    ],
  },
  {
    name: "Billing Executives",
    icon: <Users size={18} />,
    submenu: [
      { label: "Assign Tasks", path: "customers/view", roles: ["admin"] },
      { label: "Assign Clients", path: "customers/add", roles: ["admin"] },
      { label: "Track Activity", path: "customers/reports", roles: ["admin"] },
    ],
  },
  {
    name: "Order Management",
    icon: <ClipboardList size={18} />,
    submenu: [
      {
        label: "View All Orders",
        path: "orders",
        icon: <ClipboardList size={18} />,
        roles: ["admin", "sales", "billing"],
      },
      { label: "Add/Edit Products", path: "Products", roles: ["admin"] },
    ],
  },
  {
    name: "Price Approval",
    icon: <DollarSign size={18} />,
    submenu: [
      {
        label: "Request Pricing",
        path: "request-pricing",
        icon: <DollarSign size={18} />,
        roles: ["admin", "sales"],
      },
      { label: "View All Price Requests", path: "priceconsole", roles: ["admin"] },
      { label: "Approve / Reject / Comment", path: "PriceApproval", roles: ["admin"] },
      { label: "Price History Log", path: "pricing/history", roles: ["admin"] },
    ],
  },
  {
    name: "Requests",
    icon: <Folder size={18} />,
    submenu: [
      {
        label: "Customer Requests",
        path: "requests",
        icon: <Folder size={18} />,
        roles: ["admin", "sales", "billing"],
      },
    ],
  },
];

export default function AdminSidebar() {
  const [role, setRole] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole?.toLowerCase() || null);
  }, []);

  const isAdmin = role === "admin";

  const getSidebarItems = () => {
    if (!role) return [];

    const items = [];

    for (const link of sidebarLinks) {
      if (!link.submenu) {
        if (!link.roles || link.roles.includes(role)) {
          items.push({
            label: link.name,
            path: link.path,
            icon: link.icon,
          });
        }
      } else {
        if (isAdmin) {
          items.push(link);
        } else {
          const allowedSubs = link.submenu.filter((sub) =>
            sub.roles.includes(role)
          );
          for (const sub of allowedSubs) {
            items.push({
              label: sub.label,
              path: sub.path,
              icon: sub.icon || link.icon,
            });
          }
        }
      }
    }

    return items;
  };

  const sidebarItems = getSidebarItems();

  return (
    <aside className="w-64 min-h-screen bg-[#e6f7f7] border-r border-[#0b7b7b] text-[#0b7b7b] shadow-md">
      <div className="px-6 py-6 border-b border-[#0b7b7b]/20">
        <h1 className="text-2xl font-bold">Fishman</h1>
        <p className="text-sm opacity-70">HealthCare</p>
      </div>

      <nav className="px-4 py-6 space-y-2">
        {sidebarItems.map((item, index) => {
          const isSubmenu = item.submenu;
          const isExpanded = expandedMenu === item.name;

          const currentPath = location.pathname.replace("/admin/", "");
          const isSubmenuActive =
            isSubmenu && item.submenu.some((sub) => currentPath.startsWith(sub.path));
          const isActive =
            !isSubmenu &&
            (item.path === ""
              ? currentPath === ""
              : currentPath.startsWith(item.path));

          if (isAdmin && isSubmenu) {
            return (
              <div key={index}>
                <button
                  onClick={() =>
                    setExpandedMenu(isExpanded ? null : item.name)
                  }
                  className={`flex text-left w-full gap-3 px-4 py-2 rounded-lg font-medium text-sm transition relative group ${
                    isSubmenuActive
                      ? "bg-[#0b7b7b] text-white shadow-inner"
                      : "hover:bg-[#c2efef]"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1.5 rounded-r-full ${
                      isSubmenuActive
                        ? "bg-white"
                        : "group-hover:bg-[#0b7b7b]/50"
                    }`}
                  />
                  {item.icon}
                  <span className="flex-grow">{item.name}</span>
                  <span className="text-xs">{isExpanded ? "▲" : "▼"}</span>
                </button>

                {isExpanded && (
                  <div className="ml-6 mt-1 border-l border-[#0b7b7b]/20 pl-3 space-y-1">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => {
                          setExpandedMenu(null);
                          navigate(`/admin/${sub.path}`);
                        }}
                        className={`block px-3 py-1.5 rounded-md text-sm transition font-medium w-full text-left ${
                          currentPath.startsWith(sub.path)
                            ? "bg-[#0b7b7b] text-white"
                            : "hover:bg-[#d7f3f3] text-[#0b7b7b]"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => navigate(`/admin/${item.path}`)}
              className={`flex text-left w-full gap-3 px-4 py-2 rounded-lg font-medium text-sm transition relative group ${
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
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
