import React, { useState } from 'react';
import { Play, Clock, ChevronLeft, ChevronRight, Star, Users, BookOpen, Award, ChevronDown } from 'lucide-react';

const Detail=() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMoreInstructor, setShowMoreInstructor] = useState(false);
  
  const relatedCourses = [
    { 
      id: 1, 
      title: 'English Course for kids', 
      rating: 4.7, 
      reviews: 112, 
      price: 69.99, 
      originalPrice: 99.99,
      author: 'James',
      level: '4-12 years old'
    },
    { 
      id: 2, 
      title: 'English Course for kids', 
      rating: 4.7, 
      reviews: 112, 
      price: 69.99, 
      originalPrice: 99.99,
      author: 'James',
      level: '4-12 years old'
    },
    { 
      id: 3, 
      title: 'English Course for kids', 
      rating: 4.7, 
      reviews: 112, 
      price: 69.99, 
      originalPrice: 99.99,
      author: 'James',
      level: '4-12 years old' 
    },
    { 
      id: 4, 
      title: 'English Course for kids', 
      rating: 4.7, 
      reviews: 112, 
      price: 69.99, 
      originalPrice: 99.99,
      author: 'James',
      level: '4-12 years old'
    },
  ];

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? relatedCourses.length - 4 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === relatedCourses.length - 4 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white">
      {/* Breadcrumb */}
      <div className="p-4 text-sm">
        <span className="text-gray-600">Courses</span> &gt; <span className="text-gray-600">English</span>
      </div>

      {/* Course Header */}
      <div className="flex flex-col md:flex-row px-4 pb-8 border-b border-gray-200">
        <div className="md:w-1/2 pr-4">
          <h1 className="text-3xl font-bold text-blue-600">Online English Course</h1>
          <p className="text-gray-600 mt-2 mb-4">
            Online English course helps you learn anytime, anywhere with personalization roadmap. Diverse content, easy to understand lessons, videos, exercises and support from lecturers. Suitable for beginners to improve, practice 4 comprehensive skills.
          </p>
          
          <div className="flex items-center mb-2">
            <div className="font-bold text-gray-800 mr-2">4.6</div>
            <div className="flex text-yellow-400">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i} className={i === 4 ? 'opacity-50' : ''}>★</span>
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">(129,113 ratings)</span>
            <span className="text-gray-600 text-sm ml-2">5,905,500 Learners</span>
          </div>
          
          <div className="mb-4">
            <span className="text-gray-600 text-sm">1,330,480 Certificates Earned</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center text-sm">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-1"></div>
              English
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full flex items-center text-sm">
              <span className="text-blue-600 font-bold mr-1">5</span>
              50 courses
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full flex items-center text-sm">
              <span className="font-bold mr-1">≡</span>
              Beginner
            </span>
          </div>
        </div>
        
        {/* Video Preview */}
        <div className="md:w-1/2">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img 
              src="/api/placeholder/550/350" 
              alt="Course preview" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="bg-white/30 backdrop-blur-sm p-6 rounded-lg text-center">
                  <h3 className="text-blue-800 font-bold text-lg">Unlock Your</h3>
                  <h2 className="text-blue-800 font-bold text-2xl">English Mastery</h2>
                  <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-full">
                    Start now
                  </button>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <button className="bg-white/80 hover:bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                    <Play size={30} className="text-blue-600 ml-1" />
                  </button>
                </div>
              </div>
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
              {relatedCourses.map((course, index) => (
                <div key={course.id} className="min-w-[270px] border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={`/api/placeholder/270/150`} 
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