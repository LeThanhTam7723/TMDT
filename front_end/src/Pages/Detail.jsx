
import React, { useState, useEffect, useContext } from 'react';
import { Play, Clock, ChevronLeft, ChevronRight, Star, Users, BookOpen, Award, ChevronDown, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../API/axiosClient';
import FacebookComment from '../component/commentFb/FacebookComment';
import Swal from 'sweetalert2';
import ReusableReportForm from '../component/ReusableReportForm';
import StarRating from "../component/StarRating";
import { ProductContext } from '../context/ProductContext';
import PaymentService from '../API/PaymentService';

const Detail = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMoreInstructor, setShowMoreInstructor] = useState(false);
  const {session,setSession} = useContext(ProductContext);
  
  // Get ID from URL params and navigation hook
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState([]);
  const [seller, setSeller] = useState(null); // Changed from instructor to seller
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const relatedCourses = [
    {
      id: 1,
      title: "English Course for kids",
      rating: 4.7,
      reviews: 112,
      price: 69.99,
      originalPrice: 99.99,
      author: "James",
      level: "4-12 years old",
      image: "/api/placeholder/270/150",
    },
    {
      id: 2,
      title: "Advanced English Grammar",
      rating: 4.8,
      reviews: 89,
      price: 79.99,
      originalPrice: 119.99,
      author: "Sarah",
      level: "13+ years old",
      image: "/api/placeholder/270/150",
    },
    {
      id: 3,
      title: "Business English",
      rating: 4.6,
      reviews: 156,
      price: 99.99,
      originalPrice: 149.99,
      author: "Michael",
      level: "Professional",
      image: "/api/placeholder/270/150",
    },
    {
      id: 4,
      title: "English Pronunciation",
      rating: 4.9,
      reviews: 203,
      price: 59.99,
      originalPrice: 89.99,
      author: "Emma",
      level: "All levels",
      image: "/api/placeholder/270/150",
    },
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.max(0, relatedCourses.length - 4) : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev >= relatedCourses.length - 4 ? 0 : prev + 1
    );
  };

  // Helper function to calculate total course duration
  const calculateTotalDuration = (courseDetails) => {
    if (!courseDetails || !Array.isArray(courseDetails)) return 0;
    return courseDetails.reduce(
      (total, episode) => total + (episode.duration || 0),
      0
    );
  };

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  // Function to handle navigation to course video
  const handleWatchCourse = () => {
    navigate(`/course-video/${id}`);
  };

  // Function to handle navigation to seller profile
  const handleSellerClick = (sellerId) => {
    navigate(`/seller/${sellerId}`);
  };
  
  const handlePaymentClick = async (price,orderId) => {
    if (session === null) {
      const result = await Swal.fire({
        title: "Hãy đăng nhập để thực hiện đăng ký khóa học",
        showClass: {
          popup: `animate__animated animate__fadeInUp animate__faster`
        },
        hideClass: {
          popup: `animate__animated animate__fadeOutDown animate__faster`
        }
      });
  
      if (result.isConfirmed) {
        window.location.href = "/auth/login";
      }
    } else {
      const result = await Swal.fire({
        title: "Bạn chắc muốn tham gia khóa học này ?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy"
      });
  
      if (result.isConfirmed) {
        Swal.fire("Đã tham gia!", "", "success");
        const response= await PaymentService.vnPay(10000,session.token,orderId,session.currentUser.id);
        const {code,result,message} = response.data;
        console.log(result);
        window.location.href = result;
      }
    }
  };
  
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError("No course ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch course basic info
        const courseResponse = await axiosClient.get(`/courses/${id}`);

        if (
          courseResponse.data &&
          courseResponse.data.code === 200 &&
          courseResponse.data.result
        ) {
          setCourse(courseResponse.data.result);

          // Fetch course details separately
          try {
            const detailsResponse = await axiosClient.get(
              `/courses/details/${id}`
            );
            if (detailsResponse.data && detailsResponse.data.code === 200) {
              setCourseDetails(detailsResponse.data.result);
            }
          } catch (detailsError) {
            console.error("Failed to load course details:", detailsError);
            // Continue without details if this fails
          }

          // Fetch seller info using the course ID
          try {
            const sellerResponse = await axiosClient.get(`/seller/${id}`);
            if (sellerResponse.data && sellerResponse.data.id) {
              setSeller(sellerResponse.data);
            } else {
              console.error("Invalid seller response format:", sellerResponse.data);
              setError("Failed to load seller information");
            }
          } catch (sellerError) {
            console.error("Failed to load seller info:", sellerError);
            setError("Failed to load seller information");
          }
        } else {
          throw new Error("Invalid course response format");
        }
      } catch (error) {
        console.error("API fetch failed:", error);
        setError(error.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 bg-white">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 bg-white">
        <div className="text-center py-20">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Error Loading Course
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto px-4 bg-white">
        <div className="text-center py-20 text-gray-600">
          <p className="text-lg">Course not found</p>
        </div>
      </div>
    );
  }

  const totalDuration = calculateTotalDuration(courseDetails);
  const totalEpisodes = courseDetails ? courseDetails.length : 0;
  const previewEpisodes = courseDetails
    ? courseDetails.filter((ep) => ep.isPreview).length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white">
      {/* Breadcrumb */}
      <div className="py-4 text-sm text-gray-500">
        <span className="ml-1">English Course</span>
      </div>

      {/* Course Header */}
      <div className="flex flex-col md:flex-row border-b border-gray-200 pb-8">
        <div className="md:w-1/2 md:pr-6">
          <h1 className="text-3xl font-bold text-blue-600">{course.name}</h1>
          <p className="text-gray-700 mt-3 mb-4">{course.description}</p>

          <div className="flex items-center mb-3">
            <StarRating courseId={id} currentRating={course.rating} />
          </div>

          <div className="flex gap-2 flex-wrap text-sm mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              English
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {totalEpisodes} episodes
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {formatDuration(totalDuration)} total
            </span>
            {previewEpisodes > 0 && (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                {previewEpisodes} free preview{previewEpisodes > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Price Section */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">${course.price}</span>
            <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors" onClick={()=>{handlePaymentClick(course.price,course.id)}}>
              Enroll Now
            </button>
            <button 
                onClick={handleWatchCourse}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Course
              </button>
          </div>
        </div>

        {/* Course Image/Video Preview */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                 onClick={handleWatchCourse}>
              <Play className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Seller Section */}
      {seller && (
        <div className="py-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Thông tin người bán</h2>
          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-6">
              {/* Seller Avatar - Clickable */}
              <div 
                className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSellerClick(seller.id)}
              >
                {seller.avatar ? (
                  <img
                    src={seller.avatar}
                    alt={seller.fullname}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex-1">
                {/* Seller Name - Clickable */}
                <h3 
                  className="text-xl font-bold text-blue-600 mb-2 cursor-pointer hover:text-blue-700 transition-colors"
                  onClick={() => handleSellerClick(seller.id)}
                >
                  {seller.fullname}
                </h3>

                {/* Introduction */}
                {seller.introduce && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {showMoreInstructor 
                        ? seller.introduce
                        : seller.introduce.substring(0, 200) + 
                          (seller.introduce.length > 200 ? "..." : "")
                      }
                    </p>
                    {seller.introduce.length > 200 && (
                      <button
                        onClick={() => setShowMoreInstructor(!showMoreInstructor)}
                        className="text-blue-600 hover:text-blue-700 text-sm mt-2 flex items-center gap-1"
                      >
                        {showMoreInstructor ? "Thu gọn" : "Xem thêm"}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showMoreInstructor ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                )}

                {/* Seller Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Email: </span>
                    <span className="font-medium">{seller.email}</span>
                  </div>
                  
                  {seller.phone && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Điện thoại: </span>
                      <span className="font-medium">{seller.phone}</span>
                    </div>
                  )}

                  {seller.certificate && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Chứng chỉ: </span>
                      <span className="font-medium text-green-600">{seller.certificate}</span>
                    </div>
                  )}

                  {seller.gender && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Giới tính: </span>
                      <span className="font-medium">
                        {seller.gender === 'male' ? 'Nam' : seller.gender === 'female' ? 'Nữ' : 'Khác'}
                      </span>
                    </div>
                  )}
                </div>

                {/* View Profile Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleSellerClick(seller.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Xem hồ sơ người bán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Content Section */}
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4 text-sm text-gray-600">
            {totalEpisodes} episodes • {formatDuration(totalDuration)} total
            length
          </div>

          <div className="space-y-3">
            {courseDetails &&
              courseDetails.map((episode) => (
                <div
                  key={episode.id}
                  className="flex items-center justify-between p-3 bg-white rounded border hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center">
                    <Play className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium">
                      Episode {episode.episodeNumber}
                    </span>
                    {episode.isPreview && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Free Preview
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {episode.duration}m
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Gửi khiếu nại về khoá học</h2>
        <ReusableReportForm courseId={id} />
      </div>
      <FacebookComment url={"https://your-public-url.com/product/" + id} />

      {/* Related Courses */}
      <div className="py-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Related Courses</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevSlide}
              className="p-2 rounded-full border hover:bg-gray-50 transition-colors"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-2 rounded-full border hover:bg-gray-50 transition-colors"
              disabled={currentSlide >= relatedCourses.length - 4}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedCourses
            .slice(currentSlide, currentSlide + 4)
            .map((relatedCourse) => (
              <div
                key={relatedCourse.id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/detail/${relatedCourse.id}`)}
              >
                <div className="aspect-video bg-gray-200">
                  <img
                    src={relatedCourse.image}
                    alt={relatedCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{relatedCourse.title}</h3>
                  <StarRating
                    courseId={relatedCourse.id}
                    currentRating={relatedCourse.rating}
                  />
                  <div className="text-sm text-gray-600 mb-2">
                    by {relatedCourse.author}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-600">
                        ${relatedCourse.price}
                      </span>
                      <span className="text-gray-400 line-through ml-2 text-sm">
                        ${relatedCourse.originalPrice}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/detail/${relatedCourse.id}`);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;