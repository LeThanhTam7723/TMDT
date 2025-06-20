import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiEye,
  FiTrash2,
  FiSend,
  FiX,
  FiClock,
  FiMail,
} from "react-icons/fi";
import {
  MdDashboard,
  MdAnalytics,
  MdPeople,
  MdReport,
  MdFeedback,
} from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs";
import axiosClient from "../../API/axiosClient";

const api = {
  getAllReports: async () => {
    try {
      const response = await axiosClient.get("/reports/all");
      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result;
      }
      return [];
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },
};

const ComplaintManagement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await api.getAllReports();

        const transformedData = data.map((item) => ({
          id: item.id.toString(),
          userId: item.userEmail,
          courseId: item.courseName,
          userName: item.userFullName,
          userEmail: item.userEmail,
          courseTitle: item.courseName,
          date: item.date,
          status: item.status,
          priority: item.priority.toLowerCase(),
          category: item.category,
          subject: item.subject,
          detail: item.detail,
        }));

        setComplaints(transformedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
        setError("Không thể tải danh sách khiếu nại. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter and sort complaints
  const sortedComplaints = complaints
    .filter(
      (complaint) =>
        complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") +
      " " +
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100 dark:bg-red-900";
      case "medium":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900";
      case "low":
        return "text-green-500 bg-green-100 dark:bg-green-900";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-700";
    }
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
    setResponse("");
  };

  const handleSendResponse = () => {
    if (response.trim()) {
      // TODO: Implement API call to send response
      alert(
        `Đã gửi phản hồi cho ${selectedComplaint.userName}:\n"${response}"`
      );

      // Remove complaint from list (simulate resolution)
      setComplaints(complaints.filter((c) => c.id !== selectedComplaint.id));

      setShowModal(false);
      setSelectedComplaint(null);
      setResponse("");
    }
  };

  const handleDeleteComplaint = (complaintId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khiếu nại này?")) {
      // TODO: Implement API call to delete complaint
      setComplaints(complaints.filter((c) => c.id !== complaintId));
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await api.getAllReports();
      const transformedData = data.map((item) => ({
        id: item.id.toString(),
        userId: item.userEmail,
        courseId: item.courseName,
        userName: item.userFullName,
        userEmail: item.userEmail,
        courseTitle: item.courseName,
        date: item.date,
        status: item.status,
        priority: item.priority.toLowerCase(),
        category: item.category,
        subject: item.subject,
        detail: item.detail,
      }));
      setComplaints(transformedData);
      setError(null);
    } catch (err) {
      setError("Không thể tải lại danh sách khiếu nại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-900`}>
      <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? "auto" : "0" }}
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-white dark:bg-gray-800 h-screen fixed transition-all duration-300 z-10`}
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
                  <a
                    href="/admin/dashboard"
                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <MdDashboard className="mr-3" /> Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/CourseAnalytics"
                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <MdAnalytics className="mr-3" /> Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/UserManagement"
                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <MdPeople className="mr-3" /> User Management
                  </a>
                </li>
                <li className="bg-blue-500 text-white rounded-lg">
                  <a
                    href="/admin/ComplaintManagement"
                    className="flex items-center p-3"
                  >
                    <MdReport className="mr-3" /> Reports
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FiSettings className="mr-3" /> Settings
                  </a>
                </li>
              </ul>
            </nav>
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
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiMenu size={24} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm khiếu nại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg pl-10 pr-4 py-2 w-64"
                  />
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Làm mới dữ liệu"
                >
                  🔄
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell size={24} />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {complaints.length}
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
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Quản Lý Khiếu Nại</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Tổng cộng có {complaints.length} khiếu nại đang chờ xử lý
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Tổng khiếu nại
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                      {complaints.length}
                    </h3>
                  </div>
                  <div className="text-blue-500 text-3xl">
                    <MdFeedback />
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
                      Ưu tiên cao
                    </p>
                    <h3 className="text-2xl font-bold mt-2 text-red-500">
                      {complaints.filter((c) => c.priority === "high").length}
                    </h3>
                  </div>
                  <div className="text-red-500 text-3xl">
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
                      Ưu tiên trung bình
                    </p>
                    <h3 className="text-2xl font-bold mt-2 text-yellow-500">
                      {complaints.filter((c) => c.priority === "medium").length}
                    </h3>
                  </div>
                  <div className="text-yellow-500 text-3xl">
                    <FiMail />
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
                      Ưu tiên thấp
                    </p>
                    <h3 className="text-2xl font-bold mt-2 text-green-500">
                      {complaints.filter((c) => c.priority === "low").length}
                    </h3>
                  </div>
                  <div className="text-green-500 text-3xl">
                    <FiUser />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">Danh Sách Khiếu Nại</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mã KN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Người gửi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ưu tiên
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
                    <AnimatePresence>
                      {sortedComplaints.map((complaint) => (
                        <motion.tr
                          key={complaint.id}
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            #{complaint.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium">
                                {complaint.userName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {complaint.userEmail}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium max-w-xs truncate">
                              {complaint.subject}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {complaint.courseTitle}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {complaint.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(
                                complaint.priority
                              )}`}
                            >
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(complaint.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewComplaint(complaint)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Xem chi tiết"
                              >
                                <FiEye size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComplaint(complaint.id)
                                }
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Xóa khiếu nại"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {sortedComplaints.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "Không tìm thấy khiếu nại nào phù hợp"
                      : "Chưa có khiếu nại nào"}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modal chi tiết khiếu nại */}
        <AnimatePresence>
          {showModal && selectedComplaint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold">Chi Tiết Khiếu Nại</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Mã khiếu nại
                        </label>
                        <p className="text-lg font-semibold">
                          #{selectedComplaint.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Người gửi
                        </label>
                        <p className="text-lg">{selectedComplaint.userName}</p>
                        <p className="text-sm text-gray-500">
                          {selectedComplaint.userEmail}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Khóa học
                        </label>
                        <p className="text-lg">
                          {selectedComplaint.courseTitle}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Ngày gửi
                        </label>
                        <p className="text-lg">
                          {formatDate(selectedComplaint.date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Loại khiếu nại
                        </label>
                        <p className="text-lg">{selectedComplaint.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Mức độ ưu tiên
                        </label>
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full capitalize ${getPriorityColor(
                            selectedComplaint.priority
                          )}`}
                        >
                          {selectedComplaint.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tiêu đề
                    </label>
                    <p className="text-xl font-semibold mt-1">
                      {selectedComplaint.subject}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nội dung chi tiết
                    </label>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="whitespace-pre-wrap">
                        {selectedComplaint.detail}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phản hồi cho người dùng
                    </label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Nhập phản hồi của bạn cho người dùng..."
                      className="mt-2 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={6}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSendResponse}
                    disabled={!response.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <FiSend size={16} />
                    <span>Gửi phản hồi & Đóng khiếu nại</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComplaintManagement;
