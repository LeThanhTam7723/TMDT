import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Share2 } from 'lucide-react';
import axiosClient from '../API/axiosClient';
import { ProductContext } from '../context/ProductContext';

const CourseVideo = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [courseDetails, setCourseDetails] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState({
    title: 'Loading...',
    url: '',
  });
  const [isPurchased, setIsPurchased] = useState(false);

  // Get courseId from URL params and context
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { session } = useContext(ProductContext);

  const resources = [
    { name: 'TOEIC Vocabulary List', file: '/downloads/vocabulary.pdf' },
    { name: 'Practice Questions', file: '/downloads/practice.zip' },
  ];

  const tabs = ['Overview', 'Resource', 'Review'];

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Calculate total duration
  const calculateTotalDuration = (courseDetails) => {
    if (!courseDetails || !Array.isArray(courseDetails)) return 0;
    return courseDetails.reduce((total, episode) => total + (episode.duration || 0), 0);
  };

  // Handle video selection
  const handleVideoSelect = (episode, index) => {
    // Check if user has access to this episode
    if (!isPurchased && !episode.isPreview) {
      alert('Bạn cần mua khóa học để xem episode này. Chỉ có thể xem các episode miễn phí.');
      return;
    }

    setSelectedVideo({
      title: `Episode ${episode.episodeNumber}`,
      url: episode.link,
    });
    setSelectedVideoIndex(index);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(`/detail/${courseId}`);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError("No course ID provided");
        setLoading(false);
        return;
      }

      // Check if user is logged in
      if (!session) {
        setError("Please login to access course videos");
        setLoading(false);
        return;
      }

      console.log('Fetching course data for courseId:', courseId);
      
      setLoading(true);
      setError(null);

      try {
        // Fetch course basic info from API
        const userId = session?.currentUser?.id;
        const courseResponse = await axiosClient.get(`/courses/${courseId}`, {
          params: { userId }
        });

        if (courseResponse.data && courseResponse.data.code === 200 && courseResponse.data.result) {
          const courseData = courseResponse.data.result;
          setCourse(courseData);
          setIsPurchased(courseData.purchased || false);
          console.log('Course data loaded:', courseData);
          console.log('Purchase status:', courseData.purchased);
        } else {
          throw new Error("Invalid course response format");
        }
        
        // Fetch course details (episodes) from API
        const detailsResponse = await axiosClient.get(`/courses/details/${courseId}`);
        console.log('Course details API response:', detailsResponse.data);
        
        if (detailsResponse.data && detailsResponse.data.code === 200 && Array.isArray(detailsResponse.data.result)) {
          const details = detailsResponse.data.result;
          setCourseDetails(details);
          console.log('Course details set:', details);
          
          // Set first video as default selected video
          if (details.length > 0) {
            setSelectedVideo({
              title: `Episode ${details[0].episodeNumber}`,
              url: details[0].link,
            });
            setSelectedVideoIndex(0);
          }
        } else {
          throw new Error(`Invalid course details response format: ${JSON.stringify(detailsResponse.data)}`);
        }
      } catch (error) {
        console.error('API fetch failed:', error);
        setError(error.message || 'Failed to load course');
        
        // Fallback data for development
        const fallbackData = [
          {
            id: 4,
            episodeNumber: 1,
            link: "https://www.youtube.com/embed/hTvJoYnpeRQ",
            duration: 12,
            isPreview: true
          },
          {
            id: 5,
            episodeNumber: 2,
            link: "https://www.youtube.com/embed/-GR52szEdAg",
            duration: 20,
            isPreview: false
          }
        ];
        
        // Fallback course data
        const fallbackCourse = {
          name: "SAMPLE COURSE",
          description: "This is a fallback course for development",
          rating: 4.0,
          price: 0
        };
        
        console.log('Using fallback data:', { course: fallbackCourse, details: fallbackData });
        setCourse(fallbackCourse);
        setCourseDetails(fallbackData);
        
        if (fallbackData.length > 0) {
          setSelectedVideo({
            title: `Episode ${fallbackData[0].episodeNumber}`,
            url: fallbackData[0].link,
          });
          setSelectedVideoIndex(0);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, session]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course {courseId}...</p>
        </div>
      </div>
    );
  }

  if (error && courseDetails.length === 0) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Course</div>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Course ID: {courseId}</p>
          <div className="mt-4 space-x-2">
            {error.includes("login") ? (
              <button 
                onClick={() => navigate("/login")} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
            <button 
              onClick={handleBack} 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !courseDetails.length) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-lg">No course content available</p>
          <p className="text-sm">Course ID: {courseId}</p>
        </div>
      </div>
    );
  }

  const totalDuration = calculateTotalDuration(courseDetails);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-400 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleBack}
              className="w-8 h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors"
              title="Back to course detail"
            >
              ←
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              SAHARA
            </div>
            <div>
              <h1 className="text-xl font-medium">{course.name?.toUpperCase() || 'COURSE'}</h1>
              <span className="text-sm opacity-75">
                {isPurchased ? '✅ Đã mua' : '🔒 Chỉ xem preview'} • Course ID: {courseId}
              </span>
            </div>
          </div>
          <Share2 className="w-6 h-6 cursor-pointer hover:opacity-80" />
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {selectedVideo.url ? (
            <iframe
              className="w-full h-full max-h-[600px]"
              src={selectedVideo.url}
              title={selectedVideo.title}
              allowFullScreen
            ></iframe>
          ) : (
            <div className="text-white text-center p-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  🔒
                </div>
                <h3 className="text-xl font-semibold mb-2">Video không khả dụng</h3>
                <p className="text-gray-300 mb-4">
                  {!isPurchased 
                    ? "Bạn cần mua khóa học để xem video này. Chỉ có thể xem các episode miễn phí."
                    : "Video đang được tải hoặc không khả dụng."
                  }
                </p>
                {!isPurchased && (
                  <button
                    onClick={() => navigate(`/detail/${courseId}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Mua khóa học ngay
                  </button>
                )}
              </div>
              <p className="text-sm mt-4 text-gray-400">Selected: {selectedVideo.title}</p>
            </div>
          )}
        </div>

        {/* Bottom Tabs and Content */}
        <div className="bg-white border-t">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'Overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-lg font-bold">{course.rating?.toFixed(1) || 'N/A'}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {course.rating ? 'Based on reviews' : 'No ratings yet'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{courseDetails.length}</div>
                    <div className="text-sm text-gray-600">Episodes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{formatDuration(totalDuration)}</div>
                    <div className="text-sm text-gray-600">Total Duration</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>{course.description}</p>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                    <strong>Debug Info:</strong> Loaded {courseDetails.length} episodes for course {courseId}
                    {error && <div className="text-red-600 mt-1">API Error: {error}</div>}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Resource' && (
              <ul className="space-y-3">
                {resources.map((res, idx) => (
                  <li key={idx}>
                    <a href={res.file} download className="text-blue-600 hover:underline">
                      {res.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'Review' && (
              <div className="text-sm text-gray-600">
                <p>No reviews yet. Be the first to write one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white border-l shadow-lg">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold text-gray-800">Course content</h2>
          <p className="text-sm text-gray-600 mt-1">
            {courseDetails.length} episodes • {formatDuration(totalDuration)}
          </p>
        </div>

        <div className="overflow-y-auto h-full">
          {courseDetails.map((episode, index) => {
            const hasAccess = isPurchased || episode.isPreview;
            const isSelected = selectedVideoIndex === index;
            
            return (
              <div
                key={`${episode.id}-${index}`}
                onClick={() => hasAccess && handleVideoSelect(episode, index)}
                className={`p-4 border-b border-gray-100 transition-colors ${
                  hasAccess 
                    ? 'hover:bg-gray-100 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed bg-gray-50'
                } ${
                  isSelected
                    ? 'bg-blue-100 border-l-4 border-l-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        episode.isPreview 
                          ? 'bg-green-500 text-white' 
                          : hasAccess
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {hasAccess ? episode.episodeNumber : '🔒'}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-800">
                        Episode {episode.episodeNumber}
                        {!hasAccess && (
                          <span className="ml-2 text-xs text-red-600 font-medium">
                            Cần mua khóa học
                          </span>
                        )}
                      </div>
                      {episode.isPreview && (
                        <span className="text-xs text-green-600 font-medium">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{episode.duration} mins</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseVideo;