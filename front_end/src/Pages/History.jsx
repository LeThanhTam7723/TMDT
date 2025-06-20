import React, { useState, useEffect } from 'react';
import axiosClient from '../API/axiosClient';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  BookOpen,
  Search,
  Eye,
  ArrowLeft,
  RefreshCw,
  Play,
  Star
} from 'lucide-react';

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch data from API using axios
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Fetching orders...");
        
        const response = await axiosClient.get('/order/invidual');
        
        console.log("📦 API Response:", response.data);

        if (response.data && response.data.code === 0 && response.data.result) {
          // Transform API data to match component structure
          const transformedOrders = response.data.result.map(order => ({
            id: order.id,
            date_buy: new Date().toISOString(), // API không có trường này, dùng giá trị mặc định
            status: 'completed', // Giả định tất cả orders đã hoàn thành
            id_course: order.idCourse.id,
            courseName: order.idCourse.name,
            courseImage: null,
            instructor: order.idUser.fullname,
            rating: order.idCourse.rating,
            progress: Math.floor(Math.random() * 100), // Random progress vì API không có
            price: order.idCourse.price,
            description: order.idCourse.description,
            courseDetails: order.idCourse.courseDetails || [],
            userEmail: order.idUser.email,
            userPhone: order.idUser.phone
          }));
          
          console.log("✅ Orders transformed:", transformedOrders);
          setOrders(transformedOrders);
          setFilteredOrders(transformedOrders);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        
        // Handle different types of errors
        if (error.response) {
          // Server responded with error status
          const statusCode = error.response.status;
          const errorMessage = error.response.data?.message || `Server error: ${statusCode}`;
          setError(`Lỗi từ server (${statusCode}): ${errorMessage}`);
        } else if (error.request) {
          // Request was made but no response received
          setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } else {
          // Something else happened
          setError(error.message || 'Có lỗi không xác định xảy ra');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã mua';
      case 'pending':
        return 'Đang xử lý';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleStartLearning = (courseId) => {
    console.log('Start learning course:', courseId);
    // Navigate to course learning page
    // window.location.href = `/course/${courseId}/learn`;
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosClient.get('/order/invidual');
      
      if (response.data && response.data.code === 0 && response.data.result) {
        const transformedOrders = response.data.result.map(order => ({
          id: order.id,
          date_buy: new Date().toISOString(),
          status: 'completed',
          id_course: order.idCourse.id,
          courseName: order.idCourse.name,
          courseImage: null,
          instructor: order.idUser.fullname,
          rating: order.idCourse.rating,
          progress: Math.floor(Math.random() * 100),
          price: order.idCourse.price,
          description: order.idCourse.description,
          courseDetails: order.idCourse.courseDetails || [],
          userEmail: order.idUser.email,
          userPhone: order.idUser.phone
        }));
        
        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
      setError('Không thể làm mới dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải khóa học của bạn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Khóa học của tôi</h1>
              <p className="text-gray-600">Quản lý và tiếp tục học các khóa học bạn đã mua</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học hoặc giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả khóa học</option>
              <option value="completed">Đã mua</option>
              <option value="pending">Đang xử lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </div>

                {/* Progress Bar */}
                {order.status === 'completed' && order.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-20 p-3">
                    <div className="flex items-center justify-between text-white text-sm mb-1">
                      <span>Tiến độ</span>
                      <span>{order.progress}%</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-500"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {order.courseName}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {order.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>Bởi {order.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{order.rating}</span>
                  </div>
                  <div className="font-semibold text-blue-600">
                    {formatPrice(order.price)}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  {order.courseDetails.length} bài học
                </div>

                {/* Action Button */}
                {order.status === 'completed' ? (
                  <button
                    onClick={() => handleStartLearning(order.id_course)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {order.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Đang xử lý thanh toán
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg p-12 text-center shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Thử thay đổi bộ lọc để xem các khóa học khác.' 
                : 'Bạn chưa mua khóa học nào. Hãy khám phá các khóa học tuyệt vời!'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê học tập</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredOrders.length}</div>
              <div className="text-sm text-gray-600">Tổng khóa học</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredOrders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Có thể học</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(filteredOrders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.progress, 0) / filteredOrders.filter(o => o.status === 'completed').length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Tiến độ trung bình</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {filteredOrders.reduce((sum, order) => sum + order.courseDetails.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng bài học</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;