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
  FiSearch,
  FiMessageSquare,
  FiEdit,
  FiTrash2,
  FiStar,
  FiUsers,
  FiAlertCircle,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import {
  BarChart3,
  Users,
  BookOpen,
  ShoppingCart,
  Star,
  MessageSquare,
} from "lucide-react";

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

  const menuItems = [
    {
      id: "statistics",
      title: "Thống kê",
      icon: BarChart3,
      href: "/admin/dashboard",
    },
    {
      id: "users",
      title: "Quản lí người dùng",
      icon: Users,
      href: "/admin/UserManagement",
    },
    {
      id: "courses",
      title: "Quản lí khóa học",
      icon: BookOpen,
      href: "/admin/CourseAnalytics",
    },
    {
      id: "course-approval",
      title: "Phê duyệt khóa học",
      icon: FiCheck,
      href: "/admin/course-approval",
      active: true,
    },
    {
      id: "orders",
      title: "Quản lí đơn hàng",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      id: "reviews",
      title: "Quản lí đánh giá",
      icon: Star,
      href: "/admin/reviews",
    },
    {
      id: "complaints",
      title: "Report",
      icon: MessageSquare,
      href: "/admin/ComplaintManagement",
    },
    {
      id: "complaints",
      title: "Request Course from seller",
      icon: MessageSquare,
      href: "/admin/course-approval",
    },
  ];

  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        type: "create",
        course: {
          title: "Advanced TOEIC Preparation",
          description:
            "Comprehensive TOEIC preparation with practice tests and strategies for achieving high scores.",
          price: 129.99,
          originalPrice: 159.99,
          duration: "35 hours",
          level: "advanced",
          category: "TOEIC",
          lessons: 25,
          thumbnail:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
        },
        seller: {
          id: 101,
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b829?auto=format&fit=crop&w=100&q=80",
          rating: 4.8,
          totalCourses: 12,
          totalStudents: 1250,
        },
        status: "pending",
        submittedAt: "2024-02-15T10:30:00Z",
        requestId: "REQ-001",
        priority: "high",
      },
      {
        id: 2,
        type: "update",
        course: {
          title: "Business English Pro",
          description:
            "Updated content with more practical scenarios, real-world case studies, and interactive exercises.",
          price: 89.99,
          originalPrice: 119.99,
          duration: "28 hours",
          level: "upper intermediate",
          category: "Business English",
          lessons: 18,
          thumbnail:
            "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
        },
        seller: {
          id: 102,
          name: "Mike Chen",
          email: "mike.chen@example.com",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
          rating: 4.6,
          totalCourses: 8,
          totalStudents: 890,
        },
        status: "pending",
        submittedAt: "2024-02-14T15:45:00Z",
        requestId: "REQ-002",
        priority: "medium",
        changes: [
          "Updated course description with more details",
          "Added 3 new practical exercises",
          "Enhanced video content quality",
          "Updated pricing structure",
        ],
      },
      {
        id: 3,
        type: "delete",
        course: {
          title: "Conversational English Basics",
          description: "Basic conversational English for everyday situations.",
          price: 49.99,
          originalPrice: 69.99,
          duration: "20 hours",
          level: "beginner",
          category: "Conversation",
          lessons: 12,
          thumbnail:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        },
        seller: {
          id: 103,
          name: "Emma Wilson",
          email: "emma.wilson@example.com",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
          rating: 4.2,
          totalCourses: 5,
          totalStudents: 320,
        },
        status: "pending",
        submittedAt: "2024-02-13T09:20:00Z",
        requestId: "REQ-003",
        priority: "low",
        deleteReason:
          "Course content is outdated and needs complete restructuring",
      },
      {
        id: 4,
        type: "create",
        course: {
          title: "IELTS Speaking Mastery",
          description:
            "Master IELTS Speaking with expert tips, practice sessions, and mock interviews.",
          price: 109.99,
          originalPrice: 139.99,
          duration: "25 hours",
          level: "intermediate",
          category: "IELTS",
          lessons: 20,
          thumbnail:
            "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
        },
        seller: {
          id: 104,
          name: "David Kim",
          email: "david.kim@example.com",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
          rating: 4.9,
          totalCourses: 15,
          totalStudents: 2100,
        },
        status: "approved",
        submittedAt: "2024-02-12T14:15:00Z",
        approvedAt: "2024-02-12T16:30:00Z",
        requestId: "REQ-004",
        priority: "high",
        approvedBy: "Admin John",
      },
      {
        id: 5,
        type: "create",
        course: {
          title: "Basic Grammar Course",
          description: "Learn English grammar basics.",
          price: 29.99,
          originalPrice: 39.99,
          duration: "15 hours",
          level: "beginner",
          category: "Grammar",
          lessons: 10,
          thumbnail:
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
        },
        seller: {
          id: 105,
          name: "Lisa Brown",
          email: "lisa.brown@example.com",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
          rating: 3.8,
          totalCourses: 3,
          totalStudents: 150,
        },
        status: "rejected",
        submittedAt: "2024-02-11T11:00:00Z",
        rejectedAt: "2024-02-11T13:45:00Z",
        rejectionReason:
          "Course content lacks depth and detailed curriculum. Grammar examples are insufficient and exercises need improvement.",
        requestId: "REQ-005",
        priority: "low",
        rejectedBy: "Admin Sarah",
      },
    ];
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
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
      // API call would go here
      // await approveCourseRequest(requestId)

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
      // API call would go here
      // await rejectCourseRequest(requestId, rejectionReason)

      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "rejected",
                rejectedAt: new Date().toISOString(),
                rejectionReason,
                rejectedBy: "Current Admin",
              }
            : request
        )
      );

      setShowModal(false);
      setRejectionReason("");
      alert("Khóa học đã bị từ chối.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Lỗi khi từ chối yêu cầu.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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
        return "text-blue-600 bg-blue-100";
      case "update":
        return "text-purple-600 bg-purple-100";
      case "delete":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý phê duyệt khóa học
            </h1>
            <p className="text-gray-600 mt-2">
              Phê duyệt và quản lý các yêu cầu khóa học từ giảng viên
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </div>
              <div className="text-sm text-gray-600">Chờ phê duyệt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {approvedCount}
              </div>
              <div className="text-sm text-gray-600">Đã phê duyệt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {rejectedCount}
              </div>
              <div className="text-sm text-gray-600">Đã từ chối</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên khóa học, giảng viên, mã yêu cầu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ phê duyệt</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại yêu cầu</option>
              <option value="create">Tạo mới</option>
              <option value="update">Cập nhật</option>
              <option value="delete">Xóa khóa học</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={request.course.thumbnail}
                      alt={request.course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.course.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(
                            request.type
                          )}`}
                        >
                          {getTypeIcon(request.type)}
                          {request.type === "create"
                            ? "Tạo mới"
                            : request.type === "update"
                            ? "Cập nhật"
                            : "Xóa khóa học"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status === "pending"
                            ? "Chờ phê duyệt"
                            : request.status === "approved"
                            ? "Đã phê duyệt"
                            : "Đã từ chối"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            request.priority
                          )}`}
                        >
                          {request.priority === "high"
                            ? "Ưu tiên cao"
                            : request.priority === "medium"
                            ? "Ưu tiên trung bình"
                            : "Ưu tiên thấp"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Mã yêu cầu: {request.requestId}
                    </div>
                    <div className="text-sm text-gray-500">
                      Gửi lúc: {formatDate(request.submittedAt)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thông tin khóa học
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Danh mục: {request.course.category}</div>
                      <div>Cấp độ: {request.course.level}</div>
                      <div>Giá: ${request.course.price}</div>
                      <div>Thời lượng: {request.course.duration}</div>
                      <div>Số bài học: {request.course.lessons}</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {request.course.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thông tin giảng viên
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={request.seller.avatar}
                        alt={request.seller.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {request.seller.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {request.seller.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400" />
                        Đánh giá: {request.seller.rating}/5
                      </div>
                      <div>Tổng khóa học: {request.seller.totalCourses}</div>
                      <div>Tổng học viên: {request.seller.totalStudents}</div>
                    </div>
                  </div>
                </div>

                {/* Additional info for updates and deletes */}
                {request.type === "update" && request.changes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Các thay đổi:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {request.changes.map((change, index) => (
                        <li key={index}>{change}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {request.type === "delete" && request.deleteReason && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Lý do xóa:
                    </h4>
                    <p className="text-sm text-gray-600">
                      {request.deleteReason}
                    </p>
                  </div>
                )}

                {/* Rejection reason */}
                {request.status === "rejected" && request.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-1">
                      Lý do từ chối:
                    </h4>
                    <p className="text-sm text-red-600">
                      {request.rejectionReason}
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      Từ chối bởi: {request.rejectedBy} -{" "}
                      {formatDate(request.rejectedAt)}
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <FiEye size={16} />
                    Xem chi tiết
                  </button>

                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApproveModal(request)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <FiCheck size={16} />
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => handleRejectModal(request)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <FiX size={16} />
                        Từ chối
                      </button>
                    </>
                  )}

                  {request.status === "approved" && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <FiCheck size={16} />
                      Đã phê duyệt bởi {request.approvedBy} -{" "}
                      {formatDate(request.approvedAt)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FiBook size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có yêu cầu nào
            </h3>
            <p className="text-gray-600">
              Không tìm thấy yêu cầu nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        )}

        {/* Modal */}
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
                className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalType === "view"
                      ? "Chi tiết yêu cầu"
                      : modalType === "approve"
                      ? "Phê duyệt yêu cầu"
                      : "Từ chối yêu cầu"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img
                      src={selectedRequest.course.thumbnail}
                      alt={selectedRequest.course.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedRequest.course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedRequest.course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Giá:</span>
                        <p className="text-blue-600 font-semibold">
                          ${selectedRequest.course.price}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Thời lượng:
                        </span>
                        <p>{selectedRequest.course.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Cấp độ:
                        </span>
                        <p className="capitalize">
                          {selectedRequest.course.level}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Danh mục:
                        </span>
                        <p>{selectedRequest.course.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Số bài học:
                        </span>
                        <p>{selectedRequest.course.lessons} bài</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Loại yêu cầu:
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                            selectedRequest.type
                          )}`}
                        >
                          {selectedRequest.type === "create"
                            ? "Tạo mới"
                            : selectedRequest.type === "update"
                            ? "Cập nhật"
                            : "Xóa khóa học"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Thông tin giảng viên
                    </h4>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={selectedRequest.seller.avatar}
                        alt={selectedRequest.seller.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {selectedRequest.seller.name}
                        </h5>
                        <p className="text-gray-600">
                          {selectedRequest.seller.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Đánh giá:</span>
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-400 fill-current" />
                          <span className="font-medium">
                            {selectedRequest.seller.rating}/5
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tổng khóa học:</span>
                        <span className="font-medium">
                          {selectedRequest.seller.totalCourses}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tổng học viên:</span>
                        <span className="font-medium">
                          {selectedRequest.seller.totalStudents}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Thông tin yêu cầu
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Mã yêu cầu:</span>
                          <span className="ml-2 font-medium">
                            {selectedRequest.requestId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ngày gửi:</span>
                          <span className="ml-2">
                            {formatDate(selectedRequest.submittedAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ưu tiên:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                              selectedRequest.priority
                            )}`}
                          >
                            {selectedRequest.priority === "high"
                              ? "Cao"
                              : selectedRequest.priority === "medium"
                              ? "Trung bình"
                              : "Thấp"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedRequest.type === "update" &&
                      selectedRequest.changes && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Các thay đổi:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {selectedRequest.changes.map((change, index) => (
                              <li key={index}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>

                {/* Modal Actions */}
                {modalType === "view" && (
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    {selectedRequest.status === "pending" && (
                      <>
                        <button
                          onClick={() => setModalType("approve")}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FiCheck size={16} />
                          Phê duyệt
                        </button>
                        <button
                          onClick={() => setModalType("reject")}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FiX size={16} />
                          Từ chối
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                )}

                {modalType === "approve" && (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-green-800 mb-2">
                        Xác nhận phê duyệt
                      </h4>
                      <p className="text-green-700 text-sm">
                        Bạn có chắc chắn muốn phê duyệt yêu cầu này? Khóa học sẽ
                        được công khai và có thể bán trên nền tảng.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FiCheck size={16} />
                        Xác nhận phê duyệt
                      </button>
                      <button
                        onClick={() => setModalType("view")}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Quay lại
                      </button>
                    </div>
                  </div>
                )}

                {modalType === "reject" && (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-red-800 mb-2">
                        Từ chối yêu cầu
                      </h4>
                      <p className="text-red-700 text-sm mb-3">
                        Vui lòng cung cấp lý do từ chối để giảng viên có thể cải
                        thiện khóa học.
                      </p>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        rows="4"
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReject(selectedRequest.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        disabled={!rejectionReason.trim()}
                      >
                        <FiX size={16} />
                        Xác nhận từ chối
                      </button>
                      <button
                        onClick={() => {
                          setModalType("view");
                          setRejectionReason("");
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Quay lại
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCourseApproval;
