import axiosClient from './axiosClient';

// AdminService - Service để quản lý phê duyệt khóa học cho admin
const AdminService = {
  // Lấy tất cả khóa học cho admin
  getAllCoursesForAdmin: async () => {
    try {
      const response = await axiosClient.get('/admin/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses for admin:', error);
      throw error;
    }
  },

  // Lấy danh sách khóa học chờ phê duyệt
  getPendingCourses: async () => {
    try {
      const response = await axiosClient.get('/admin/courses/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending courses:', error);
      throw error;
    }
  },

  // Phê duyệt khóa học
  approveCourse: async (courseId) => {
    try {
      const response = await axiosClient.put(`/admin/courses/${courseId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving course:', error);
      throw error;
    }
  },

  // Từ chối khóa học
  rejectCourse: async (courseId, reason) => {
    try {
      const response = await axiosClient.put(`/admin/courses/${courseId}/reject`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting course:', error);
      throw error;
    }
  },

  // Lấy thống kê khóa học
  getCourseStatistics: async () => {
    try {
      const response = await axiosClient.get('/admin/courses/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching course statistics:', error);
      throw error;
    }
  }
};

export default AdminService; 