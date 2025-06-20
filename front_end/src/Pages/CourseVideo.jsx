import React, { useState, useEffect } from 'react';
import { Star, Clock, Share2 } from 'lucide-react';

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

  // Get courseId from URL or use default
  const getCourseIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/course-video\/(\d+)/);
    return match ? parseInt(match[1]) : 2; // Default to 2 if not found
  };

  const [courseId] = useState(getCourseIdFromUrl());

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
    setSelectedVideo({
      title: `Episode ${episode.episodeNumber}`,
      url: episode.link,
    });
    setSelectedVideoIndex(index);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      console.log('Fetching course data for courseId:', courseId);
      
      setLoading(true);
      setError(null);

      try {
        // Simulate API call for course basic info
        const mockCourse = {
          name: "TOEIC COURSE FOR BEGINNERS",
          description: "Complete TOEIC preparation course for beginners",
          rating: 4.4,
          price: 69.99
        };
        setCourse(mockCourse);
        
        // Fetch course details from API
        const apiUrl = `http://localhost:8080/api/courses/details/${courseId}`;
        console.log('Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.code === 200 && data.result && Array.isArray(data.result)) {
          const details = data.result;
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
          throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
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
        
        console.log('Using fallback data:', fallbackData);
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
  }, [courseId]);

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
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              SAHARA
            </div>
            <h1 className="text-xl font-medium">{course.name?.toUpperCase() || 'COURSE'}</h1>
            <span className="text-sm opacity-75">(Course ID: {courseId})</span>
          </div>
          <Share2 className="w-6 h-6 cursor-pointer" />
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
            <div className="text-white text-center">
              <p>No video available</p>
              <p className="text-sm mt-2">Selected: {selectedVideo.title}</p>
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
          {courseDetails.map((episode, index) => (
            <div
              key={`${episode.id}-${index}`}
              onClick={() => handleVideoSelect(episode, index)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors ${
                selectedVideoIndex === index
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
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {episode.episodeNumber}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      Episode {episode.episodeNumber}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseVideo;