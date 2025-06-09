import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext"; // đảm bảo import đúng
import ProductCard from "../component/ProductCard"; // component thẻ sản phẩm

const Favorite = () => {
  const { favorites } = useContext(ProductContext);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Danh sách yêu thích</h2>
      
      {favorites.length === 0 ? (
        <p className="text-gray-400">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
