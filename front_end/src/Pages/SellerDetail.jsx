import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  Star, 
  BookOpen, 
  Users, 
  Calendar,
  ArrowLeft,
  MapPin,
  Globe,
  ChevronDown,
  Play,
  Clock
} from 'lucide-react';
import axiosClient from '../API/axiosClient';
import StarRating from "../component/StarRating";

const SellerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [seller, setSeller] = useState(null);
  const [sellerCourses, setSellerCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!id) {
        setError("No seller ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch seller information
        const sellerResponse = await axiosClient.get(`/users/id/${id}`);
        
        if (sellerResponse.data && sellerResponse.data.result) {
          setSeller(sellerResponse.data.result);
          
          // Fetch seller's courses
          try {
            const coursesResponse = await axiosClient.get(`/seller/${id}/courses`);
            if (coursesResponse.data && coursesResponse.data.code === 200) {
              setSellerCourses(coursesResponse.data.result || []);
            }
          } catch (coursesError) {
            console.error("Failed to load seller's courses:", coursesError);
            // Continue without courses if this fails
          }
        } else {
          throw new Error("Invalid seller response format");
        }
      } catch (error) {
        console.error("API fetch failed:", error);
        setError(error.message || "Failed to load seller information");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/detail/${courseId}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 bg-white min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin người bán...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 bg-white min-h-screen">
        <div className="text-center py-20">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Lỗi khi tải thông tin
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Thử lại
          </button>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="max-w-6xl mx-auto px-4 bg-white min-h-screen">
        <div className="text-center py-20 text-gray-600">
          <p className="text-lg">Không tìm thấy thông tin người bán</p>
          <button
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const totalCourses = sellerCourses.length;
  const averageRating = sellerCourses.length > 0 
    ? (sellerCourses.reduce((sum, course) => sum + (course.rating || 0), 0) / sellerCourses.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white min-h-screen">
      {/* Back Button */}
      <div className="py-4">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
      </div>

      {/* Seller Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {seller.avatar ? (
              <img
                src={seller.avatar}
                alt={seller.fullname}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{seller.fullname}</h1>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalCourses}</div>
                <div className="text-sm opacity-90">Khóa học</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Star className="w-5 h-5 fill-current" />
                  {averageRating}
                </div>
                <div className="text-sm opacity-90">Đánh giá TB</div>
              </div>
              {seller.certificate && (
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    <Award className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-sm opacity-90">Có chứng chỉ</div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {seller.email}
              </div>
              {seller.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {seller.phone}
                </div>
              )}
              {seller.gender && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {seller.gender === 'male' ? 'Nam' : seller.gender === 'female' ? 'Nữ' : 'Khác'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Giới thiệu
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Khóa học ({totalCourses})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && (
        <div className="space-y-8">
          {/* Introduction */}
          {seller.introduce && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Giới thiệu</h3>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  {showFullIntro 
                    ? seller.introduce
                    : seller.introduce.substring(0, 300) + 
                      (seller.introduce.length > 300 ? "..." : "")
                  }
                </p>
                {seller.introduce.length > 300 && (
                  <button
                    onClick={() => setShowFullIntro(!showFullIntro)}
                    className="text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1"
                  >
                    {showFullIntro ? "Thu gọn" : "Xem thêm"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFullIntro ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Detailed Information */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Thông tin chi tiết</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-gray-600 text-sm">Email</div>
                    <div className="font-medium">{seller.email}</div>
                  </div>
                </div>
                
                {seller.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-gray-600 text-sm">Số điện thoại</div>
                      <div className="font-medium">{seller.phone}</div>
                    </div>
                  </div>
                )}

                {seller.gender && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-gray-600 text-sm">Giới tính</div>
                      <div className="font-medium">
                        {seller.gender === 'male' ? 'Nam' : seller.gender === 'female' ? 'Nữ' : 'Khác'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {seller.certificate && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-gray-600 text-sm">Chứng chỉ</div>
                      <div className="font-medium text-green-600">{seller.certificate}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-gray-600 text-sm">Tổng số khóa học</div>
                    <div className="font-medium">{totalCourses} khóa học</div>
                  </div>
                </div>

                {averageRating > 0 && (
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-gray-600 text-sm">Đánh giá trung bình</div>
                      <div className="font-medium flex items-center gap-1">
                        {averageRating} <Star className="w-4 h-4 fill-current text-yellow-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div>
          {sellerCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCourseClick(course.id)}
                >
                  {/* Course Image */}
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80" />
                  </div>
                  
                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                    
                    {/* Rating */}
                    <div className="mb-3">
                      <StarRating courseId={course.id} currentRating={course.rating} />
                    </div>
                    
                    {/* Course Details */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.episodeCount || 0} bài
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration || 0}m
                        </span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        ${course.price}
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
              <p className="text-gray-600">Người bán này chưa tạo khóa học nào.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDetail;