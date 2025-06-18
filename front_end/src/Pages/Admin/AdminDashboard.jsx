import React, { useState, useEffect, useContext, createContext } from "react";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from "chart.js";
import { motion } from "framer-motion";
import { FiMenu, FiBell, FiSearch, FiUser, FiSettings } from "react-icons/fi";
import { MdDashboard, MdAnalytics, MdPeople, MdReport } from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const ThemeContext = createContext();

const DashboardCard = ({ title, value, icon, percentage }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className="text-green-500 text-sm mt-2">+{percentage}%</p>
        </div>
        <div className="text-blue-500 text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
};

const Analytics = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Revenue",
      data: [3000, 4500, 3500, 5000, 4800, 6000],
      borderColor: "rgb(59, 130, 246)",
      tension: 0.4
    }]
  };

  const pieChartData = {
    labels: ["Desktop", "Mobile", "Tablet"],
    datasets: [{
      data: [45, 40, 15],
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"]
    }]
  };

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Sales",
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: "rgba(59, 130, 246, 0.5)"
    }]
  };

  const donutChartData = {
    labels: ["Electronics", "Clothing", "Food", "Others"],
    datasets: [{
      data: [30, 25, 20, 25],
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
    }]
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
        <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
          {/* Sidebar */}
          <motion.div
            initial={false}
            animate={{ width: sidebarOpen ? "auto" : "0" }}
            className={`${sidebarOpen ? "w-64" : "w-0"} bg-white dark:bg-gray-800 h-screen fixed transition-all duration-300`}
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
                               <li>
                                 <a href="/admin/dashboard" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                   <MdDashboard className="mr-3" /> Dashboard
                                 </a>
                               </li>
                               <li>
                                 <a href="/admin/CourseAnalytics" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                   <MdAnalytics className="mr-3" /> Analytics
                                 </a>
                               </li>
                               <li className="bg-blue-500 text-white rounded-lg">
                                 <a href="/admin/UserManagement" className="flex items-center p-3">
                                   <MdPeople className="mr-3" /> User Management
                                 </a>
                               </li>
                               <li>
                                 <a href="/admin/ComplaintManagement" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                   <MdReport className="mr-3" /> Reports
                                 </a>
                               </li>
                               <li>
                                 <a href="#" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                   <FiSettings className="mr-3" /> Settings
                                 </a>
                               </li>
                             </ul>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}>
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMenu size={24} />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-gray-100 dark:bg-gray-700 rounded-lg pl-10 pr-4 py-2 w-64"
                    />
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    <FiBell size={24} />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="font-medium">John Doe</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <main className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <DashboardCard
                  title="Total Revenue"
                  value="$54,375"
                  percentage="12.5"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Active Users"
                  value="2,345"
                  percentage="8.2"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Conversion Rate"
                  value="3.45%"
                  percentage="5.6"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Avg. Order Value"
                  value="$123"
                  percentage="10.2"
                  icon={<FiUser />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Revenue Trends</h3>
                  <Line data={lineChartData} options={{ responsive: true }} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">User Distribution</h3>
                  <Pie data={pieChartData} options={{ responsive: true }} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Monthly Performance</h3>
                  <Bar data={barChartData} options={{ responsive: true }} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Product Categories</h3>
                  <Doughnut data={donutChartData} options={{ responsive: true }} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Analytics;