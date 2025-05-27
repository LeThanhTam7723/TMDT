import React, { useState, useEffect } from 'react';
import { Play, Clock, ChevronLeft, ChevronRight, Star, Users, BookOpen, Award, ChevronDown } from 'lucide-react';

const Detail = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMoreInstructor, setShowMoreInstructor] = useState(false);
  // Simulate getting ID from URL params - replace with actual useParams() in your app
  const id = "1"; // For demo purposes
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const relatedCourses = [
    { 
      id: 1, 
      title: 'English Course for kids', 
      rating: 4.7, 
      reviews: 112, 
      price: 69.99, 
      originalPrice: 99.99,
      author: 'James',
      level: '4-12 years old',
      image: '/api/placeholder/270/150'
    },
    { 
      id: 2, 
      title: 'Advanced English Grammar', 
      rating: 4.8, 
      reviews: 89, 
      price: 79.99, 
      originalPrice: 119.99,
      author: 'Sarah',
      level: '13+ years old',
      image: '/api/placeholder/270/150'
    },
    { 
      id: 3, 
      title: 'Business English', 
      rating: 4.6, 
      reviews: 156, 
      price: 99.99, 
      originalPrice: 149.99,
      author: 'Michael',
      level: 'Professional',
      image: '/api/placeholder/270/150'
    },
    { 
      id: 4, 
      title: 'English Pronunciation', 
      rating: 4.9, 
      reviews: 203, 
      price: 59.99, 
      originalPrice: 89.99,
      author: 'Emma',
      level: 'All levels',
      image: '/api/placeholder/270/150'
    },
  ];

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? Math.max(0, relatedCourses.length - 4) : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev >= relatedCourses.length - 4 ? 0 : prev + 1));
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
        // Try to fetch from API with proper error handling
        const response = await fetch(`http://192.168.0.118:8080/api/courses/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.warn('API fetch failed, using fallback data:', error.message);
        
        // Fallback data when API is not available
        setCourse({
          id: id,
          name: `Advanced English Course #${id}`,
          description: "A comprehensive English course designed to help students master grammar, vocabulary, and communication skills. Perfect for learners looking to improve their English proficiency.",
          rating: 4.5,
          totalRatings: 1247,
          learners: 12500,
          certificatesEarned: 1156,
          category: "English",
          level: "Intermediate",
          totalCourses: 24,
          thumbnail: "/api/placeholder/550/350"
        });
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
          <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Course</div>
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

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white">
      {/* Breadcrumb */}
      <div className="py-4 text-sm text-gray-500">
        
     
        <span className="ml-1">{course.category || 'English'}</span>
      </div>

      {/* Course Header */}
      <div className="flex flex-col md:flex-row border-b border-gray-200 pb-8">
        <div className="md:w-1/2 md:pr-6">
          <h1 className="text-3xl font-bold text-blue-600">{course.name}</h1>
          <p className="text-gray-700 mt-3 mb-4">{course.description}</p>

          <div className="flex items-center mb-3">
            <span className="font-bold text-gray-800 mr-2">{course.rating?.toFixed(1) || '4.5'}</span>
            <div className="flex text-yellow-400">
              {'★★★★★'.split('').map((_, i) => (
                <span key={i} className={i >= Math.floor(course.rating || 4.5) ? 'opacity-30' : ''}>★</span>
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">
              ({course.totalRatings || 1000} ratings)
            </span>
            <span className="text-gray-600 text-sm ml-4">
              {course.learners || '10,000'} learners
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            {course.certificatesEarned || '1,000'} certificates earned
          </div>

          <div className="flex gap-2 flex-wrap text-sm">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              {course.category || 'English'}
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Level: {course.level || 'Beginner'}
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {course.totalCourses || '20'} courses
            </span>
          </div>
        </div>

        {/* Video Preview */}
        <div className="md:w-1/2 mt-6 md:mt-0">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 h-64">
            <img
              src={course.thumbnail || '/api/placeholder/550/350'}
              alt="Course preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/80 hover:bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <Play size={30} className="text-blue-600 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Study Schedule */}
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Study schedule</h2>
        
        <div className="border border-blue-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Module 01 */}
            <div className="p-6 border-b md:border-r border-blue-200">
              <h3 className="text-5xl font-bold text-center mb-4">01</h3>
              <h4 className="text-xl font-semibold text-center mb-6">Simple Present</h4>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Introduction</h5>
                    <div className="text-sm text-gray-600">Lesson 01</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    45 Minutes
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Identity</h5>
                    <div className="text-sm text-gray-600">Lesson 02</div>
                  </div>
                  <div className="flex items-center bg-blue-500 text-white px-2 py-1 rounded text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Exercise</h5>
                    <div className="text-sm text-gray-600">Lesson 03</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    45 Minutes
                  </div>
                </div>
              </div>
            </div>
            
            {/* Other modules... */}
            {/* Module 02 */}
            <div className="p-6 border-b md:border-r border-blue-200">
              <h3 className="text-5xl font-bold text-center mb-4">02</h3>
              <h4 className="text-xl font-semibold text-center mb-6">Past Present</h4>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Introduction</h5>
                    <div className="text-sm text-gray-600">Lesson 01</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Identity</h5>
                    <div className="text-sm text-gray-600">Lesson 02</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Exercise</h5>
                    <div className="text-sm text-gray-600">Lesson 03</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    45 Minutes
                  </div>
                </div>
              </div>
            </div>
            
            {/* Module 03 */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-blue-200">
              <h3 className="text-5xl font-bold text-center mb-4">03</h3>
              <h4 className="text-xl font-semibold text-center mb-6">Present Perfect Tense</h4>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Introduction</h5>
                    <div className="text-sm text-gray-600">Lesson 01</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Identity</h5>
                    <div className="text-sm text-gray-600">Lesson 02</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Exercise</h5>
                    <div className="text-sm text-gray-600">Lesson 03</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
              </div>
            </div>
            
            {/* Module 04 */}
            <div className="p-6 border-blue-200">
              <h3 className="text-5xl font-bold text-center mb-4">04</h3>
              <h4 className="text-xl font-semibold text-center mb-6">Past Perfect Tense</h4>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Introduction</h5>
                    <div className="text-sm text-gray-600">Lesson 01</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Identity</h5>
                    <div className="text-sm text-gray-600">Lesson 02</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    1 Hour
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">Exercise</h5>
                    <div className="text-sm text-gray-600">Lesson 03</div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    45 Minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
      <div className="px-4 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-4 md:mb-0">
            <div className="relative">
              <img 
                src="/api/placeholder/200/200" 
                alt="Julian Melanson"
                className="w-32 h-32 rounded-full object-cover border-2 border-purple-500"
              />
              <div className="absolute bottom-0 right-6 bg-yellow-400 rounded-full p-1">
                <Award size={16} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <h2 className="text-2xl font-bold text-purple-600">Julian Melanson</h2>
            <p className="text-gray-600 mb-4">AI Expert & Bestselling Instructor</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <Star size={16} className="text-gray-700 mr-2" />
                <span>4.5 Instructor Rating</span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="text-gray-700 mr-2" />
                <span>58,284 Reviews</span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="text-gray-700 mr-2" />
                <span>478,120 Students</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={16} className="text-gray-700 mr-2" />
                <span>7 Courses</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p>
                My name is Julian, and I am a full-time teacher and bestselling instructor who is truly dedicated to helping students realize their <strong>full potential</strong>. With the honor of teaching over <strong>450,000</strong> students from <strong>130+</strong> countries across the globe, I have honed my skills and become an expert in my field.
              </p>
              
              {showMoreInstructor && (
                <p>
                  My focus is on unlocking your potential to <em>10x your creativity and productivity</em> with <strong>AI tools and filmmaking techniques</strong> I've learned over the years creating countless amounts of content for clients from many industries.
                </p>
              )}
              
              <button 
                onClick={() => setShowMoreInstructor(!showMoreInstructor)}
                className="flex items-center text-purple-600 font-medium"
              >
                {showMoreInstructor ? 'Show less' : 'Show more'} 
                <ChevronDown size={16} className={`ml-1 transform ${showMoreInstructor ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      <div className="px-4 py-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Related Course</h2>
        
        <div className="relative border border-blue-200 rounded-lg p-6">
          <div className="flex overflow-hidden">
            <div className="flex space-x-4 transition-transform duration-300" style={{ transform: `translateX(-${currentSlide * 25}%)` }}>
              {relatedCourses.map((course) => (
                <div key={course.id} className="min-w-[270px] border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={course.image || `/api/placeholder/270/150`} 
                      alt={course.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 text-xs">HOT</div>
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-1 py-0.5 text-xs rounded">✓</div>
                    <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {course.level}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center mb-1">
                      <div className="flex text-yellow-400 text-sm">
                        <span>★</span>
                        <span className="text-gray-600 ml-1">{course.rating} ({course.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{course.author}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg">${course.price}</span>
                        <span className="text-gray-400 text-sm line-through ml-2">${course.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handlePrevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-blue-600"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={handleNextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center shadow-md text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detail;