import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axiosClient from "../API/axiosClient";

const StarRating = ({ courseId, currentRating = 0 }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserRating();
  }, [courseId]);

  const fetchUserRating = async () => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (!session.currentUser?.id) return;

    try {
      const response = await axiosClient.get(
        `/courses/${courseId}/user-rating/${session.currentUser.id}`
      );
      if (response.data.code === 200 && response.data.result) {
        setUserRating(response.data.result.rating);
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const handleRatingClick = async (rating) => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (!session.currentUser?.id) {
      alert("Bạn cần đăng nhập để đánh giá");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post(`/courses/${courseId}/rate`, {
        courseId: parseInt(courseId),
        userId: session.currentUser.id,
        rating: rating,
      });

      if (response.data.code === 200) {
        setUserRating(rating);
        alert("Đánh giá thành công!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="font-bold text-gray-800 mr-2">
          {currentRating > 0 ? currentRating.toFixed(1) : "Chưa có đánh giá"}
        </span>
        <div className="flex text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.floor(currentRating)
                  ? "fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Đánh giá:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              star <= (hoverRating || userRating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            } ${loading ? "pointer-events-none opacity-50" : ""}`}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
        {userRating > 0 && (
          <span className="text-sm text-gray-500">({userRating} sao)</span>
        )}
        {loading && <span className="text-sm text-gray-500">Đang lưu...</span>}
      </div>
    </div>
  );
};

export default StarRating;
