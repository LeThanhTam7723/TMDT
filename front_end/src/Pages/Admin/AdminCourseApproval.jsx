// AdminCourseApproval.js - Complete Admin Course Approval Management System
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiEye,
  FiClock,
  FiUser,
  FiBook,
  FiDollarSign,
  FiCalendar,
  FiFilter,
  FiMessageSquare,
  FiEdit,
  FiTrash2,
  FiStar,
  FiUsers,
  FiAlertCircle,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import AdminLayout from "../../component/AdminLayout";
import AdminService from "../../API/AdminService";

const AdminCourseApproval = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // 'view', 'approve', 'reject'
  const [rejectionReason, setRejectionReason] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add states for consistent admin layout
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Lấy tất cả khóa học cho admin (bao gồm cả pending và approved)
        const response = await AdminService.getAllCoursesForAdmin();
        if (response.code === 200) {
          // Transform backend data to match frontend format
          const transformedRequests = response.result.map((course, index) => ({
            id: course.id,
            type: "create", // Default type, có thể customize sau
            course: {
              title: course.name,
              description: course.description,
              price: course.price,
              originalPrice: course.price * 1.2, // Temporary calculation
              duration: "25 hours", // Default duration
              level: "intermediate", // Default level
              category: course.categoryName,
              lessons: 20, // Default lessons count
              thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80", // Default thumbnail
            },
            seller: {
              id: course.sellerId,
              name: course.sellerName,
              email: `${course.sellerName.toLowerCase().replace(' ', '.')}@example.com`,
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?auto=format&fit=crop&w=100&q=80", // Default avatar
              rating: course.rating || 4.0,
              totalCourses: 5, // Default value
              totalStudents: 100, // Default value
            },
            status: course.status ? "approved" : "pending",
            submittedAt: new Date().toISOString(), // Default timestamp
            requestId: `REQ-${String(course.id).padStart(3, '0')}`,
            priority: "medium", // Default priority
          }));
          
          setRequests(transformedRequests);
          setFilteredRequests(transformedRequests);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to empty array if API fails
        setRequests([]);
        setFilteredRequests([]);
      }
    };

    fetchCourses();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = requests;

    if (filterStatus !== "all") {
      filtered = filtered.filter((request) => request.status === filterStatus);
    }

    if (filterType !== "all") {
      filtered = filtered.filter((request) => request.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.course.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.seller.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.course.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sort by priority and submission date
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });

    setFilteredRequests(filtered);
  }, [requests, filterStatus, filterType, searchTerm]);

  const handleApprove = async (requestId) => {
    try {
      // Gọi API phê duyệt khóa học
      const response = await AdminService.approveCourse(requestId);
      
      if (response.code === 200) {
        // Cập nhật state local sau khi API thành công
        setRequests((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  status: "approved",
                  approvedAt: new Date().toISOString(),
                  approvedBy: "Current Admin",
                }
              : request
          )
        );

        setShowModal(false);
        alert("Khóa học đã được phê duyệt thành công!");
      } else {
        alert(response.message || "Không thể phê duyệt khóa học.");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Lỗi khi phê duyệt yêu cầu.");
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason.trim()) {
      alert("Vui lòng cung cấp lý do từ chối.");
      return;
    }

    try {
      // Gọi API từ chối khóa học
      const response = await AdminService.rejectCourse(requestId, rejectionReason);
      
      if (response.code === 200) {
        // Xóa khóa học khỏi danh sách sau khi từ chối (vì backend sẽ xóa)
        setRequests((prev) =>
          prev.filter((request) => request.id !== requestId)
        );

        setShowModal(false);
        setRejectionReason("");
        alert("Khóa học đã bị từ chối và xóa khỏi hệ thống.");
      } else {
        alert(response.message || "Không thể từ chối khóa học.");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Lỗi khi từ chối yêu cầu.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
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

  const getTypeColor = (type) => {
    switch (type) {
      case "create":
        return "text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-200";
      case "update":
        return "text-purple-600 bg-purple-100 dark:bg-purple-800 dark:text-purple-200";
      case "delete":
        return "text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "create":
        return <FiPlus size={16} />;
      case "update":
        return <FiEdit size={16} />;
      case "delete":
        return <FiMinus size={16} />;
      default:
        return <FiAlertCircle size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalType("view");
    setShowModal(true);
  };

  const handleApproveModal = (request) => {
    setSelectedRequest(request);
    setModalType("approve");
    setShowModal(true);
  };

  const handleRejectModal = (request) => {
    setSelectedRequest(request);
    setModalType("reject");
    setShowModal(true);
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  return (
    <AdminLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="Course Approval - Phê duyệt khóa học"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chờ phê duyệt
              </p>
              <h3 className="text-2xl font-bold mt-2 text-yellow-600">
                {pendingCount}
              </h3>
            </div>
            <div className="text-yellow-500 text-3xl">
              <FiClock />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã phê duyệt
              </p>
              <h3 className="text-2xl font-bold mt-2 text-green-600">
                {approvedCount}
              </h3>
            </div>
            <div className="text-green-500 text-3xl">
              <FiCheck />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tổng khóa học
              </p>
              <h3 className="text-2xl font-bold mt-2 text-blue-600">
                {requests.length}
              </h3>
            </div>
            <div className="text-blue-500 text-3xl">
              <FiBook />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <label className="text-sm font-medium">Trạng thái:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ phê duyệt</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Loại yêu cầu:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Tất cả</option>
              <option value="create">Tạo mới</option>
              <option value="update">Cập nhật</option>
              <option value="delete">Xóa</option>
            </select>
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học, seller, mã yêu cầu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Course Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yêu cầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày gửi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                        {getTypeIcon(request.type)}
                        <span className="ml-1 capitalize">{request.type}</span>
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.requestId}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={request.course.thumbnail}
                        alt={request.course.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.course.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.course.category} • {request.course.level}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={request.seller.avatar}
                        alt={request.seller.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.seller.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FiStar className="w-3 h-3 text-yellow-400 mr-1" />
                          {request.seller.rating}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">
                        {request.status === "pending" && "Chờ duyệt"}
                        {request.status === "approved" && "Đã duyệt"}
                        {request.status === "rejected" && "Từ chối"}
                      </span>
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(request.submittedAt)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Xem chi tiết"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveModal(request)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Phê duyệt"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectModal(request)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Từ chối"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FiBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Không có yêu cầu nào
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Chưa có yêu cầu phê duyệt khóa học nào phù hợp với bộ lọc.
            </p>
          </div>
        )}
      </div>

      {/* Modal for viewing/approving/rejecting requests */}
      <AnimatePresence>
        {showModal && selectedRequest && (
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
              className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {modalType === "view" && "Chi tiết yêu cầu"}
                    {modalType === "approve" && "Phê duyệt khóa học"}
                    {modalType === "reject" && "Từ chối khóa học"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img
                      src={selectedRequest.course.thumbnail}
                      alt={selectedRequest.course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedRequest.course.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {selectedRequest.course.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <FiDollarSign className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium">
                          {selectedRequest.course.price?.toLocaleString()} VND
                        </span>
                        {selectedRequest.course.originalPrice && (
                          <span className="ml-2 text-gray-500 line-through">
                            {selectedRequest.course.originalPrice?.toLocaleString()} VND
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        <FiClock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{selectedRequest.course.duration}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FiBook className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{selectedRequest.course.lessons} bài học</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FiUsers className="w-4 h-4 mr-2 text-orange-500" />
                        <span>Cấp độ: {selectedRequest.course.level}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                    Thông tin Seller
                  </h5>
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedRequest.seller.avatar}
                      alt={selectedRequest.seller.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedRequest.seller.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedRequest.seller.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiStar className="w-3 h-3 text-yellow-400 mr-1" />
                        {selectedRequest.seller.rating} • {selectedRequest.seller.totalCourses} khóa học • {selectedRequest.seller.totalStudents} học viên
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                    Thông tin yêu cầu
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Mã yêu cầu:</span>
                      <span className="ml-2 font-medium">{selectedRequest.requestId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Loại:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getTypeColor(selectedRequest.type)}`}>
                        {selectedRequest.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Trạng thái:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Ngày gửi:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedRequest.submittedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3">
                  {modalType === "view" && selectedRequest.status === "pending" && (
                    <>
                      <button
                        onClick={() => setModalType("approve")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <FiCheck className="w-4 h-4 mr-2" />
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => setModalType("reject")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Từ chối
                      </button>
                    </>
                  )}
                  
                  {modalType === "approve" && (
                    <>
                      <button
                        onClick={() => setModalType("view")}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <FiCheck className="w-4 h-4 mr-2" />
                        Xác nhận phê duyệt
                      </button>
                    </>
                  )}
                  
                  {modalType === "reject" && (
                    <>
                      <div className="flex-1">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Nhập lý do từ chối..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600"
                          rows={3}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setModalType("view")}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Quay lại
                        </button>
                        <button
                          onClick={() => handleReject(selectedRequest.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                          disabled={!rejectionReason.trim()}
                        >
                          <FiX className="w-4 h-4 mr-2" />
                          Xác nhận từ chối
                        </button>
                      </div>
                    </>
                  )}
                  
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCourseApproval;
