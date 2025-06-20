import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSettings } from "react-icons/fi";
import {
  MdDashboard,
  MdAnalytics,
  MdPeople,
  MdReport,
  MdTrendingUp,
  MdSchool,
} from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Bell,
  Users,
  BookOpen,
  DollarSign,
  LogOut,
  Menu,
  Search,
  Sun,
  Moon,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  Star,
} from "lucide-react";

// Sample data for the charts
const monthlyData = [
  { name: "Jan", sales: 4000, revenue: 24000 },
  { name: "Feb", sales: 3000, revenue: 18000 },
  { name: "Mar", sales: 5000, revenue: 30000 },
  { name: "Apr", sales: 2780, revenue: 19000 },
  { name: "May", sales: 1890, revenue: 15000 },
  { name: "Jun", sales: 2390, revenue: 17000 },
  { name: "Jul", sales: 3490, revenue: 22000 },
];

const courseData = [
  { name: "IELTS 6.5-7.0", value: 520, color: "#3B82F6" },
  { name: "TOEIC 700+", value: 380, color: "#38BDF8" },
  { name: "Business English", value: 300, color: "#FBBF24" },
  { name: "Academic English", value: 250, color: "#FB923C" },
];

const recentRegistrations = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    course: "IELTS 6.5-7.0",
    level: "Beginner (Sơ cấp 1)",
    sessions: 30,
    duration: "10 tuần",
    price: "1,200,000 đ",
    status: "Hoàn thành",
  },
  {
    id: 2,
    name: "Lê Thị B",
    course: "TOEIC 700+",
    level: "High Beginner (Sơ cấp 2)",
    sessions: 40,
    duration: "14 tuần",
    price: "1,500,000 đ",
    status: "Hoàn thành",
  },
  {
    id: 3,
    name: "Trần Văn C",
    course: "Business English",
    level: "Low Intermediate (Trung cấp 1)",
    sessions: 40,
    duration: "14 tuần",
    price: "900,000 đ",
    status: "Đang xử lý",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    course: "Academic English",
    level: "Intermediate (Trung cấp 2)",
    sessions: 40,
    duration: "14 tuần",
    price: "1,300,000 đ",
    status: "Hoàn thành",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    course: "IELTS 6.5-7.0",
    level: "Low Advanced (Cao cấp 1)",
    sessions: 40,
    duration: "14 tuần",
    price: "1,200,000 đ",
    status: "Hủy",
  },
];

const AdminDashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("statistics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    {
      id: "statistics",
      title: "Dashboard",
      icon: BarChart3,
      href: "/admin/dashboard",
    },
    {
      id: "courses",
      title: "Analytics",
      icon: BookOpen,
      href: "/admin/CourseAnalytics",
    },
    {
      id: "users",
      title: "User Management",
      icon: Users,
      href: "/admin/UserManagement",
    },
    {
      id: "complaints",
      title: "Quản lí phản hồi khiếu nại",
      icon: MessageSquare,
      href: "/admin/ComplaintManagement",
    },
    {
      id: "settings",
      title: "Settings",
      icon: FiSettings,
      href: "/admin/settings",
    },
  ];

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-900`}>
      <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? "auto" : "0" }}
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-white dark:bg-gray-800 h-screen fixed transition-all duration-300 overflow-hidden z-30 shadow-lg`}
        >
          <div className="p-4">
            <div className="flex items-center mb-8 justify-center">
              <MdSchool className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">EduAnalytics</span>
            </div>
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                        activeMenuItem === item.id
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveMenuItem(item.id)}
                    >
                      <item.icon className="mr-3 w-5 h-5" />
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="absolute bottom-0 w-64 p-4 border-t dark:border-gray-700">
            <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
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
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors">
                  <Bell size={24} />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium">Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                icon={<Users className="w-8 h-8 text-blue-500" />}
                title="Tổng học viên"
                value="8,750"
              />
              <StatCard
                icon={<BookOpen className="w-8 h-8 text-green-500" />}
                title="Tổng khóa học"
                value="125"
              />
              <StatCard
                icon={<DollarSign className="w-8 h-8 text-purple-500" />}
                title="Doanh thu"
                value="327,500đ"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">
                  Doanh thu và số lượng bán
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="sales"
                      name="Số lượng bán"
                      fill="#8884d8"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      name="Doanh thu (đ)"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">Khóa học phổ biến</h2>
                <div className="flex">
                  <ResponsiveContainer width="60%" height={300}>
                    <PieChart>
                      <Pie
                        data={courseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-40 pt-6">
                    <h3 className="text-sm font-medium mb-2">Top khóa học</h3>
                    {courseData.map((course, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div
                          className="w-3 h-3 mr-2 rounded-full"
                          style={{ backgroundColor: course.color }}
                        ></div>
                        <div className="text-sm">{course.name}</div>
                        <div className="text-xs text-gray-500 ml-1">
                          {course.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Đăng ký gần đây</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Học viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Khóa học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Cấp độ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Số buổi học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Thời gian học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentRegistrations.map((registration) => (
                      <tr
                        key={registration.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {registration.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {registration.course}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {registration.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {registration.sessions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {registration.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {registration.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge status={registration.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center hover:shadow-lg transition-shadow">
      <div className="mr-4 bg-gray-100 dark:bg-gray-700 rounded-full p-3">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let color = "";
  switch (status) {
    case "Hoàn thành":
      color =
        "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      break;
    case "Đang xử lý":
      color =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      break;
    case "Hủy":
      color = "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200";
      break;
    default:
      color = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
    >
      {status}
    </span>
  );
};

export default AdminDashboard;
