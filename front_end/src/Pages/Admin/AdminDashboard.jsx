import React, { useState } from "react";
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
import { Bell, Users, BookOpen, DollarSign, LogOut } from "lucide-react";
import logo from "../../assets/images/logo.jpg";

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6 border-b flex justify-center items-center">
          <img src={logo} alt="FAHASA Logo" className="h-16" />
        </div>
        <nav className="mt-2">
          <MenuItem
            title="Quản lí người dùng"
            active={activeMenuItem === "users"}
            onClick={() => setActiveMenuItem("users")}
          />
          <MenuItem
            title="Quản lí đơn hàng"
            active={activeMenuItem === "orders"}
            onClick={() => setActiveMenuItem("orders")}
          />
          <MenuItem
            title="Thống kê"
            active={activeMenuItem === "statistics"}
            onClick={() => setActiveMenuItem("statistics")}
          />
          <MenuItem
            title="Quản lí đánh giá"
            active={activeMenuItem === "reviews"}
            onClick={() => setActiveMenuItem("reviews")}
          />
          <MenuItem
            title="Quản lí phản hồi khiếu nại"
            active={activeMenuItem === "complaints"}
            onClick={() => setActiveMenuItem("complaints")}
          />
          <MenuItem
            title="Quản lí khóa học"
            active={activeMenuItem === "courses"}
            onClick={() => setActiveMenuItem("courses")}
          />
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button className="flex items-center text-gray-700">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

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
            <div className="ml-4">
              <img
                src="/api/placeholder/32/32"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
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
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">
                Doanh thu và số lượng bán
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
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

            <div className="bg-white p-4 rounded-lg shadow">
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
                        className="w-3 h-3 mr-2"
                        style={{ backgroundColor: course.color }}
                      ></div>
                      <div className="text-sm">{course.name}</div>
                      <div className="text-xs text-gray-500 ml-1">
                        {course.value} học viên
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Đăng ký gần đây</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Học viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cấp độ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số buổi học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian học (Dự kiến)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {registration.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.sessions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
  );
};

// Helper components
const MenuItem = ({ title, active, onClick }) => {
  return (
    <button
      className={`flex items-center w-full px-4 py-3 text-left ${
        active
          ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
          : "text-gray-700"
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center">
      <div className="mr-4 bg-gray-100 rounded-full p-3">{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let color = "";
  switch (status) {
    case "Hoàn thành":
      color = "bg-green-100 text-green-800";
      break;
    case "Đang xử lý":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "Hủy":
      color = "bg-red-100 text-red-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
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
