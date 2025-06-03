import React, { useState } from "react";
import { FiHeart, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";

const Wishlist = () => {
  const { getWishlistProducts, toggleWishlist } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 2000);
  };

  const handleToggleWishlist = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    toggleWishlist(productId);
    const product = getWishlistProducts().find(p => p.id === productId);
    if (product) {
      showNotification(
        `Removed "${product.name}" from wishlist`,
        'remove'
      );
    }
  };

  const filteredWishlistProducts = getWishlistProducts().filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
              {filteredWishlistProducts.length} {filteredWishlistProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search in wishlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {filteredWishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredWishlistProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex bg-white rounded-lg shadow p-4 items-center gap-4 border border-gray-200"
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
                <div className="flex flex-col items-end min-w-[80px]">
                  <div className="text-xl font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleToggleWishlist(product.id, e)}
                      className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                    >
                      <FiHeart className="w-5 h-5 fill-current" />
                    </button>
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiHeart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-4">Add courses to your wishlist to keep track of your favorites</p>
            <button
              onClick={() => navigate('/store')}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 