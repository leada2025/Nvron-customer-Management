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
    icon: <LayoutDashboard size={20} />,
    path: "",
    roles: ["admin", "sales", "billing", "customer"],
  },
  {
    name: "Customers",
    icon: <Users size={20} />,
    submenu: [
      {
        label: "Customer View/Edit",
        path: "customer",
        roles: ["admin", "sales"],
      },
    ],
  },
  {
    name: "Sales Executive",
    icon: <Users size={20} />,
    submenu: [
      
      { label: "Track Activity", path: "customers/add", roles: ["admin"] },
      { label: "Sales Target", path: "customers/reports", roles: ["admin"] },
    ],
  },
  {
    name: "Billing Executives",
    icon: <Users size={20} />,
    submenu: [
      { label: "Assign Tasks", path: "customers/view", roles: ["admin"] },
      { label: "Assign Clients", path: "customers/add", roles: ["admin"] },
      { label: "Track Activity", path: "customers/reports", roles: ["admin"] },
    ],
  },
  {
    name: "Order Management",
    icon: <ClipboardList size={20} />,
    submenu: [
      {
        label: "View All Orders",
        path: "orders",
        roles: ["admin", "sales", "billing"],
      },
      { label: "Add/Edit Products", path: "Products", roles: ["admin"] },
    ],
  },
  {
    name: "Rate Approval",
    icon: <DollarSign size={20} />,
    submenu: [
      {
        label: "Request Rate",
        path: "request-pricing",
        roles: ["sales"],
      },
      { label: "View All Rate Requests", path: "priceconsole", roles: ["admin"] },
      
    ],
  },
  {
    name: "Requests",
    icon: <Folder size={20} />,
    submenu: [
      {
        label: "Customer Requests",
        path: "requests",
        roles: ["admin", "sales", "billing"],
      },
    ],
  },
];

export default function AdminSidebar() {
  const [role, setRole] = useState(null);
  const [selectedMainItem, setSelectedMainItem] = useState(null);
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
          items.push(link);
        }
      } else {
        if (isAdmin || link.submenu.some((sub) => sub.roles.includes(role))) {
          items.push(link);
        }
      }
    }

    return items;
  };

  const sidebarItems = getSidebarItems();

 const getVisibleSubmenu = () => {
  const selected = sidebarItems.find((item) => item.name === selectedMainItem);
  if (!selected || !selected.submenu) return [];

  return selected.submenu.filter((sub) => sub.roles.includes(role));
};


  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Primary Sidebar */}
      <aside className="group w-20 hover:w-64 transition-all duration-300 bg-[#074f4f] text-white flex flex-col">
        <div className="h-25 flex items-center justify-center group-hover:justify-start px-4">
          <span className="font-bold text-xl hidden group-hover:inline text-white">
            Fishman
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto mt-4 space-y-1 px-2">
          {sidebarItems.map((item, index) => {
            const isActive = selectedMainItem === item.name;
            return (
              <button
                key={index}
               onClick={() => {
  if (!item.submenu) {
    navigate(`/admin/${item.path}`);
    setSelectedMainItem(null);
  } else {
    setSelectedMainItem(item.name);
    
    // Automatically navigate to the first visible submenu
    const firstVisibleSub = item.submenu.find((sub) =>
      sub.roles.includes(role)
    );
    if (firstVisibleSub) {
      navigate(`/admin/${firstVisibleSub.path}`);
    }
  }
}}

                
                className={`group w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#e0f7f7] text-[#074f4f] font-semibold"
                    : "hover:bg-[#0ea5a5] text-white"
                }`}
              >
                <div className="text-white">{item.icon}</div>
                <span className="hidden group-hover:inline text-sm">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Secondary Sidebar */}
      {selectedMainItem &&
        sidebarItems.find((item) => item.name === selectedMainItem)?.submenu &&
        getVisibleSubmenu().length > 0 && (
          <aside className="w-64 bg-[#e6f7f7] border-r border-[#0b7b7b]/20 py-6 px-4">
            <h2 className="text-md font-semibold mb-4 text-[#0b7b7b]">
              {selectedMainItem}
            </h2>
            <div className="space-y-2">
              {getVisibleSubmenu().map((sub, i) => {
                const isActive = location.pathname.startsWith(
                  `/admin/${sub.path}`
                );
                return (
                  <button
                    key={i}
                    onClick={() => navigate(`/admin/${sub.path}`)}
                    className={`block w-full text-left px-4 py-2 rounded-md font-medium text-sm ${
                      isActive
                        ? "bg-[#0b7b7b] text-white"
                        : "hover:bg-[#c2efef] text-[#0b7b7b]"
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

      {/* Main Content Placeholder */}
      <div className="flex-1">{/* Page content goes here */}</div>
    </div>
  );
}