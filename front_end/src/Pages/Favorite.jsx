import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext"; // đảm bảo import đúng
import ProductCard from "../component/ProductCard"; // component thẻ sản phẩm

const Favorite = () => {
  const context = useContext(ProductContext);
  const favorites = context?.favorites || [];

  // Add safety check for context
  if (!context) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Lỗi hệ thống
          </div>
          <p className="text-gray-400 mb-4">Không thể kết nối với context. Vui lòng tải lại trang.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Danh sách yêu thích</h2>
        
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">💕</div>
            <p className="text-xl text-gray-400 mb-4">Bạn chưa thêm khóa học nào vào danh sách yêu thích</p>
            <p className="text-gray-500">Hãy khám phá và thêm những khóa học bạn quan tâm!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorite;
