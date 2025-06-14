import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/fishlogo.jpg"


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };
const [openSubmenus, setOpenSubmenus] = useState({});
const toggleSubmenu = (label) => {
  setOpenSubmenus((prev) => ({
    ...prev,
    [label]: !prev[label],
  }));
};

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-white font-semibold border-l-4 border-[#18d8d8] pl-2"
      : "hover:text-[#18d8d8] pl-2";

      const menuItems = [
  { to: "/dashboard", label: "📦 Dashboard" },
  {
    label: "📦 Order Management",
    submenu: [
      { to: "/products", label: "Place Orders" },
      { to: "/order-summary", label: "Order Summary" },
      { to: "/order-historys", label: "View Order History" },
    ],
  },
  {
    label: "💰 Price Control",
    submenu: [
      { to: "/negotiationhis", label: "Price Requests" },
      { to: "/price-approval", label: "Approve/Reject" },
      { to: "/price-history", label: "History Log" },
    ],
  },
  {
    label: "📦 Customer Support",
    submenu: [
      { to: "/products", label: " Raise Ticket (Product, Billing, Delivery)" },
      { to: "/order-summary", label: " Return Request" },                                      
      { to: "/order-historys", label: "Credit Note Request" },
      { to: "/order-historys", label: "Ticket Status Tracker" },
    ],
  },
];


  return (
    <>
    
      {/* Toggle button for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar for mobile + md and above */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0b7b7b] shadow-lg transform transition-transform duration-300 z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Sidebar content */}
        <div className="flex flex-col justify-between h-full py-6 px-4">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="Logo" className="w-60 h-40" />
             
            </div>

            <nav className="flex flex-col gap-2 text-white font-medium">
  {menuItems.map((item) => {
    if (item.submenu) {
      const isOpen = openSubmenus[item.label];

      return (
        <div key={item.label}>
          <button
            onClick={() => toggleSubmenu(item.label)}
            className="flex justify-between items-center w-full px-2 py-2 hover:bg-[#18d8d8] rounded"
          >
            <span>{item.label}</span>
            <span>{isOpen ? "▲" : "▼"}</span>
          </button>
          {isOpen && (
            <div className="ml-4 mt-1 flex flex-col gap-1">
              {item.submenu.map((sub) => (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  className={navLinkClass}
                  onClick={closeSidebar}
                >
                  {sub.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={navLinkClass}
        onClick={closeSidebar}
      >
        {item.label}
      </NavLink>
    );
  })}
</nav>

          </div>

          <button
            onClick={() => {
              closeSidebar();
              handleLogout();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
