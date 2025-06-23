import React, { useState } from "react";
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
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";
import AdminLayout from "../../component/AdminLayout";
import {
  FiDownload,
} from "react-icons/fi";
import {
  MdTrendingUp,
  MdSchool,
} from "react-icons/md";

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

const DashboardCard = ({ title, value, icon, percentage, trend = "up" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
            {value}
          </h3>
          <p
            className={`text-sm mt-2 ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend === "up" ? "+" : "-"}
            {percentage}%
          </p>
        </div>
        <div className="text-blue-500 text-3xl bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const CourseAnalytics = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("6months");

  // Mock data based on the course structure from the image
  const coursesData = [
    {
      courseid: 1,
      categoryid: 1,
      name: "IELTS 7.0+ Intensive Course",
      price: 199.99,
      rating: 4.8,
      sellerid: 2,
      status: 1,
      sales: 150,
      revenue: 29998.5,
    },
    {
      courseid: 2,
      categoryid: 1,
      name: "TOEIC Listening & Reading Pro",
      price: 149.99,
      rating: 4.5,
      sellerid: 3,
      status: 1,
      sales: 120,
      revenue: 17998.8,
    },
    {
      courseid: 3,
      categoryid: 2,
      name: "English Grammar Bootcamp",
      price: 89.99,
      rating: 4.7,
      sellerid: 4,
      status: 1,
      sales: 200,
      revenue: 17998,
    },
    {
      courseid: 4,
      categoryid: 3,
      name: "Business English for Meetings",
      price: 129,
      rating: 4.6,
      sellerid: 5,
      status: 1,
      sales: 80,
      revenue: 10320,
    },
    {
      courseid: 5,
      categoryid: 1,
      name: "Advanced IELTS Writing",
      price: 179.99,
      rating: 4.9,
      sellerid: 2,
      status: 1,
      sales: 90,
      revenue: 16199.1,
    },
    {
      courseid: 6,
      categoryid: 2,
      name: "Speaking Confidence Course",
      price: 99.99,
      rating: 4.4,
      sellerid: 3,
      status: 1,
      sales: 160,
      revenue: 15998.4,
    },
    {
      courseid: 7,
      categoryid: 3,
      name: "Professional Communication",
      price: 149,
      rating: 4.3,
      sellerid: 4,
      status: 1,
      sales: 110,
      revenue: 16390,
    },
    {
      courseid: 8,
      categoryid: 1,
      name: "TOEFL Complete Prep",
      price: 199,
      rating: 4.7,
      sellerid: 5,
      status: 1,
      sales: 75,
      revenue: 14925,
    },
  ];

  const categories = {
    1: "Test Preparation",
    2: "General English",
    3: "Business English",
  };

  const sellers = {
    2: "Teacher Anna",
    3: "Professor Smith",
    4: "English Expert Co.",
    5: "Business Language Academy",
  };

  // Filter data based on selections
  const filteredData = coursesData.filter((course) => {
    if (
      selectedSeller !== "all" &&
      course.sellerid !== parseInt(selectedSeller)
    )
      return false;
    if (
      selectedCategory !== "all" &&
      course.categoryid !== parseInt(selectedCategory)
    )
      return false;
    return true;
  });

  // Calculate statistics
  const totalRevenue = filteredData.reduce(
    (sum, course) => sum + course.revenue,
    0
  );
  const totalSales = filteredData.reduce(
    (sum, course) => sum + course.sales,
    0
  );
  const avgRating =
    filteredData.reduce((sum, course) => sum + course.rating, 0) /
    filteredData.length;
  const activeCourses = filteredData.length;

  // Revenue trend data (mock monthly data)
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [15000, 18000, 22000, 25000, 28000, totalRevenue / 6],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Category distribution
  const categoryData = {
    labels: Object.values(categories),
    datasets: [
      {
        data: Object.keys(categories).map((catId) =>
          filteredData
            .filter((course) => course.categoryid === parseInt(catId))
            .reduce((sum, course) => sum + course.revenue, 0)
        ),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  // Top sellers performance
  const sellerData = {
    labels: Object.values(sellers),
    datasets: [
      {
        label: "Revenue ($)",
        data: Object.keys(sellers).map((sellerId) =>
          filteredData
            .filter((course) => course.sellerid === parseInt(sellerId))
            .reduce((sum, course) => sum + course.revenue, 0)
        ),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Course performance by rating vs sales
  const performanceData = {
    labels: filteredData.map((course) => course.name.substring(0, 20) + "..."),
    datasets: [
      {
        label: "Sales",
        data: filteredData.map((course) => course.sales),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
      },
    ],
  };

  // Export function
  const exportData = () => {
    const csvContent = [
      [
        "Course ID",
        "Course Name",
        "Category",
        "Seller",
        "Price",
        "Rating",
        "Sales",
        "Revenue",
      ],
      ...filteredData.map((course) => [
        course.courseid,
        course.name,
        categories[course.categoryid],
        sellers[course.sellerid],
        course.price,
        course.rating,
        course.sales,
        course.revenue.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `course_analytics_${selectedSeller}_${selectedCategory}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="Course Analytics - Phân tích khóa học"
    >
      {/* Filters */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Seller</label>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="all">All Sellers</option>
              {Object.entries(sellers).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="all">All Categories</option>
              {Object.entries(categories).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiDownload size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          percentage="15.3"
          icon={<MdTrendingUp />}
        />
        <DashboardCard
          title="Total Sales"
          value={totalSales.toLocaleString()}
          percentage="8.7"
          icon={<MdSchool />}
        />
        <DashboardCard
          title="Active Courses"
          value={activeCourses}
          percentage="12.1"
          icon={<MdSchool />}
        />
        <DashboardCard
          title="Avg Rating"
          value={avgRating.toFixed(1)}
          percentage="2.4"
          icon={<MdTrendingUp />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Revenue Trend
          </h3>
          <Line
            data={revenueData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: darkMode ? "#374151" : "#f3f4f6",
                  },
                  ticks: {
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  },
                },
                x: {
                  grid: {
                    color: darkMode ? "#374151" : "#f3f4f6",
                  },
                  ticks: {
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  },
                },
              },
            }}
          />
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Revenue by Category
          </h3>
          <Pie
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  },
                },
              },
            }}
          />
        </motion.div>

        {/* Seller Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Top Sellers Performance
          </h3>
          <Bar
            data={sellerData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: darkMode ? "#374151" : "#f3f4f6",
                  },
                  ticks: {
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  },
                },
                x: {
                  grid: {
                    color: darkMode ? "#374151" : "#f3f4f6",
                  },
                  ticks: {
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  },
                },
              },
            }}
          />
        </motion.div>

        {/* Course Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Course Sales Performance
          </h3>
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: darkMode ? "#374151" : "#f3f4f6",
                  },
                  ticks: {
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  },
                },
                x: {
                  grid: {
                    color: darkMode ? "#374151" : "#f3f4f6",
                  },
                  ticks: {
                    color: darkMode ? "#9ca3af" : "#6b7280",
                    maxRotation: 45,
                  },
                },
              },
            }}
          />
        </motion.div>
      </div>

      {/* Course Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Course Performance Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((course) => (
                <tr
                  key={course.courseid}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                      {categories[course.categoryid]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sellers[course.sellerid]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${course.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {course.rating}
                      </span>
                      <span className="ml-1 text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {course.sales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${course.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default CourseAnalytics;
