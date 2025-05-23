import React, { useState } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate to the detail page with the product id
    navigate(`/detail/${product.id}`);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsWishlisted(!isWishlisted);
  };

  const addToCart = (e) => {
    e.stopPropagation(); // Prevent card click event
    // Add to cart logic here
    console.log("Added to cart:", product.name);
  };

  return (
    <div
      className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image || `/api/placeholder/400/300`}
          alt={product.name}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-red-500 font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <button 
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
            onClick={addToCart}
          >
            <FiShoppingCart className="mr-2" />
            Add to Cart new
          </button>
          <button onClick={toggleWishlist}>
            <FiHeart 
              className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;