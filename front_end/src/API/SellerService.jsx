import axiosClient from './axiosClient';

const SellerService = {
  // ===== COURSE MANAGEMENT =====
  
  // Tạo khóa học mới
  createCourse: async (sellerId, courseData) => {
    try {
      const response = await axiosClient.post(`/seller/${sellerId}/courses`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Cập nhật khóa học
  updateCourse: async (sellerId, courseId, courseData) => {
    try {
      const response = await axiosClient.put(`/seller/${sellerId}/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Xóa khóa học
  deleteCourse: async (sellerId, courseId) => {
    try {
      const response = await axiosClient.delete(`/seller/${sellerId}/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Lấy danh sách khóa học của seller
  getSellerCourses: async (sellerId) => {
    try {
      const response = await axiosClient.get(`/seller/${sellerId}/courses/managed`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller courses:', error);
      throw error;
    }
  },

  // ===== STATISTICS =====
  
  // Lấy thống kê tổng quan
  getSellerStats: async (sellerId) => {
    try {
      const response = await axiosClient.get(`/seller/${sellerId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller stats:', error);
      throw error;
    }
  },

  // Lấy doanh thu theo tháng
  getSellerRevenue: async (sellerId) => {
    try {
      const response = await axiosClient.get(`/seller/${sellerId}/revenue`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller revenue:', error);
      throw error;
    }
  },

  // ===== EXISTING APIS (from backend) =====
  
  // Lấy thông tin seller theo courseId (existing)
  getSellerByCourseId: async (courseId) => {
    try {
      const response = await axiosClient.get(`/seller/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller by course:', error);
      throw error;
    }
  },

  // Lấy khóa học của seller (existing - for public display)
  getCoursesBySeller: async (sellerId) => {
    try {
      const response = await axiosClient.get(`/seller/${sellerId}/courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses by seller:', error);
      throw error;
    }
  }
};

export default SellerService; 