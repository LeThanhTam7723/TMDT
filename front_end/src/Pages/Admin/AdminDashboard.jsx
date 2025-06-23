import React, { useState } from "react";
import AdminLayout from "../../component/AdminLayout";
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
  Users,
  BookOpen,
  DollarSign,
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
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AdminLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="Dashboard - Tổng quan hệ thống"
    >
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
      </AdminLayout>
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
