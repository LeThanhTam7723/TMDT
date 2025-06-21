import React, { useState, useEffect } from 'react';
import { Play, Clock, ChevronLeft, ChevronRight, Star, Users, BookOpen, Award, ChevronDown, User, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../API/axiosClient';
import FacebookComment from '../component/commentFb/FacebookComment';
import ReusableReportForm from '../component/ReusableReportForm';
import StarRating from "../component/StarRating";

const Detail = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMoreInstructor, setShowMoreInstructor] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  
  // Get ID from URL params and navigation hook
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false); // New state for purchase status

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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYKh0b8yEYobWCSsLN67uLiSvYmtyQVYC1pA&s",
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
      image: "https://nhasachdaruma.com/wp-content/uploads/2021/07/english-grammar-in-use-advanced.jpg",
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
      image: "https://trufluency.com/wp-content/uploads/2022/03/most-common-business-english-words-shutterstock_488658217.jpg",
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
      image: "https://play-lh.googleusercontent.com/JB8dByXY2w8aSRldtZd34z_es4Za1JlikA6ru792Oc4RSzWohuGlsY8AnDoStPNyQvQ",
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

  // Function to handle video preview click
  const handleVideoPreviewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Video preview clicked'); // Debug log
    setShowVideoPreview(true);
  };

  // Function to close video preview
  const handleCloseVideoPreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowVideoPreview(false);
  };

  // Function to handle enrollment
  const handleEnrollment = () => {
    // Add your enrollment logic here
    console.log('Enrolling in course:', id);
    // You can redirect to payment page or show enrollment modal
  };

  // Improved function to extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Remove any whitespace
    url = url.trim();
    
    // Different YouTube URL patterns
    const patterns = [
      // Standard YouTube URLs
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      // Shortened YouTube URLs
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      // YouTube embed URLs
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      // YouTube URLs with additional parameters
      /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
      // YouTube mobile URLs
      /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      // YouTube live URLs
      /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Function to get YouTube embed URL with proper parameters
  const getYouTubeEmbedUrl = (url, autoplay = false) => {
    const videoId = extractYouTubeVideoId(url);
    
    if (!videoId) {
      console.warn('Could not extract YouTube video ID from URL:', url);
      return null;
    }
    
    // Build embed URL with parameters
    const params = new URLSearchParams({
      rel: '0', // Don't show related videos
      modestbranding: '1', // Modest branding
      showinfo: '0', // Don't show video info
      controls: '1', // Show controls
      ...(autoplay && { autoplay: '1' }), // Autoplay only when specified
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url, quality = 'maxresdefault') => {
    const videoId = extractYouTubeVideoId(url);
    
    if (!videoId) return null;
    
    // Available qualities: maxresdefault, hqdefault, mqdefault, sddefault, default
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  // Function to validate if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return extractYouTubeVideoId(url) !== null;
  };

  // Add keyboard event handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showVideoPreview) {
        setShowVideoPreview(false);
      }
    };

    if (showVideoPreview) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showVideoPreview]);
  
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
       const session = JSON.parse(localStorage.getItem("session"));
const userId = session?.currentUser?.id;

