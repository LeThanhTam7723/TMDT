import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../component/ProductCard"; 
import axiosClient from '../API/axiosClient'; // Adjust the path as needed
// Using our own arrow icon components instead of FiChevron icons
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Better banner images with different gradients and themes
  const banners = [
    {
      title: "Master English with Native Speakers",
      description: "Learn from experienced native speakers and improve your English skills. Special offer: 25% off!",
      image: "https://img.freepik.com/free-photo/dark-gradient-background-with-copy-space_53876-99548.jpg",
      bgGradient: "from-purple-900 to-indigo-800"
    },
    {
      title: "Professional IELTS Training",
      description: "Achieve your target IELTS score with our comprehensive course. Expert guidance and practice materials!",
      image: "https://img.freepik.com/free-photo/dark-gradient-background-with-copy-space_53876-99548.jpg",
      bgGradient: "from-blue-900 to-blue-700"
    },
    {
      title: "Business English Excellence",
      description: "Enhance your professional communication skills. Perfect for career advancement!",
      image: "https://img.freepik.com/free-photo/dark-gradient-background-with-copy-space_53876-99548.jpg",
      bgGradient: "from-indigo-900 to-violet-800"
    }
  ];

  const courses = [
    {
      id: 1,
      name: "English Grammar Mastery",
      teacher: "Sarah Wilson",
      price: "đ299,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Business English Communication",
      teacher: "Michael Anderson",
      price: "đ399,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "IELTS Preparation Course",
      teacher: "Emma Thompson",
      price: "đ499,000",
      rating: 4,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3"
    },
    {
      id: 4,
      name: "English Speaking Practice",
      teacher: "David Brown",
      price: "đ599,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
    }
  ];
  useEffect(() => {
  const fetchAllCourses = async () => {
    try {
      const response = await axiosClient.get('/courses', {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJDRFdFRC5jb20iLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0ODYwOTU0OSwiaWF0IjoxNzQ4NjA1OTQ5LCJqdGkiOiJkZGNhYjA2OC0zYWQ4LTRjY2ItODk0ZC05M2I5ZTFiZmY5YjkiLCJzY29wZSI6IkFETUlOIn0.DoD0ShphS5MS7qZjxSOhpHLLmzULim1_9b51k1dcyF0sK01PdOto-LvspRtbs6p5uw0DFDAl5T9lpXOHClCDFA`
        }
      });

      if (response.data && response.data.code === 200 && Array.isArray(response.data.result)) {
        console.log("Fetched courses:", response.data.result);
        // Nếu bạn muốn lưu vào state thì tạo state setCourses và gọi nó ở đây
        setProducts(response.data.result);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch all courses:", error.message || error);
    }
  };

  fetchAllCourses();
}, []);

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating, banners.length]);

  const changeBanner = (direction) => {
    setIsAnimating(true);
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleProductClick = () => {
    navigate(`/detail`);
  };

  const renderStars = (rating) => {
    return [...Array(rating)].map((_, i) => (
      <span key={i} className="text-yellow-400">★</span>
    ));
  };

  // Indicator dots for banner
  const renderIndicators = () => {
    return (
      <div className="flex justify-center mt-4 absolute bottom-4 left-0 right-0">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`mx-1 w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            } transition-all duration-300`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Enhanced Banner Section */}
      <section className="relative h-80 md:h-96 overflow-hidden rounded-b-lg shadow-2xl">
        {/* Banner Background with Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${banners[currentSlide].bgGradient} transition-opacity duration-500`}>
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        {/* Banner Content */}
        <div className="relative h-full container mx-auto px-4">
          {/* Banner Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={banners[currentSlide].image}
              alt="Banner"
              className="w-full h-full object-cover opacity-60 scale-105"
            />
          </div>
          
          {/* Content Overlay */}
          <div className="relative flex items-center h-full z-10">
            <div className="max-w-lg opacity-100">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {banners[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-white mb-6 drop-shadow-lg">
                {banners[currentSlide].description}
              </p>
              <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full hover:from-red-700 hover:to-red-800 transition duration-300 font-semibold shadow-lg">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <button
          onClick={() => changeBanner("prev")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all duration-300 border border-white/20"
          disabled={isAnimating}
        >
          <ChevronLeft />
        </button>
        
        <button
          onClick={() => changeBanner("next")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all duration-300 border border-white/20"
          disabled={isAnimating}
        >
          <ChevronRight />
        </button>
        
        {/* Indicator Dots */}
        {renderIndicators()}
      </section>

      {/* Recommend Section with Enhanced Cards */}
      <section className="container mx-auto px-4 py-12">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold">Recommend for you</h2>
    <a href="#" className="text-blue-400 hover:text-blue-300 transition">View all</a>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</section>

      {/* Popular for Beginner Section with Enhanced Cards */}
      <section className="container mx-auto px-4 py-12 bg-black/30 rounded-lg my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular for Beginner</h2>
          <a href="#" className="text-blue-400 hover:text-blue-300 transition">View all</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20"></div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-white">{course.name}</h3>
                <p className="text-gray-300 mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  {course.teacher}
                </p>
                <div className="flex items-center mb-3">
                  {renderStars(course.rating)}
                  <span className="ml-2 text-gray-400 text-sm">({course.rating}.0)</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-red-400">{course.price}</p>
                  <button 
                    onClick={() => handleProductClick(course.id)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Achievements Section with Enhanced Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">See others' learning achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600 transform rotate-45 translate-x-8 -translate-y-8"></div>
              <div className="text-gray-100 mb-8 relative">
                <span className="text-blue-400 text-4xl absolute -top-4 -left-2">"</span>
                <p className="pt-4">
                  {course.name === "English Grammar Mastery" && "Khóa học ngữ pháp rất chi tiết và dễ hiểu. Cô Sarah giảng dạy rất nhiệt tình và có phương pháp. Sau khóa học, tôi tự tin hơn rất nhiều về ngữ pháp tiếng Anh!"}
                  {course.name === "Business English Communication" && "Business English Communication giúp tôi tự tin hơn trong giao tiếp với đối tác nước ngoài. Các tình huống thực tế trong khóa học rất hữu ích cho công việc."}
                  {course.name === "IELTS Preparation Course" && "Khóa học IELTS rất chất lượng. Cô Emma chia sẻ nhiều tips hay và các chiến lược làm bài hiệu quả. Điểm IELTS của tôi đã tăng từ 6.0 lên 7.0 sau khóa học!"}
                  {course.name === "English Speaking Practice" && "English Speaking Practice giúp tôi tự tin nói tiếng Anh hàng ngày dễ dàng. Thầy David luôn tạo không khí học tập vui vẻ và hiệu quả."}
                </p>
              </div>
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-blue-400">
                  <img
                    src={`https://i.pravatar.cc/150?img=${course.id}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {course.name === "English Grammar Mastery" && "Nguyễn Văn An"}
                    {course.name === "Business English Communication" && "Trần Thị Bình"}
                    {course.name === "IELTS Preparation Course" && "Lê Hoàng Nam"}
                    {course.name === "English Speaking Practice" && "Phạm Minh Anh"}
                  </p>
                  <p className="text-gray-400 text-sm">{course.name} • 2024</p>
                </div>
              </div>
              <button className="text-blue-400 text-sm mt-4 hover:text-blue-300 transition-colors flex items-center">
                View courses 
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>
      
      {/* New CTA Section */}
      <section className="container mx-auto px-4 py-16 my-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="md:w-2/3 relative z-10 mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your English journey?</h2>
            <p className="text-lg text-gray-200 mb-6">Join thousands of satisfied students and achieve your language goals today!</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition duration-300 shadow-lg">
                Get Started
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition duration-300">
                View All Courses
              </button>
            </div>
          </div>
          
          <div className="md:w-1/3 relative z-10 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-2xl">
              <div className="text-4xl font-bold text-center mb-2">30k+</div>
              <div className="text-center text-gray-200">Satisfied Students</div>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};

export default HomePage;