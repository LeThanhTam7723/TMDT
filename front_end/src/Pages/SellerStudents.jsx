import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "../component/SellerLayout";
import {
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiUser,
  FiClock,
  FiBook,
  FiEye,
  FiDownload,
  FiMessageCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import SellerService from "../API/SellerService";
import { ProductContext } from "../context/ProductContext";
import { getAvatarUrl, handleAvatarError } from "../utils/avatarUtils";
import { db } from "../firebase/config";
import { ref, set, get, child, push, query, orderByChild, equalTo, onChildAdded } from "firebase/database";
import { findConversationByUsers } from "./Chat";
import Swal from 'sweetalert2';

const SellerStudents = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
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
      <SellerLayout darkMode={darkMode} setDarkMode={setDarkMode} title="Quản lý học viên - Lỗi hệ thống">
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

  // Load students and courses data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check authentication first
        if (!session || !session.token) {
          setError('Vui lòng đăng nhập để xem danh sách học viên');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching data for sellerId:', sellerId);
        console.log('🔍 Session token exists:', !!session.token);
        
        const [studentsResponse, coursesResponse] = await Promise.all([
          SellerService.getSellerStudents(sellerId),
          SellerService.getSellerCourses(sellerId)
        ]);
        
        console.log('📊 Students API Response:', studentsResponse);
        console.log('📚 Courses API Response:', coursesResponse);
        
        if (studentsResponse.code === 200) {
          setStudents(studentsResponse.result || []);
          console.log('✅ Successfully loaded students:', studentsResponse.result?.length || 0);
        } else {
          console.error('❌ Students API failed:', studentsResponse);
          setError(`Không thể tải danh sách học viên: ${studentsResponse.message || 'Unknown error'}`);
          setStudents([]);
        }

        if (coursesResponse.code === 200) {
          setCourses(coursesResponse.result || []);
          console.log('✅ Successfully loaded courses:', coursesResponse.result?.length || 0);
        } else {
          console.error('❌ Courses API failed:', coursesResponse);
          setCourses([]);
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        
        // Show specific error messages
        if (error.response?.status === 401) {
          setError('Không có quyền truy cập. Vui lòng đăng nhập lại.');
        } else if (error.response?.status === 403) {
          setError('Bạn không có quyền xem danh sách học viên này.');
        } else if (error.response?.status === 404) {
          setError('Không tìm thấy dữ liệu học viên.');
        } else {
          setError(`Lỗi tải dữ liệu: ${error.message || 'Unknown error'}`);
        }
        
        // Set empty arrays instead of fallback data
        setStudents([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sellerId, session]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !selectedCourse || student.courseId?.toString() === selectedCourse;
    const matchesStatus = !selectedStatus || student.enrollmentStatus === selectedStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200";
      case "paused":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang học";
      case "completed":
        return "Hoàn thành";
      case "paused":
        return "Tạm dừng";
      default:
        return "Không xác định";
    }
  };

  const handleContactStudent = (student) => {
    Swal.fire({
      title: `Liên hệ ${student.studentName}`,
      html: `
        <div class="text-left">
          <p><strong>Email:</strong> ${student.studentEmail}</p>
          <p><strong>Phone:</strong> ${student.studentPhone || 'Chưa cập nhật'}</p>
          <p><strong>Khóa học:</strong> ${student.courseName}</p>
          <p><strong>Ngày đăng ký:</strong> ${new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}</p>
          <p><strong>Tiến độ:</strong> ${student.daysSinceEnrollment} ngày</p>
          <p><strong>Trạng thái:</strong> ${student.isFullyUnlocked ? '✅ Đã mở khóa đầy đủ' : '⏳ Chưa mở khóa đầy đủ'}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Gửi email",
      cancelButtonText: "Đóng",
      icon: "info"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `mailto:${student.studentEmail}?subject=Về khóa học ${student.courseName}&body=Xin chào ${student.studentName},%0D%0A%0D%0ATôi là giảng viên của khóa học "${student.courseName}" mà bạn đã đăng ký.%0D%0A%0D%0A`;
      }
    });
  };

  // Chat functionality - Updated to match user's exact pattern
  const handleChatWithStudent = (student) => {
    // Authentication check first
    if (!session || !session.currentUser) {
      Swal.fire({
        title: "Hãy đăng nhập để nhắn tin với học viên",
        showClass: {
          popup: `animate__animated animate__fadeInUp animate__faster`
        },
        hideClass: {
          popup: `animate__animated animate__fadeOutDown animate__faster`
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // Show loading state
    Swal.fire({
      title: 'Đang tạo cuộc trò chuyện...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Use exact same pattern as provided by user
    findConversationByUsers(session.currentUser.id, student.userId).then(result => {
      if (result) {
        console.log("Conversation found:", result);
        Swal.close();
        navigate(`/chat/${result.key}`);
      } else {
        console.log("No conversation found. Creating new one...");
        const conversationRef = push(ref(db, "conversations")); // Tạo ID tự động
        const newConversation = {
          user1_id: Number(session.currentUser.id),
          user2_id: Number(student.userId),
          created_at: Date.now(),
        };

        set(conversationRef, newConversation)
          .then(() => {
            console.log("Conversation created:", conversationRef.key);
            Swal.close();
            navigate(`/chat/${conversationRef.key}`);
          })
          .catch((error) => {
            console.error("Error creating conversation:", error);
            Swal.close();
            Swal.fire({
              title: 'Lỗi!',
              text: 'Không thể tạo cuộc trò chuyện. Vui lòng thử lại.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      }
    }).catch((error) => {
      console.error("Error finding conversation:", error);
      Swal.close();
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể kiểm tra cuộc trò chuyện. Vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  };

  const handleExportData = () => {
    const csvContent = [
      ['Tên học viên', 'Email', 'Khóa học', 'Ngày đăng ký', 'Trạng thái', 'Số ngày học', 'Đã mở khóa đầy đủ', 'Số điện thoại'],
      ...filteredStudents.map(student => [
        student.studentName,
        student.studentEmail,
        student.courseName,
        new Date(student.enrollmentDate).toLocaleDateString('vi-VN'),
        getStatusText(student.enrollmentStatus),
        student.daysSinceEnrollment,
        student.isFullyUnlocked ? 'Có' : 'Chưa',
        student.studentPhone || 'Chưa cập nhật'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    Swal.fire({
      title: 'Xuất dữ liệu thành công!',
      text: `Đã xuất ${filteredStudents.length} học viên`,
      icon: 'success',
      timer: 2000
    });
  };

  if (loading) {
    return (
      <SellerLayout darkMode={darkMode} setDarkMode={setDarkMode} title="Quản lý học viên - Đang tải...">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách học viên...</p>
          </div>
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout darkMode={darkMode} setDarkMode={setDarkMode} title="Quản lý học viên - Lỗi">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không thể tải dữ liệu</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="Quản lý học viên"
    >
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý học viên</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tổng cộng {filteredStudents.length} học viên
            {searchTerm || selectedCourse || selectedStatus ? ` (đã lọc từ ${students.length} học viên)` : ""}
          </p>
        </div>
        <button
          onClick={handleExportData}
          className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiDownload size={20} />
          Xuất dữ liệu CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng học viên</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <FiClock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đang học</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.filter(s => s.enrollmentStatus === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <FiBook className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.filter(s => s.enrollmentStatus === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
              <FiEye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã unlock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.filter(s => s.isFullyUnlocked).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm học viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả khóa học</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang học</option>
            <option value="completed">Hoàn thành</option>
            <option value="paused">Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có học viên</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || selectedCourse || selectedStatus
              ? "Không tìm thấy học viên phù hợp với bộ lọc"
              : "Chưa có học viên nào đăng ký khóa học của bạn"}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tiến độ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    whileHover={{ backgroundColor: darkMode ? "#374151" : "#f9fafb" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={getAvatarUrl(student.studentAvatar, student.studentName, student.userId, 40)}
                            alt={student.studentName}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => handleAvatarError(e, student.studentName, student.userId, 40)}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.studentEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {student.courseName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ${student.coursePrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {student.daysSinceEnrollment} ngày
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {student.isFullyUnlocked ? (
                          <span className="text-green-600">✓ Đã mở khóa đầy đủ</span>
                        ) : (
                          <span className="text-orange-600">⏳ Còn {3 - student.daysSinceEnrollment} ngày</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.enrollmentStatus)}`}>
                        {getStatusText(student.enrollmentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleContactStudent(student)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Gửi email học viên"
                        >
                          <FiMail size={16} />
                        </button>
                        <button
                          onClick={() => handleChatWithStudent(student)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Chat với học viên"
                        >
                          <FiMessageCircle size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/detail/${student.courseId}`)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Xem khóa học"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerStudents; 