// Enhanced SellerCourseManagement.js with Approval Workflow
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBook, FaChartLine, FaWallet, FaUndo } from "react-icons/fa";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiUsers,
  FiBook,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiAlertCircle,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import SellerService from "../API/SellerService";
import { ProductContext } from "../context/ProductContext";

import Swal from 'sweetalert2';

const sampleCourses = [
  {
    id: 1,
    name: "IELTS Intensive",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
    category: "IELTS",
    level: "Intermediate",
    status: "Active", // approved and active
    approvalStatus: "approved",
    rating: 4.8,
    totalHour: 30,
    lessons: 20,
    students: 320,
    description:
      "Boost your IELTS score with intensive practice and expert tips.",
    createdAt: "2024-01-15",
    lastModified: "2024-01-15",
  },
  {
    id: 2,
    name: "Business English Pro",
    price: 89.99,
    originalPrice: 119.99,
    image:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
    category: "Business English",
    level: "Upper Intermediate",
    status: "Active",
    approvalStatus: "approved",
    rating: 4.7,
    totalHour: 28,
    lessons: 18,
    students: 210,
    description:
      "Master business communication and professional English skills.",
    createdAt: "2024-01-20",
    lastModified: "2024-01-20",
  },
  {
    id: 3,
    name: "English for Kids",
    price: 59.99,
    originalPrice: 79.99,
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
    category: "Kids English",
    level: "Beginner",
    status: "Active",
    approvalStatus: "approved",
    rating: 4.9,
    totalHour: 22,
    lessons: 15,
    students: 400,
    description: "Fun and interactive English lessons for children.",
    createdAt: "2024-01-25",
    lastModified: "2024-01-25",
  },
  {
    id: 4,
    name: "Advanced TOEIC Preparation",
    price: 129.99,
    originalPrice: 159.99,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    category: "TOEIC",
    level: "Advanced",
    status: "Pending Review",
    approvalStatus: "pending",
    rating: 0,
    totalHour: 35,
    lessons: 25,
    students: 0,
    description:
      "Comprehensive TOEIC preparation with practice tests and strategies.",
    createdAt: "2024-02-01",
    lastModified: "2024-02-01",
    pendingType: "create",
  },
  {
    id: 5,
    name: "Conversational English Basics",
    price: 49.99,
    originalPrice: 69.99,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    category: "Conversation",
    level: "Beginner",
    status: "Rejected",
    approvalStatus: "rejected",
    rating: 0,
    totalHour: 20,
    lessons: 12,
    students: 0,
    description: "Basic conversational English for everyday situations.",
    createdAt: "2024-01-28",
    lastModified: "2024-01-30",
    rejectionReason:
      "Course content lacks sufficient detail and interactive elements. Please add more practical exercises and speaking activities.",
    pendingType: "create",
  },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");

  const tabs = [
    { id: "courses", label: "Quản lý khóa học", icon: <FaBook /> },
    { id: "revenue", label: "Doanh thu", icon: <FaChartLine /> },
    { id: "withdraw", label: "Rút tiền", icon: <FaWallet /> },
    { id: "refund", label: "Hoàn tiền", icon: <FaUndo /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return <CoursesTab />;
      case "revenue":
        return <RevenueTab />;
      case "withdraw":
        return <WithdrawTab />;
      case "refund":
        return <RefundTab />;
      default:
        return <CoursesTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Seller Dashboard</h2>
        </div>
        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : ""
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{renderTabContent()}</div>
    </div>
  );
};

// Enhanced CoursesTab with approval workflow
const CoursesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useContext(ProductContext);
  const navigate = useNavigate();

  // Get sellerId from session - user mlnhquxc has ID = 5
  const sellerId = session?.currentUser?.id || session?.user?.id || 5;

  // Load courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      // Don't fetch if no session or no token
      if (!session || !session.token) {
        console.warn('⚠️ No session or token available, skipping API call');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Fetching courses for sellerId:', sellerId);
        console.log('🔍 Current session:', session);
        console.log('🔍 Session token:', session?.token);
        const response = await SellerService.getSellerCourses(sellerId);
        if (response.code === 200) {
          // Transform backend data to match frontend structure
          const transformedCourses = response.result.map(course => ({
            id: course.id,
            name: course.name,
            price: course.price,
            description: course.description,
            rating: course.rating || 0,
            episodeCount: course.episodeCount || 0,
            duration: course.duration || 0,
            // Add default values for missing fields
            image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
            category: "General English",
            level: "Intermediate", 
            status: course.status ? "Active" : "Pending Review",
            approvalStatus: course.status ? "approved" : "pending",
            totalHour: Math.floor((course.duration || 0) / 60),
            lessons: course.episodeCount || 0,
            students: Math.floor(Math.random() * 500) + 50, // Mock data
            createdAt: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
          }));
          setCourses(transformedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Không thể tải danh sách khóa học');
        // Use sample data as fallback
        setCourses(sampleCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [sellerId, session]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesStatus =
      !selectedStatus || course.approvalStatus === selectedStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (approvalStatus) => {
    switch (approvalStatus) {
      case "approved":
        return <FiCheck size={16} />;
      case "pending":
        return <FiClock size={16} />;
      case "rejected":
        return <FiX size={16} />;
      default:
        return <FiAlertCircle size={16} />;
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa khóa học này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        const response = await SellerService.deleteCourse(sellerId, courseId);
        if (response.code === 200) {
          // Remove course from local state
          setCourses(prev => prev.filter(course => course.id !== courseId));
          
          Swal.fire(
            'Đã xóa!',
            'Khóa học đã được xóa thành công.',
            'success'
          );
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        Swal.fire(
          'Lỗi!',
          'Có lỗi xảy ra khi xóa khóa học.',
          'error'
        );
      }
    }
  };

  const handleEditCourse = (course) => {
    // Navigate to edit form
    navigate(`/seller/course/edit/${course.id}`, { 
      state: { 
        course,
        sellerId 
      }
    });
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleResubmitCourse = (courseId) => {
    // Resubmit rejected course for approval
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              approvalStatus: "pending",
              status: "Pending Review",
              rejectionReason: null,
            }
          : course
      )
    );
    alert("Khóa học đã được gửi lại để phê duyệt!");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách khóa học...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Có lỗi xảy ra
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khóa học</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            {filteredCourses.length} khóa học
          </span>
        </div>
        <Link
          to="/seller/course/new"
          state={{ sellerId }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <FaBook />
          Thêm khóa học mới
        </Link>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả cấp độ</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Upper Intermediate">Upper Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="approved">Đã phê duyệt</option>
          <option value="pending">Chờ phê duyệt</option>
          <option value="rejected">Bị từ chối</option>
        </select>
      </div>

      {/* Enhanced Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleViewCourse(course)}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                >
                  <FiEye className="text-gray-600" />
                </button>
                {course.approvalStatus === "approved" && (
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                  >
                    <FiEdit2 className="text-blue-600" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                >
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                  {course.level}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                    course.approvalStatus
                  )}`}
                >
                  {getStatusIcon(course.approvalStatus)}
                  {course.approvalStatus === "approved"
                    ? "Đã phê duyệt"
                    : course.approvalStatus === "pending"
                    ? "Chờ phê duyệt"
                    : "Bị từ chối"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {course.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <FiClock />
                  <span>{course.totalHour} hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiUsers />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiBook />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              {/* Rejection reason */}
              {course.approvalStatus === "rejected" &&
                course.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      <strong>Lý do từ chối:</strong> {course.rejectionReason}
                    </p>
                  </div>
                )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    ${course.price}
                  </span>
                  {course.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                </div>
                {course.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-sm text-gray-600">
                      {course.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons based on approval status */}
              <div className="flex gap-2">
                {course.approvalStatus === "rejected" && (
                  <button
                    onClick={() => handleResubmitCourse(course.id)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Gửi lại
                  </button>
                )}
                {course.approvalStatus === "pending" && (
                  <div className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm text-center">
                    Đang chờ phê duyệt
                  </div>
                )}
                {course.approvalStatus === "approved" && (
                  <div className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm text-center">
                    Đang hoạt động
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {showModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết khóa học
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.name}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {selectedCourse.name}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {selectedCourse.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Giá:
                    </span>
                    <p className="text-lg font-semibold text-blue-600">
                      ${selectedCourse.price}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Thời lượng:
                    </span>
                    <p>{selectedCourse.totalHour} giờ</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Cấp độ:
                    </span>
                    <p className="capitalize">{selectedCourse.level}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Danh mục:
                    </span>
                    <p>{selectedCourse.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Học viên:
                    </span>
                    <p>{selectedCourse.students} học viên</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Bài học:
                    </span>
                    <p>{selectedCourse.lessons} bài học</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Trạng thái phê duyệt:
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(
                      selectedCourse.approvalStatus
                    )}`}
                  >
                    {getStatusIcon(selectedCourse.approvalStatus)}
                    {selectedCourse.approvalStatus === "approved"
                      ? "Đã phê duyệt"
                      : selectedCourse.approvalStatus === "pending"
                      ? "Chờ phê duyệt"
                      : "Bị từ chối"}
                  </span>
                </div>

                {selectedCourse.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      <strong>Lý do từ chối:</strong>{" "}
                      {selectedCourse.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Revenue Tab with real API integration
const RevenueTab = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [sellerStats, setSellerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useContext(ProductContext);
  
  // Get sellerId from session - user mlnhquxc has ID = 5
  const sellerId = session?.currentUser?.id || session?.user?.id || 5;

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        
        // Fetch revenue and stats simultaneously
        const [revenueResponse, statsResponse] = await Promise.all([
          SellerService.getSellerRevenue(sellerId),
          SellerService.getSellerStats(sellerId)
        ]);
        
        if (revenueResponse.code === 200) {
          // Transform monthly data for chart
          const chartData = revenueResponse.result.monthlyData.map(item => ({
            month: item.month.substring(5), // Get MM from YYYY-MM
            value: item.revenue
          }));
          setRevenueData(chartData);
        }
        
        if (statsResponse.code === 200) {
          setSellerStats(statsResponse.result);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setError('Không thể tải dữ liệu doanh thu');
        
        // Fallback data
        setRevenueData([
          { month: "01", value: 1200 },
          { month: "02", value: 1800 },
          { month: "03", value: 900 },
          { month: "04", value: 2200 },
          { month: "05", value: 1700 },
          { month: "06", value: 2500 },
        ]);
        setSellerStats({
          totalRevenue: 12000,
          totalOrders: 150,
          totalStudents: 89,
          averageRating: 4.7
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu doanh thu...</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...revenueData.map((d) => d.value));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doanh thu</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-gray-800">
            ${sellerStats?.totalRevenue?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-gray-800">
            {sellerStats?.totalOrders || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Tổng học viên</h3>
          <p className="text-2xl font-bold text-gray-800">
            {sellerStats?.totalStudents || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Đánh giá trung bình</h3>
          <p className="text-2xl font-bold text-gray-800">
            {sellerStats?.averageRating?.toFixed(1) || '0.0'}★
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Biểu đồ doanh thu 6 tháng gần nhất
        </h3>
        <div className="flex items-end h-40 gap-4">
          {revenueData.map((d, idx) => (
            <div key={d.month} className="flex flex-col items-center flex-1">
              <div
                className="w-8 rounded-t bg-blue-500 transition-all duration-500"
                style={{ height: `${(d.value / maxValue) * 100}%` }}
                title={`$${d.value}`}
              ></div>
              <span className="mt-2 text-xs text-gray-500">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold px-6 pt-6 pb-2">
          Lịch sử giao dịch
        </h3>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã giao dịch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khóa học
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
            {/* Mock transactions for now - In real app, fetch from API */}
            {[
              { id: "TX001", date: "2024-06-01", course: "Course Example", amount: 79.99, status: "Thành công" },
              { id: "TX002", date: "2024-05-28", course: "Another Course", amount: 89.99, status: "Thành công" },
            ].map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {tx.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {tx.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {tx.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                  ${tx.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
            {sellerStats?.totalOrders === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Chưa có giao dịch nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const WithdrawTab = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Rút tiền</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Số dư khả dụng</h3>
          <p className="text-3xl font-bold text-blue-600">$0.00</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số tiền rút
            </label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nhập số tiền"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phương thức rút tiền
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Ngân hàng</option>
              <option>PayPal</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yêu cầu rút tiền
          </button>
        </form>
      </div>
    </div>
  );
};

const RefundTab = () => {
  const refundRequests = [
    {
      id: "RF001",
      course: "IELTS Intensive",
      reason: "Không hài lòng với nội dung",
      status: "Đang xử lý",
      date: "2024-06-01",
    },
    {
      id: "RF002",
      course: "Business English Pro",
      reason: "Đăng ký nhầm",
      status: "Đã hoàn tiền",
      date: "2024-05-28",
    },
    {
      id: "RF003",
      course: "English for Kids",
      reason: "Không phù hợp với trẻ",
      status: "Từ chối",
      date: "2024-05-20",
    },
  ];
  const statusColor = {
    "Đang xử lý": "bg-yellow-100 text-yellow-700",
    "Đã hoàn tiền": "bg-green-100 text-green-600",
    "Từ chối": "bg-red-100 text-red-600",
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hoàn tiền</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          {refundRequests.length} yêu cầu
        </span>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khóa học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lý do
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refundRequests.map((rf) => (
              <tr key={rf.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rf.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rf.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rf.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rf.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColor[rf.status]
                    }`}
                  >
                    {rf.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-xs font-medium mr-2 transition-colors">
                    Xem
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-xs font-medium transition-colors">
                    Liên hệ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerDashboard;
