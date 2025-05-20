import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail, FiFilter } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../component/ProductCard";

const Shop = () => {
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const products = [
    { 
      id: 1,
      name: "Khóa học IELTS Foundation",
      price: 2999000,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
      category: "IELTS",
      level: "Cơ bản",
      duration: "3 tháng",
      format: "Online",
      instructor: "John Smith",
      rating: 4.8,
      students: 1200,
      discount: 10,
      bestSeller: true,
      new: true
    },
    {
      id: 2,
      name: "Khóa học TOEIC Speaking",
      price: 1999000,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      category: "TOEIC",
      level: "Trung cấp",
      duration: "2 tháng",
      format: "Online",
      instructor: "Sarah Johnson",
      rating: 4.7,
      students: 850,
      discount: 15,
      bestSeller: true,
      new: false
    },
    {
      id: 3,
      name: "Khóa học TOEIC Reading",
      price: 1999000,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      category: "TOEIC",
      level: "Cao cấp",
      duration: "4 tháng",
      format: "Online",
      instructor: "Sarah Johnson",
      rating: 4.7,
      students: 850,
      discount: 15,
      bestSeller: true,
      new: false
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    duration: "",
    priceRange: "",
    sortBy: ""
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [direction, setDirection] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter categories
  const categories = ["IELTS", "TOEIC", "TOEFL", "Giao tiếp", "Ngữ pháp", "Phát âm"];
  const levels = ["Cơ bản", "Trung cấp", "Nâng cao"];
  const durations = ["1 tháng", "2 tháng", "3 tháng", "6 tháng", "12 tháng"];
  const priceRanges = [
    "Dưới 1 triệu",
    "1 - 2 triệu",
    "2 - 5 triệu",
    "Trên 5 triệu"
  ];
  const sortOptions = [
    "Mới nhất",
    "Đánh giá cao nhất",
    "Học viên nhiều nhất",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Giảm giá"
  ];

  useEffect(() => {
    let result = [...products];

    // Search functionality
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    if (filters.level) {
      result = result.filter(product => product.level === filters.level);
    }
    if (filters.duration) {
      result = result.filter(product => product.duration === filters.duration);
    }
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case "Dưới 1 triệu":
          result = result.filter(product => product.price < 1000000);
          break;
        case "1 - 2 triệu":
          result = result.filter(product => product.price >= 1000000 && product.price <= 2000000);
          break;
        case "2 - 5 triệu":
          result = result.filter(product => product.price > 2000000 && product.price <= 5000000);
          break;
        case "Trên 5 triệu":
          result = result.filter(product => product.price > 5000000);
          break;
        default:
          break;
      }
    }

    // Sort products
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "Mới nhất":
          result = [...result].sort((a, b) => b.new - a.new);
          break;
        case "Đánh giá cao nhất":
          result = [...result].sort((a, b) => b.rating - a.rating);
          break;
        case "Học viên nhiều nhất":
          result = [...result].sort((a, b) => b.students - a.students);
          break;
        case "Giá thấp đến cao":
          result = [...result].sort((a, b) => a.price - b.price);
          break;
        case "Giá cao đến thấp":
          result = [...result].sort((a, b) => b.price - a.price);
          break;
        case "Giảm giá":
          result = [...result].sort((a, b) => b.discount - a.discount);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
  }, [filters, searchQuery]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      level: "",
      duration: "",
      priceRange: "",
      sortBy: ""
    });
    setSearchQuery("");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học online..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <FiFilter />
                {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold mb-2">Loại khóa học</h3>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Tất cả</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <h3 className="font-semibold mb-2">Trình độ</h3>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange("level", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Tất cả</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <h3 className="font-semibold mb-2">Thời lượng</h3>
                  <select
                    value={filters.duration}
                    onChange={(e) => handleFilterChange("duration", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Tất cả</option>
                    {durations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold mb-2">Khoảng giá</h3>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Tất cả</option>
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-semibold mb-2">Sắp xếp</h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Mặc định</option>
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">Không tìm thấy khóa học online phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;