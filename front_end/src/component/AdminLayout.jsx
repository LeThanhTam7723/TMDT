import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiSettings,
  FiCheck,
} from "react-icons/fi";
import { MdDashboard, MdAnalytics, MdPeople, MdReport } from "react-icons/md";

const AdminLayout = ({ children, darkMode, setDarkMode, title = "Admin Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: MdDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: MdAnalytics,
      href: "/admin/CourseAnalytics",
    },
    {
      id: "users",
      title: "User Management",
      icon: MdPeople,
      href: "/admin/UserManagement",
    },
    {
      id: "reports",
      title: "Reports",
      icon: MdReport,
      href: "/admin/ComplaintManagement",
    },
    {
      id: "course-approval",
      title: "Course Approval",
      icon: FiCheck,
      href: "/admin/course-approval",
    },
    {
      id: "settings",
      title: "Settings",
      icon: FiSettings,
      href: "/admin/settings",
    },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  const handleNavigation = (href) => {
    navigate(href);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-900`}>
      <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? "auto" : "0" }}
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-white dark:bg-gray-800 h-screen fixed transition-all duration-300 z-10 overflow-hidden`}
        >
          <div className="p-4">
            <nav>
              <div className="flex items-center mb-8">
                <img
                  src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f"
                  alt="Logo"
                  className="h-8 w-8 rounded"
                />
                <span className="ml-2 text-xl font-bold">AdminDash</span>
              </div>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                          active
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon className="mr-3" size={20} />
                        {item.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <div
          className={`flex-1 ${
            sidebarOpen ? "ml-64" : "ml-0"
          } transition-all duration-300`}
        >
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiMenu size={24} />
                </button>
                <h1 className="text-xl font-semibold">{title}</h1>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 