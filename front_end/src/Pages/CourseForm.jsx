import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiUpload, FiX, FiSave, FiArrowLeft, FiBook, FiList } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SellerService from '../API/SellerService';
import { ProductContext } from '../context/ProductContext';
import CourseContentManager from '../component/CourseContentManager';
import Swal from 'sweetalert2';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(ProductContext);
  const session = context?.session;
  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'content'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    totalHour: '',
    lessons: '',
    age: '',
    level: ''
  });

  // Get sellerId from location state or context
  const sellerId = location.state?.sellerId || session?.user?.id || 1;
  const isEditMode = !!id;

  // Add safety check for context
  if (!context) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  useEffect(() => {
    const loadCourseData = async () => {
      if (isEditMode) {
        if (location.state?.course) {
          // Use course data from navigation state
          const course = location.state.course;
          setFormData({
            name: course.name || '',
            description: course.description || '',
            price: course.price || '',
            categoryId: course.categoryId || '',
            image: course.image || '',
            totalHour: course.totalHour || '',
            lessons: course.lessons || '',
            age: course.age || '',
            level: course.level || ''
          });
        } else {
          // If no course data in state (e.g., page refresh), fetch from API
          setFetchingCourse(true);
          try {
            const courses = await SellerService.getSellerCourses(sellerId);
            if (courses.code === 200) {
              const course = courses.result.find(c => c.id.toString() === id);
              if (course) {
                setFormData({
                  name: course.name || '',
                  description: course.description || '',
                  price: course.price || '',
                  categoryId: course.categoryId || '',
                  image: course.image || '',
                  totalHour: Math.floor((course.duration || 0) / 60) || '',
                  lessons: course.episodeCount || '',
                  age: course.age || '',
                  level: course.level || ''
                });
              } else {
                throw new Error('Course not found');
              }
            }
          } catch (error) {
            console.error('Error fetching course data:', error);
            await Swal.fire({
              title: 'Lỗi!',
              text: 'Không thể tải thông tin khóa học. Vui lòng thử lại.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            navigate('/seller/dashboard');
          } finally {
            setFetchingCourse(false);
          }
        }
      }
    };

    loadCourseData();
  }, [isEditMode, location.state, id, sellerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only handle form submission for basic tab
    if (activeTab !== 'basic') return;
    
    // Validation check
    if (!formData.level) {
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng chọn cấp độ khóa học.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    if (!formData.age) {
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng chọn độ tuổi phù hợp.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API
      const courseData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        level: formData.level,
        image: formData.image,
        totalHour: parseInt(formData.totalHour),
        lessons: parseInt(formData.lessons),
        age: formData.age
      };

      let response;
      if (isEditMode) {
        response = await SellerService.updateCourse(sellerId, id, courseData);
      } else {
        response = await SellerService.createCourse(sellerId, courseData);
      }

      if (response.code === 200) {
        if (isEditMode) {
          await Swal.fire({
            title: 'Thành công!',
            text: `Khóa học "${formData.name}" đã được cập nhật thành công.`,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true
          });
          navigate('/seller/dashboard');
        } else {
          // Tạo mới thành công - chuyển sang tab nội dung
          await Swal.fire({
            title: 'Thành công!',
            text: `Khóa học "${formData.name}" đã được tạo thành công.`,
            html: `
              <p>Khóa học đã được tạo thành công!</p>
              <p>Bạn có thể thêm nội dung bài học hoặc quay về dashboard.</p>
            `,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Thêm nội dung',
            cancelButtonText: 'Về Dashboard',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {
              setActiveTab('content');
              // Update URL để reflect edit mode
              navigate(`/seller/course/${response.result.id}/edit`, { 
                replace: true,
                state: { 
                  course: response.result,
                  sellerId 
                }
              });
            } else {
              navigate('/seller/dashboard');
            }
          });
        }
      }
    } catch (error) {
      console.error('Error saving course:', error);
      const errorMessage = error.response?.data?.message || 
        (isEditMode ? 'Có lỗi xảy ra khi cập nhật khóa học.' : 'Có lỗi xảy ra khi tạo khóa học.');
      
      await Swal.fire({
        title: 'Lỗi!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Show loading spinner while fetching course data
  if (fetchingCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Đang tải thông tin khóa học...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <FiArrowLeft size={24} className="text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditMode ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
              </h1>
            </div>
            {isEditMode && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Đang chỉnh sửa: {formData.name || 'Khóa học'}
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === 'basic'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <FiBook />
              Thông tin cơ bản
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === 'content'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <FiList />
              Nội dung khóa học
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'basic' ? (
            <motion.form 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit} 
              className="bg-white rounded-xl shadow-lg p-8 space-y-6"
            >
            {/* Course Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Course preview"
                        className="mx-auto h-48 w-auto object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Course Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter course name"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter course description"
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter price"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a category</option>
                  <option value="1">IELTS</option>
                  <option value="2">Business English</option>
                  <option value="3">Kids English</option>
                  <option value="4">Conversation</option>
                  <option value="5">Grammar</option>
                  <option value="6">General English</option>
                </select>
              </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Total Hours
                </label>
                <input
                  type="number"
                  name="totalHour"
                  value={formData.totalHour}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter total hours"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Lessons
                </label>
                <input
                  type="number"
                  name="lessons"
                  value={formData.lessons}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter number of lessons"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Upper Intermediate">Upper Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Age Group */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Age Group
              </label>
              <select
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select age group</option>
                <option value="4-12 year old">4-12 year old</option>
                <option value="13-18 year old">13-18 year old</option>
                <option value="18+ year old">18+ year old</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/seller/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center"
              >
                <FiSave className="mr-2" />
                {loading ? 'Đang lưu...' : isEditMode ? 'Cập nhật khóa học' : 'Tạo khóa học'}
              </button>
            </div>
          </motion.form>
          ) : (
            /* Content Tab */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <CourseContentManager 
                courseId={id} 
                sellerId={sellerId} 
                isEditMode={isEditMode}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CourseForm; 