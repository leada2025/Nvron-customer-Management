import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiDollarSign,
  FiClipboard,
  FiFolder,
} from "react-icons/fi";

// Sidebar configuration
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
  { name: "Requests", icon: <FiFolder />,
    submenu: [
      { label: "Customer Requests", path: "requests" },
]}

  // {
  //   name: "Settings",
  //   icon: <FiSettings />,
  //   submenu: [
  //     { label: "User Access Management", path: "Users" },
  //     { label: "Edit Branding", path: "pricing/roles" },
  //     { label: "Update Terms / Policies", path: "pricing/history" },
  //   ],
  // },
];

export default function AdminLayout({ setToken }) {
  const [user, setUser] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
const menuRefs = useRef({});

  const location = useLocation();
  const navigate = useNavigate();
  const settingsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const decoded = jwtDecode(token);
        const parsedUser = JSON.parse(userData);
        setUser({ ...decoded, ...parsedUser, role: parsedUser.role?.toLowerCase() });
      } catch (e) {
        console.error("Invalid token or user data", e);
      }
    }
  }, []);
// Closes settings dropdown
useEffect(() => {
  const handleClickOutside = (event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setSettingsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

// Closes sidebar submenu
useEffect(() => {
  const handleClickOutsideMenu = (event) => {
    const isClickInsideAnyMenu = Object.values(menuRefs.current).some((ref) => {
      return ref.current && ref.current.contains(event.target);
    });

    if (!isClickInsideAnyMenu) {
      setExpandedMenu(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutsideMenu);
  return () => {
    document.removeEventListener("mousedown", handleClickOutsideMenu);
  };
}, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/", { replace: true });
  };

  const currentPath = location.pathname.split("/")[2] || "dashboard";

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

  const getCurrentPageTitle = () => {
  const pathname = location.pathname.toLowerCase();

  for (const link of filteredSidebarLinks) {
    if (link.submenu) {
      for (const item of link.submenu) {
        if (pathname.includes(item.path.toLowerCase())) {
          return item.label;
        }
      }
    } else {
      const routePath = link.path || link.name.toLowerCase().trim().replace(/\s+/g, "");
      if (pathname.includes(routePath)) {
        return link.name;
      }
    }
  }

  return "Dashboard";
};


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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

    // Create ref per menu item
    if (!menuRefs.current[name]) {
      menuRefs.current[name] = React.createRef();
    }

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




        <div className="p-4 border-t border-gray-200">
          {/* <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
          >
            <FiLogOut className="w-4 h-4" />
            {!isSidebarCollapsed && "Logout"}
          </button> */}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[61px] bg-white border-b shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
         <h1 className="text-lg font-semibold capitalize text-gray-700">
  {getCurrentPageTitle()}
</h1>

          <div className="flex items-center space-x-4 relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
              className="text-gray-600 hover:text-black"
              title="Settings"
            >
              <FiSettings className="w-5 h-5" />
            </button>

            {/* Settings Dropdown */}
            {settingsDropdownOpen && (
              <div className="absolute right-16 top-12 w-64 bg-white border rounded-md shadow-lg z-50">
                <ul className="text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => {
                        navigate("/admin/Users");
                        setSettingsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      User Access Management
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate("/admin/pricing/roles");
                        setSettingsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit Branding
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate("/admin/pricing/history");
                        setSettingsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Update Terms / Policies
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center text-sm text-red-600 hover:text-red-800"
            >
              <FiLogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
