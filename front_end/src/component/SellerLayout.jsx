import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiSettings,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import { MdDashboard, MdBook, MdAttachMoney, MdUndo, MdAnalytics } from "react-icons/md";

const SellerLayout = ({ children, darkMode, setDarkMode, title = "Seller Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: MdDashboard,
      href: "/seller/dashboard",
    },
    {
      id: "courses",
      title: "Quản lý khóa học",
      icon: MdBook,
      href: "/seller/courses",
    },
    {
      id: "revenue", 
      title: "Doanh thu",
      icon: MdAttachMoney,
      href: "/seller/revenue",
    },
    {
      id: "analytics",
      title: "Thống kê",
      icon: MdAnalytics,
      href: "/seller/analytics",
    },
    {
      id: "students",
      title: "Học viên",
      icon: FiUsers,
      href: "/seller/students",
    },
    {
      id: "withdraw",
      title: "Rút tiền",
      icon: FiDollarSign,
      href: "/seller/withdraw",
    },
    {
      id: "refunds",
      title: "Hoàn tiền",
      icon: MdUndo,
      href: "/seller/refunds",
    },
    {
      id: "settings",
      title: "Cài đặt",
      icon: FiSettings,
      href: "/seller/settings",
    },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  const handleNavigation = (href) => {
    navigate(href);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-100 dark:bg-gray-900`}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -250 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -250 }}
            className="w-64 bg-white dark:bg-gray-800 shadow-lg relative z-10"
          >
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                <nav>
                  <div className="flex items-center mb-8">
                    <img
                      src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f"
                      alt="Logo"
                      className="h-8 w-8 rounded"
                    />
                    <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">SellerHub</span>
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
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-md relative z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <FiMenu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
              </div>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? "🌞" : "🌙"}
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerLayout; 