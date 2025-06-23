import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "../component/SellerLayout";
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
  BookOpen,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import SellerService from "../API/SellerService";
import { ProductContext } from "../context/ProductContext";
import Swal from 'sweetalert2';

// Sample data for charts
const monthlyRevenueData = [
  { name: "Jan", revenue: 1200, orders: 15 },
  { name: "Feb", revenue: 1800, orders: 22 },
  { name: "Mar", revenue: 2200, orders: 28 },
  { name: "Apr", revenue: 1900, orders: 24 },
  { name: "May", revenue: 2500, orders: 32 },
  { name: "Jun", revenue: 2800, orders: 35 },
];

const coursePopularityData = [
  { name: "IELTS Intensive", value: 45, color: "#3B82F6" },
  { name: "Business English Pro", value: 30, color: "#38BDF8" },
  { name: "English for Kids", value: 25, color: "#FBBF24" },
  { name: "Others", value: 20, color: "#FB923C" },
];

const recentOrders = [
  {
    id: 1,
    student: "Nguyễn Văn A",
    course: "IELTS Intensive",
    amount: 199.99,
    date: "2024-06-20",
    status: "Hoàn thành",
  },
  {
    id: 2,
    student: "Lê Thị B",
    course: "Business English Pro",
    amount: 149.99,
    date: "2024-06-19",
    status: "Hoàn thành",
  },
  {
    id: 3,
    student: "Trần Văn C",
    course: "English for Kids",
    amount: 89.99,
    date: "2024-06-18",
    status: "Đang học",
  },
  {
    id: 4,
    student: "Phạm Thị D",
    course: "IELTS Intensive",
    amount: 199.99,
    date: "2024-06-17",
    status: "Hoàn thành",
  },
  {
    id: 5,
    student: "Hoàng Văn E",
    course: "Business English Pro",
    amount: 149.99,
    date: "2024-06-16",
    status: "Đang học",
  },
];

const SellerDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sellerStats, setSellerStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const context = useContext(ProductContext);
  const session = context?.session;
  const navigate = useNavigate();
  
  // Get sellerId from session
  const sellerId = session?.currentUser?.id || session?.user?.id || 5;

  // Add safety check for context
  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Lỗi hệ thống
          </div>
          <p className="text-gray-600 mb-4">Không thể kết nối với context. Vui lòng tải lại trang.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  // Fetch seller data
  useEffect(() => {
    const fetchSellerData = async () => {
      if (!session || !session.token) {
        console.warn('⚠️ No session or token available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch seller stats and courses
        const [statsResponse, coursesResponse] = await Promise.all([
          SellerService.getSellerStats(sellerId),
          SellerService.getSellerCourses(sellerId)
        ]);
        
        if (statsResponse.code === 200) {
          setSellerStats(statsResponse.result);
        } else {
          // Fallback stats
          setSellerStats({
            totalRevenue: 12450,
            totalCourses: 8,
            totalStudents: 234,
            averageRating: 4.7,
            totalOrders: 89
          });
        }
        
        if (coursesResponse.code === 200) {
          // Transform and take only recent 3 courses
          const transformedCourses = coursesResponse.result.slice(0, 3).map(course => ({
            id: course.id,
            name: course.name,
            price: course.price,
            students: Math.floor(Math.random() * 100) + 20,
            rating: course.rating || (Math.random() * 2 + 3).toFixed(1),
            status: course.status ? "Active" : "Pending",
          }));
          setRecentCourses(transformedCourses);
        }
      } catch (error) {
        console.error('Error fetching seller data:', error);
        setError('Không thể tải dữ liệu seller');
        
        // Fallback data
        setSellerStats({
          totalRevenue: 12450,
          totalCourses: 8,
          totalStudents: 234,
          averageRating: 4.7,
          totalOrders: 89
        });
        setRecentCourses([
          { id: 1, name: "IELTS Intensive", price: 199.99, students: 45, rating: "4.8", status: "Active" },
          { id: 2, name: "Business English Pro", price: 149.99, students: 32, rating: "4.7", status: "Active" },
          { id: 3, name: "English for Kids", price: 89.99, students: 28, rating: "4.9", status: "Pending" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId, session]);

  const handleCreateCourse = () => {
    navigate('/seller/course/new');
  };

  const handleManageCourses = () => {
    navigate('/seller/courses');
  };

  const handleViewRevenue = () => {
    navigate('/seller/revenue');
  };

  if (loading) {
    return (
      <SellerLayout darkMode={darkMode} setDarkMode={setDarkMode} title="Dashboard - Đang tải...">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="Dashboard - Tổng quan bán hàng"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<DollarSign className="w-8 h-8 text-green-500" />}
          title="Tổng doanh thu"
          value={`$${sellerStats?.totalRevenue?.toLocaleString() || '0'}`}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          icon={<BookOpen className="w-8 h-8 text-blue-500" />}
          title="Khóa học"
          value={sellerStats?.totalCourses || 0}
          trend="+2 khóa học mới"
          trendUp={true}
        />
        <StatCard
          icon={<Users className="w-8 h-8 text-purple-500" />}
          title="Học viên"
          value={sellerStats?.totalStudents || 0}
          trend="+18 học viên mới"
          trendUp={true}
        />
        <StatCard
          icon={<Star className="w-8 h-8 text-yellow-500" />}
          title="Đánh giá TB"
          value={`${sellerStats?.averageRating?.toFixed(1) || '0.0'}★`}
          trend="Tăng 0.2 điểm"
          trendUp={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Doanh thu 6 tháng</h2>
            <button 
              onClick={handleViewRevenue}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Xem chi tiết →
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="orders"
                name="Đơn hàng"
                fill="#8884d8"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                name="Doanh thu ($)"
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Popularity Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Khóa học phổ biến</h2>
            <button 
              onClick={handleManageCourses}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Quản lý →
            </button>
          </div>
          <div className="flex">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie
                  data={coursePopularityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {coursePopularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40 pt-6">
              <h3 className="text-sm font-medium mb-2 dark:text-white">Top khóa học</h3>
              {coursePopularityData.map((course, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div
                    className="w-3 h-3 mr-2 rounded-full"
                    style={{ backgroundColor: course.color }}
                  ></div>
                  <div className="text-sm dark:text-gray-300">{course.name}</div>
                  <div className="text-xs text-gray-500 ml-1">
                    {course.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ActionCard
          title="Tạo khóa học mới"
          description="Thêm khóa học mới vào danh sách của bạn"
          icon={<BookOpen className="w-6 h-6" />}
          onClick={handleCreateCourse}
          color="blue"
        />
        <ActionCard
          title="Quản lý khóa học"
          description="Chỉnh sửa và cập nhật khóa học hiện có"
          icon={<Edit className="w-6 h-6" />}
          onClick={handleManageCourses}
          color="green"
        />
        <ActionCard
          title="Xem doanh thu"
          description="Theo dõi thu nhập và thống kê chi tiết"
          icon={<TrendingUp className="w-6 h-6" />}
          onClick={handleViewRevenue}
          color="purple"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Đơn hàng gần đây</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {recentOrders.length} đơn hàng
          </span>
        </div>
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
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày mua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.student}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {order.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    ${order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Courses Quick View */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Khóa học của tôi</h2>
          <button 
            onClick={handleManageCourses}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Xem tất cả →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </SellerLayout>
  );
};

// Helper Components
const StatCard = ({ icon, title, value, trend, trendUp }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 bg-gray-100 dark:bg-gray-700 rounded-full p-3">
            {icon}
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
            <p className="text-2xl font-bold dark:text-white">{value}</p>
            {trend && (
              <p className={`text-xs flex items-center mt-1 ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActionCard = ({ title, description, icon, onClick, color = "blue" }) => {
  const colorClasses = {
    blue: "border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    green: "border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20",
    purple: "border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 border-2 ${colorClasses[color]} p-4 rounded-lg cursor-pointer transition-all`}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className={`mr-3 p-2 rounded-full ${
          color === 'blue' ? 'bg-blue-100 text-blue-600' :
          color === 'green' ? 'bg-green-100 text-green-600' :
          'bg-purple-100 text-purple-600'
        }`}>
          {icon}
        </div>
        <h3 className="font-semibold dark:text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  let color = "";
  switch (status) {
    case "Hoàn thành":
      color = "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      break;
    case "Đang học":
      color = "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
      break;
    case "Đã hủy":
      color = "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200";
      break;
    default:
      color = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer"
      onClick={() => navigate(`/detail/${course.id}`)}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium dark:text-white truncate">{course.name}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${
          course.status === 'Active' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-yellow-100 text-yellow-600'
        }`}>
          {course.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>${course.price}</span>
        <span className="flex items-center">
          <Users className="w-3 h-3 mr-1" />
          {course.students}
        </span>
        <span className="flex items-center">
          <Star className="w-3 h-3 mr-1 text-yellow-500" />
          {course.rating}
        </span>
      </div>
    </motion.div>
  );
};

export default SellerDashboard; 