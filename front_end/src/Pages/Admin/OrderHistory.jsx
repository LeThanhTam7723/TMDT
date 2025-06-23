import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  BookOpen,
  Filter,
  Search,
  Download,
  Eye,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - thay thế bằng API call thực tế
  useEffect(() => {
    const mockData = [
      { id: 1, id_user: 1, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY001', price: 100, status: 'pending', id_course: 1, courseName: 'React Fundamentals', courseImage: null },
      { id: 2, id_user: 2, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY002', price: 150, status: 'completed', id_course: 2, courseName: 'Advanced JavaScript', courseImage: null },
      { id: 3, id_user: 3, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY003', price: 200, status: 'completed', id_course: 3, courseName: 'Node.js Backend Development', courseImage: null },
      { id: 4, id_user: 4, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY004', price: 250, status: 'failed', id_course: 4, courseName: 'Full Stack Web Development', courseImage: null },
      { id: 5, id_user: 5, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY005', price: 100, status: 'pending', id_course: 1, courseName: 'React Fundamentals', courseImage: null },
      { id: 6, id_user: 6, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY006', price: 150, status: 'completed', id_course: 2, courseName: 'Advanced JavaScript', courseImage: null },
      { id: 7, id_user: 7, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY007', price: 200, status: 'completed', id_course: 3, courseName: 'Node.js Backend Development', courseImage: null },
      { id: 8, id_user: 8, date_buy: '2025-06-19 21:11:20.000000', paymentid: 'PAY008', price: 250, status: 'refunded', id_course: 4, courseName: 'Full Stack Web Development', courseImage: null },
    ];

    setTimeout(() => {
      setOrders(mockData);
      setFilteredOrders(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentid.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
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
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      case 'refunded':
        return 'Hoàn tiền';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 1000); // Assuming price is in thousands
  };

  const handleViewCourse = (courseId) => {
    console.log('View course:', courseId);
    // Navigate to course detail
  };

  const handleDownloadInvoice = (orderId) => {
    console.log('Download invoice:', orderId);
    // Download invoice logic
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
          <p className="text-gray-600">Quản lý và theo dõi các khóa học bạn đã mua</p>
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
                placeholder="Tìm kiếm theo tên khóa học hoặc mã thanh toán..."
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
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Hoàn tiền</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Course Image & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{order.courseName}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {order.paymentid}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.date_buy)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPrice(order.price)}
                      </div>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewCourse(order.id_course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem khóa học"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Tải hóa đơn"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details (Expandable) */}
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Mã đơn hàng: #{order.id.toString().padStart(6, '0')}</span>
                  <span>ID người dùng: {order.id_user}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Thử thay đổi bộ lọc để xem các đơn hàng khác.' 
                : 'Bạn chưa mua khóa học nào. Hãy khám phá các khóa học tuyệt vời!'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredOrders.length}</div>
              <div className="text-sm text-gray-600">Tổng đơn hàng</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredOrders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Hoàn thành</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredOrders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Đang xử lý</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatPrice(filteredOrders.reduce((sum, order) => sum + order.price, 0))}
              </div>
              <div className="text-sm text-gray-600">Tổng chi tiêu</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;