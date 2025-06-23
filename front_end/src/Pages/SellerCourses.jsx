import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import SellerLayout from "../component/SellerLayout";
import { motion, AnimatePresence } from "framer-motion";
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
  FiDownload,
  FiCopy,
  FiMoreVertical,
  FiPlus,
} from "react-icons/fi";
import SellerService from "../API/SellerService";
import { ProductContext } from "../context/ProductContext";
import Swal from 'sweetalert2';

const SellerCourses = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const context = useContext(ProductContext);
  const session = context?.session;
  const navigate = useNavigate();

  // Get sellerId from session
  const sellerId = session?.currentUser?.id || session?.user?.id || 5;

  // Add safety check for context
  if (!context) {
    return (
      <SellerLayout darkMode={darkMode} setDarkMode={setDarkMode} title="Quản lý khóa học - Lỗi hệ thống">
        <div className="text-center py-20">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Lỗi hệ thống
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Không thể kết nối với context. Vui lòng tải lại trang.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tải lại
          </button>
        </div>
      </SellerLayout>
    );
  }

  // Load courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      if (!session || !session.token) {
        console.warn('⚠️ No session or token available, skipping API call');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await SellerService.getSellerCourses(sellerId);
        if (response.code === 200) {
          // Function to get image based on category or course name
          const getCourseImage = (course) => {
            const categoryImages = {
              1: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80", // IELTS
              2: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80", // Business English
              3: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80", // Kids English
              4: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80", // Conversation
              5: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80", // Grammar
              6: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"  // General English
            };
            
            // If course has an image field, use it
            if (course.image) {
              return course.image;
            }
            
            // Otherwise, use category-based image
            return categoryImages[course.categoryId] || categoryImages[6];
          };

          const getCategoryName = (categoryId) => {
            const categories = {
              1: "IELTS",
              2: "Business English", 
              3: "Kids English",
              4: "Conversation",
              5: "Grammar",
              6: "General English"
            };
            return categories[categoryId] || "General English";
          };

          // Transform backend data to match frontend structure
          const transformedCourses = response.result.map(course => ({
            id: course.id,
            name: course.name,
            price: course.price,
            description: course.description,
            rating: course.rating || 0,
            episodeCount: course.episodeCount || 0,
            duration: course.duration || 0,
            categoryId: course.categoryId,
            // Add default values for missing fields
            image: getCourseImage(course),
            category: getCategoryName(course.categoryId),
            level: course.level || "Intermediate", 
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
        setCourses([
          {
            id: 1,
            name: "IELTS Intensive",
            price: 199.99,
            description: "Comprehensive IELTS preparation course",
            rating: 4.8,
            episodeCount: 20,
            duration: 1200,
            categoryId: 1,
            image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
            category: "IELTS",
            level: "Intermediate",
            status: "Active",
            approvalStatus: "approved",
            totalHour: 20,
            lessons: 20,
            students: 45,
            createdAt: "2024-01-15",
            lastModified: "2024-01-15"
          },
          {
            id: 2,
            name: "Business English Pro",
            price: 149.99,
            description: "Professional English for business communication",
            rating: 4.6,
            episodeCount: 18,
            duration: 900,
            categoryId: 2,
            image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
            category: "Business English",
            level: "Advanced",
            status: "Active",
            approvalStatus: "approved",
            totalHour: 15,
            lessons: 18,
            students: 32,
            createdAt: "2024-01-20",
            lastModified: "2024-01-20"
          }
        ]);
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
    const matchesStatus = !selectedStatus || course.approvalStatus === selectedStatus;
    const matchesCategory = !selectedCategory || course.categoryId?.toString() === selectedCategory;
    return matchesSearch && matchesLevel && matchesStatus && matchesCategory;
  });

  const getStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
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

  const handleCreateCourse = () => {
    navigate('/seller/course/new');
  };

  const handleEditCourse = (course) => {
    navigate(`/seller/course/${course.id}/edit`, { 
      state: { 
        course,
        sellerId 
      }
    });
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
          setCourses(prev => prev.filter(course => course.id !== courseId));
          Swal.fire('Đã xóa!', 'Khóa học đã được xóa thành công.', 'success');
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa khóa học.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <SellerLayout darkMode={darkMode} setDarkMode={setDarkMode} title="Quản lý khóa học - Đang tải...">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải khóa học...</p>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="Quản lý khóa học"
    >
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý khóa học</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tổng cộng {courses.length} khóa học
          </p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus size={20} />
          Tạo khóa học mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả cấp độ</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="approved">Đã phê duyệt</option>
            <option value="pending">Chờ phê duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            <option value="1">IELTS</option>
            <option value="2">Business English</option>
            <option value="3">Kids English</option>
            <option value="4">Conversation</option>
            <option value="5">Grammar</option>
            <option value="6">General English</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <FiBook className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có khóa học</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || selectedLevel || selectedStatus || selectedCategory
              ? "Không tìm thấy khóa học phù hợp với bộ lọc"
              : "Bắt đầu bằng cách tạo khóa học đầu tiên của bạn"}
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreateCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <FiPlus size={20} />
              Tạo khóa học mới
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden relative group">
                <img
                  src={course.image || "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80";
                  }}
                  loading="lazy"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <FiEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs font-medium">
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

                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {course.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <FiClock />
                    <span>{course.totalHour} giờ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers />
                    <span>{course.students} HV</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiBook />
                    <span>{course.lessons} bài</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${course.price}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/detail/${course.id}`)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Xem chi tiết"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Xóa"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerCourses; 