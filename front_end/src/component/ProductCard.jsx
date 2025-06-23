import React, { useState, memo, useCallback } from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useProduct } from '../context/ProductContext';

// Dummy star renderer
const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-4 h-4 fill-current ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09L5.4 12.18.4 7.91l6.09-.89L10 2l2.51 5.02 6.09.89-4.999 4.27 1.279 5.91z" />
      </svg>
    );
  }
  return <div className="flex">{stars}</div>;
};
const defaultImages = [
  "https://study4.com/media/courses/CourseSeries/files/2023/10/11/ielts_band_0_7.webp",
  "https://m.media-amazon.com/images/I/51yBYmDJPNL._SL500_.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzaxe4xnXoGduxVSFzSGrNYLjK4vKfmtr4fg&s",
  "https://www.lingobest.com/free-online-english-course/wp-content/uploads/2021/03/Blog-Banners-Bruna-S-15-1.jpg",
];

const ProductCard = memo(({ product }) => {
  const navigate = useNavigate();
  const { isInFavorites, toggleFavorite: contextToggleFavorite, session } = useProduct();

  const handleClick = useCallback(() => {
    navigate(`/detail/${product.id}`);
  }, [navigate, product.id]);

  const handleToggleFavorite = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session?.currentUser) {
      alert('Please login to add favorites');
      return;
    }
    
    await contextToggleFavorite(product.id);
  }, [session?.currentUser, contextToggleFavorite, product.id]);

  const isFavorited = isInFavorites(product.id);

  return (
    <div
      className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
       <img
  src={
    product.image || defaultImages[product.id % 4]
  }
  alt={product.name}
  className="w-full h-48 object-cover"
  loading="lazy"
  decoding="async"
/>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20"></div>
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-5 text-white">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-300 mb-2 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          {product.sellerName || "By Admin"}
        </p>
        <div className="flex items-center mb-3">
          {renderStars(product.rating || 4)}
          <span className="ml-2 text-gray-400 text-sm">({product.rating || 4}.0)</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold text-red-400">
            ${product.price}
            {product.originalPrice && (
              <span className="ml-2 text-sm line-through text-gray-400">
                ${product.originalPrice}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={handleToggleFavorite}>
              <FiHeart
                className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-white'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
