import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail } from "react-icons/fi";
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

  // Danh sách khóa học tiếng Anh đa dạng
  const products = [
    {
      id: 1,
      name: "IELTS Intensive",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
      category: "IELTS",
      age: "13-18 year old",
      rating: 4.8,
      ratingCount: 320,
      owner: "Ms. Emma",
      description: "Boost your IELTS score with intensive practice and expert tips.",
      totalHour: 30,
      lessons: 20
    },
    {
      id: 2,
      name: "Business English Pro",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
      category: "Business English",
      age: "18+ year old",
      rating: 4.7,
      ratingCount: 210,
      owner: "Mr. John",
      description: "Master business communication and professional English skills.",
      totalHour: 28,
      lessons: 18
    },
    {
      id: 3,
      name: "English for Kids",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
      category: "Kids English",
      age: "4-12 year old",
      rating: 4.9,
      ratingCount: 400,
      owner: "Ms. Linda",
      description: "Fun and interactive English lessons for children.",
      totalHour: 22,
      lessons: 15
    },
    {
      id: 4,
      name: "Conversation Mastery",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
      category: "Conversation",
      age: "18+ year old",
      rating: 4.6,
      ratingCount: 180,
      owner: "Mr. David",
      description: "Speak English confidently in daily and travel situations.",
      totalHour: 20,
      lessons: 12
    },
    {
      id: 5,
      name: "Grammar Essentials",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      category: "Grammar",
      age: "13-18 year old",
      rating: 4.5,
      ratingCount: 150,
      owner: "Ms. Sarah",
      description: "Solidify your English grammar foundation with easy explanations.",
      totalHour: 18,
      lessons: 10
    },
    {
      id: 6,
      name: "General English Skills",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
      category: "General English",
      age: "18+ year old",
      rating: 4.7,
      ratingCount: 220,
      owner: "Mr. Alex",
      description: "Improve your overall English for work, study, and life.",
      totalHour: 25,
      lessons: 14
    }
  ];

  // Danh sách category mới với ảnh ví dụ
  const categoryOptions = [
    { name: "General English", img: "https://img.icons8.com/color/48/000000/english.png" },
    { name: "IELTS", img: "https://img.icons8.com/color/48/000000/ielts.png" },
    { name: "Business English", img: "https://img.icons8.com/color/48/000000/business.png" },
    { name: "Kids English", img: "https://img.icons8.com/color/48/000000/children.png" },
    { name: "Conversation", img: "https://img.icons8.com/color/48/000000/conference-call.png" },
    { name: "Grammar", img: "https://img.icons8.com/color/48/000000/grammar.png" }
  ];

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    category: "",
    age: "",
    sortBy: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [direction, setDirection] = useState(0);

  // Filter options cho khóa học
  const filterOptions = {
    categories: categoryOptions.map(c => c.name),
    ages: ["4-12 year old", "13-18 year old", "18+ year old"],
    sortOptions: ["Most Popular", "New", "Trending"]
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Lọc theo filter và search
  useEffect(() => {
    let result = products;
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    if (filters.age) {
      result = result.filter(product => product.age === filters.age);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower)
      );
    }
    setFilteredProducts(result);
  }, [filters, searchTerm]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex gap-8">
          <div className="w-64 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Filter by</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-gray-100">Category</h4>
                <div className="relative">
                  <select 
                    className="w-full p-2 border rounded dark:bg-gray-700 text-gray-100 bg-gray-900"
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    value={filters.category}
                  >
                    <option value="">All</option>
                    {categoryOptions.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {/* Hiển thị ảnh ví dụ cho category đã chọn */}
                  {filters.category && (
                    <div className="flex items-center mt-2">
                      <img src={categoryOptions.find(c => c.name === filters.category)?.img} alt="icon" className="w-6 h-6 mr-2" />
                      <span className="text-gray-100">{filters.category}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-100">Age</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700 text-gray-100 bg-gray-900"
                  onChange={(e) => handleFilterChange("age", e.target.value)}
                  value={filters.age}
                >
                  <option value="">All</option>
                  {filterOptions.ages.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Find Our Favorite Course</h2>
              {/* Đã bỏ thanh tìm kiếm */}
            </div>
            {/* Category tags giống ảnh */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <button className={`px-4 py-1 rounded-full font-semibold ${!filters.category ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`} onClick={() => handleFilterChange('category', '')}>All Category</button>
              {categoryOptions.map(cat => (
                <button
                  key={cat.name}
                  className={`px-4 py-1 rounded-full font-semibold flex items-center gap-2 ${filters.category === cat.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => handleFilterChange('category', cat.name)}
                >
                  <img src={cat.img} alt={cat.name} className="w-5 h-5" />
                  {cat.name}
                </button>
              ))}
            </div>
            {/* Danh sách khóa học */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="flex flex-col gap-4"
              >
                {filteredProducts.map((product, index) => (
                  <div key={index} className="flex bg-white rounded-lg shadow p-4 items-center gap-4 border border-gray-200">
                    <img src={product.image} alt={product.name} className="w-40 h-28 object-cover rounded-lg border" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">{product.rating}★ ({product.ratingCount})</span>
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">{product.age}</span>
                        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">{product.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                      <div className="text-sm text-gray-500 mb-1">{product.owner}</div>
                      <div className="text-sm text-gray-700 mb-1 line-clamp-2">{product.description}</div>
                      <div className="text-xs text-gray-400">{product.totalHour} total hour | {product.lessons} lessons</div>
                    </div>
                    <div className="flex flex-col items-end min-w-[80px]">
                      <div className="text-xl font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</div>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition">Add to cart</button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;