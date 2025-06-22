import React, { useState, useEffect } from "react";
import { FiHeart, FiSearch, FiFilter, FiX, FiClock, FiUsers, FiBook, FiDollarSign, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import favoriteService from '../API/favoriteService';

const Store = () => {
  const { 
    products, 
    toggleFavorite, 
    getFavoriteProducts, 
    addToCart, 
    loading, 
    searchResults, 
    searchCourses, 
    searchCoursesAdvanced, 
    clearSearchResults 
  } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get initial search term from URL
  const initialSearchTerm = searchParams.get('q') || '';

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 2000);
  };

  const handleToggleFavorite = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    toggleFavorite(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      const isInFavorite = getFavoriteProducts().some(p => p.id === productId);
      showNotification(
        isInFavorite 
          ? `Removed "${product.name}" from favorites`
          : `Added "${product.name}" to favorites`,
        isInFavorite ? 'remove' : 'add'
      );
    }
  };

  const isInFavorite = (productId) => {
    return getFavoriteProducts().some(p => p.id === productId);
  };

  const handleAddToCart = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      showNotification(`Added "${product.name}" to cart`, 'add');
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLevel = (level) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleAge = (age) => {
    setSelectedAges(prev => 
      prev.includes(age)
        ? prev.filter(a => a !== age)
        : [...prev, age]
    );
  };

  const toggleDuration = (duration) => {
    setSelectedDurations(prev => 
      prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const togglePrice = (price) => {
    setSelectedPrices(prev => 
      prev.includes(price)
        ? prev.filter(p => p !== price)
        : [...prev, price]
    );
  };

  const toggleFeature = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedAges([]);
    setSelectedDurations([]);
    setSelectedPrices([]);
    setSelectedFeatures([]);
    setSelectedRatings([]);
    setSearchTerm("");
    clearSearchResults();
    setIsSearching(false);
  };

  // Handle search
  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      clearSearchResults();
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    await searchCourses(keyword.trim());
  };

  // Handle advanced search with filters
  const handleAdvancedSearch = async () => {
    const searchParams = {};
    
    if (searchTerm.trim()) {
      searchParams.keyword = searchTerm.trim();
    }
    
    if (selectedCategories.length > 0) {
      // For now, we'll use the first selected category
      // In a real app, you might want to handle multiple categories differently
      const categoryMap = {
        'IELTS': 1,
        'Business English': 2,
        'Kids English': 3,
        'Conversation': 4,
        'Grammar': 5,
        'General English': 6
      };
      searchParams.categoryId = categoryMap[selectedCategories[0]];
    }
    
    if (selectedPrices.length > 0) {
      const priceRange = selectedPrices[0].split('-');
      searchParams.minPrice = parseFloat(priceRange[0]);
      searchParams.maxPrice = parseFloat(priceRange[1]);
    }
    
    if (selectedRatings.length > 0) {
      searchParams.minRating = parseFloat(selectedRatings[0]);
    }
    
    searchParams.status = true; // Only show active courses
    
    setIsSearching(true);
    await searchCoursesAdvanced(searchParams);
  };

  // Handle initial search term from URL
  useEffect(() => {
    if (initialSearchTerm && initialSearchTerm !== searchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        clearSearchResults();
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Apply advanced filters when they change
  useEffect(() => {
    if (selectedCategories.length > 0 || selectedPrices.length > 0 || selectedRatings.length > 0) {
      handleAdvancedSearch();
    } else if (!searchTerm.trim()) {
      clearSearchResults();
      setIsSearching(false);
    }
  }, [selectedCategories, selectedPrices, selectedRatings]);

  // Use search results if searching, otherwise use all products
  const displayProducts = isSearching ? searchResults : products;
  
  // Apply local filters only if not using API search
  const filteredProducts = isSearching ? displayProducts : products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(product.level);
    const matchesAge = selectedAges.length === 0 || selectedAges.includes(product.age);
    const matchesDuration = selectedDurations.length === 0 || selectedDurations.includes(product.duration);
    const matchesPrice = selectedPrices.length === 0 || selectedPrices.some(price => {
      const [min, max] = price.split('-').map(Number);
      return product.price >= min && product.price <= max;
    });
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => product.features && product.features.includes(feature));
    const matchesRating = selectedRatings.length === 0 || 
      selectedRatings.some(rating => product.rating >= Number(rating));

    return matchesSearch && matchesCategory && matchesLevel && matchesAge && 
           matchesDuration && matchesPrice && matchesFeatures && matchesRating;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const levels = [...new Set(products.map(p => p.level))];
  const ages = [...new Set(products.map(p => p.age))];
  const durations = [...new Set(products.map(p => p.duration))];
  const allFeatures = [...new Set(products.flatMap(p => p.features || []))];
  const priceRanges = [
    { label: 'Under $20', value: '0-20' },
    { label: '$20 - $50', value: '20-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: '100-1000' }
  ];
  const ratingOptions = ['4.5', '4.0', '3.5', '3.0'];

  return (
    <div className="min-h-screen bg-white">
      {/* Notification */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
            notification.type === 'add' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">English Courses</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'course' : 'courses'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              <FiFilter />
              Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiBook className="w-4 h-4" />
                  Course Type
                </h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Level & Age
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Level</h5>
                    <div className="space-y-2">
                      {levels.map(level => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => toggleLevel(level)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Age Group</h5>
                    <div className="space-y-2">
                      {ages.map(age => (
                        <label key={age} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAges.includes(age)}
                            onChange={() => toggleAge(age)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{age}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  Duration & Price
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Duration</h5>
                    <div className="space-y-2">
                      {durations.map(duration => (
                        <label key={duration} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedDurations.includes(duration)}
                            onChange={() => toggleDuration(duration)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{duration}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Price Range</h5>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPrices.includes(range.value)}
                            onChange={() => togglePrice(range.value)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" />
                  Features & Rating
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Course Features</h5>
                    <div className="space-y-2">
                      {allFeatures.map(feature => (
                        <label key={feature} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h5>
                    <div className="space-y-2">
                      {ratingOptions.map(rating => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating)}
                            onChange={() => toggleRating(rating)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{rating}★ & Up</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              {isSearching ? 'Searching courses...' : 'Loading courses...'}
            </span>
          </div>
        )}

        {/* Search status */}
        {isSearching && !loading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FiSearch className="text-blue-600" />
              <span className="text-blue-800">
                {searchTerm ? `Search results for "${searchTerm}"` : 'Advanced search results'}
              </span>
              <button
                onClick={clearFilters}
                className="ml-auto text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {!loading && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex bg-white rounded-lg shadow p-4 items-center gap-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/detail/${product.id}`)}
              >
                    <img src={product.image} alt={product.name} className="w-40 h-28 object-cover rounded-lg border" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">{product.rating}★ ({product.ratingCount})</span>
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">{product.age}</span>
                        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">{product.category}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">{product.level}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={product.owner.avatar} alt={product.owner.name} className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.owner.name}</div>
                      <div className="text-xs text-gray-500">{product.owner.experience} • {product.owner.students} students</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-1 line-clamp-2">{product.description}</div>
                  {product.features && product.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {product.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">{product.totalHour} total hours | {product.lessons} lessons | {product.duration}</div>
                </div>
                <div className="flex flex-col items-end min-w-[120px]">
                  <div className="text-xl font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/detail/${product.id}`);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition text-sm"
                    >
                      View Details
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(product.id, e);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          isInFavorite(product.id)
                              ? 'bg-red-100 text-red-500 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <FiHeart className={`w-5 h-5 ${isInFavorite(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id, e);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                      >
                        <FiShoppingCart className="w-4 h-4" />
                        Cart
                      </button>
                    </div>
                  </div>
                </div>
                  </div>
                ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiSearch className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSearching ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {isSearching 
                ? 'Try adjusting your search term or filters' 
                : 'Please check back later for new courses'
              }
            </p>
            {isSearching && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Store;