const courseResponse = await axiosClient.get(`/courses/${id}`, {
  params: { userId } // truyền userId vào query
});


        if (
          courseResponse.data &&
          courseResponse.data.code === 200 &&
          courseResponse.data.result
        ) {
          const courseData = courseResponse.data.result;
          setCourse(courseData);
          
          // Check if user has purchased the course and log the result
          const purchased = courseData.purchased;
          setIsPurchased(purchased);
          
          // Console log purchase status
          if (purchased) {
            console.log('🎉 USER HAS PURCHASED THIS COURSE!');
            console.log('Purchase Status:', {
              courseId: courseData.id,
              courseName: courseData.name,
              purchased: purchased,
              price: courseData.price,
              seller: courseData.sellerName,
              timestamp: new Date().toISOString()
            });
          } else {
            console.log('❌ User has NOT purchased this course yet');
            console.log('Course Details:', {
              courseId: courseData.id,
              courseName: courseData.name,
              purchased: purchased,
              price: courseData.price,
              seller: courseData.sellerName
            });
          }

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

  // Check if we have a valid YouTube URL
  const hasValidVideoPreview = course.videoPreviewUrl && isYouTubeUrl(course.videoPreviewUrl);
  const embedUrl = hasValidVideoPreview ? getYouTubeEmbedUrl(course.videoPreviewUrl) : null;
  const thumbnailUrl = hasValidVideoPreview ? getYouTubeThumbnail(course.videoPreviewUrl) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white">
      {/* Breadcrumb */}
      <div className="py-4 text-sm text-gray-500">
        <span className="ml-1">English Course</span>
      </div>

      {/* Course Header */}
      <div className="flex flex-col md:flex-row border-b border-gray-200 pb-8">
        <div className="md:w-1/2 md:pr-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-blue-600">{course.name}</h1>
          </div>
          
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

          {/* Price Section - Updated */}
          {/* Price Section */}
<div className="mb-6 flex flex-col sm:flex-row gap-3">
  {isPurchased ? (
    // ✅ Nếu đã mua → chỉ hiển thị nút "Continue Learning"
    <button 
      onClick={handleWatchCourse}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
    >
      <Play className="w-5 h-5" />
      Continue Learning
    </button>
  ) : (
    // ❌ Nếu chưa mua → hiển thị giá + nút Enroll Now
    <>
      <div className="flex items-center">
        <span className="text-3xl font-bold text-blue-600">
          ${course.price}
        </span>
      </div>
      <button 
        onClick={handleEnrollment}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Enroll Now
      </button>
    </>
  )}
</div>

        </div>

        {/* Course Image/Video Preview */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {hasValidVideoPreview ? (
              /* YouTube Video Preview */
              <div className="aspect-video relative group">
                {/* YouTube Thumbnail with Play Button Overlay */}
                <div 
                  className="absolute inset-0 cursor-pointer group-hover:opacity-90 transition-opacity"
                  onClick={handleVideoPreviewClick}
                >
                  <img
                    src={thumbnailUrl}
                    alt="Video Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a lower quality thumbnail if maxres fails
                      e.target.src = getYouTubeThumbnail(course.videoPreviewUrl, 'hqdefault');
                    }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
                    <div className="bg-red-600 rounded-full p-3 transform group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                  {/* YouTube Logo */}
                  <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    YouTube
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback Preview for Non-YouTube or Missing Video */
              <div 
                className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleVideoPreviewClick}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleVideoPreviewClick(e);
                  }
                }}
              >
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-2 opacity-80" />
                  <p className="text-lg font-semibold">Preview Course</p>
                  <p className="text-sm opacity-75 mt-1">
                    {course.videoPreviewUrl ? 'Invalid video URL' : 'No preview available'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleVideoPreviewClick}
              disabled={!hasValidVideoPreview}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto ${
                hasValidVideoPreview
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4" />
              {hasValidVideoPreview ? 'Watch Preview' : 'Preview Not Available'}
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {showVideoPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseVideoPreview}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h3 className="text-lg font-semibold">Course Preview</h3>
              <button
                onClick={handleCloseVideoPreview}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Video Content */}
            <div className="aspect-video bg-black">
              {hasValidVideoPreview && embedUrl ? (
                <iframe
                  src={getYouTubeEmbedUrl(course.videoPreviewUrl, true)} // Enable autoplay in modal
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Course Preview Modal"
                ></iframe>
              ) : (
                /* Fallback content for invalid or missing video */
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Video preview not available</p>
                    <p className="text-sm opacity-75 mt-2">
                      {course.videoPreviewUrl 
                        ? 'The video URL provided is not a valid YouTube link' 
                        : 'Please contact the instructor for more information'
                      }
                    </p>
                    {course.videoPreviewUrl && (
                      <p className="text-xs opacity-50 mt-2">
                        URL: {course.videoPreviewUrl}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                    {/* Show purchased indicator for all episodes if course is purchased */}
                    {isPurchased && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Available
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

      {/* Comment Facebook */}
      <FacebookComment url={`https://your-public-url.com/product/${id}`} />

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
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200">
                  <img
                    src={relatedCourse.image}
                    alt={relatedCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">
                    {relatedCourse.title}
                  </h3>
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
