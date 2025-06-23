package com.example.back_end.controller;

import com.example.back_end.dto.request.CourseRatingRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.CourseDetailResponseDTO;
import com.example.back_end.dto.response.CourseListResponseDTO;
import com.example.back_end.dto.response.CourseRatingResponseDTO;
import com.example.back_end.repositories.OrderRepository;
import com.example.back_end.service.CourseServiceImpl;
import com.example.back_end.service.order.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseServiceImpl courseService;
    private OrderRepository orderRepository;

    @GetMapping
    public ApiResponse<List<CourseListResponseDTO>> getAllCourses() {
        try {
            List<CourseListResponseDTO> courses = courseService.getAllCourses();
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(200)
                    .message("Fetched all courses successfully.")
                    .result(courses)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching courses: ", e);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(500)
                    .message("Error fetching courses: " + e.getMessage())
                    .build();
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<CourseListResponseDTO> getCourseById(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer userId) {
        try {
            CourseListResponseDTO course = courseService.getCourseById(id);
            if (course == null) {
                return ApiResponse.<CourseListResponseDTO>builder()
                        .code(404)
                        .message("Course not found")
                        .build();
            }

            // Kiểm tra xem người dùng đã mua chưa và lấy ngày mua
            boolean isPurchased = false;
            boolean isFullyUnlocked = false;
            java.time.LocalDate purchaseDate = null;
            
            if (userId != null) {
                // Sử dụng method mới để lấy ngày mua
                purchaseDate = courseService.getCoursePurchaseDate(userId, id);
                isPurchased = (purchaseDate != null);
                
                // Kiểm tra xem khóa học đã được mở khóa hoàn toàn sau 3 ngày chưa
                if (isPurchased) {
                    isFullyUnlocked = courseService.isCourseFullyUnlocked(userId, id);
                }
            }
            
            course.setPurchased(isPurchased);
            course.setPurchaseDate(purchaseDate);
            course.setFullyUnlocked(isFullyUnlocked);

            return ApiResponse.<CourseListResponseDTO>builder()
                    .code(200)
                    .message("Course found")
                    .result(course)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching course: ", e);
            return ApiResponse.<CourseListResponseDTO>builder()
                    .code(500)
                    .message("Error fetching course: " + e.getMessage())
                    .build();
        }
    }



    @GetMapping("/details/{id}")
    public ApiResponse<List<CourseDetailResponseDTO>> getCourseDetailsByCourseId(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer userId) {
        try {
            List<CourseDetailResponseDTO> details = courseService.getCourseDetailsByCourseId(id);
            if (details == null) {
                return ApiResponse.<List<CourseDetailResponseDTO>>builder()
                        .code(404)
                        .message("Course not found")
                        .build();
            }

            // Kiểm tra trạng thái mua và mở khóa của người dùng
            boolean isPurchased = false;
            boolean isFullyUnlocked = false;
            
            if (userId != null) {
                java.time.LocalDate purchaseDate = courseService.getCoursePurchaseDate(userId, id);
                isPurchased = (purchaseDate != null);
                
                if (isPurchased) {
                    isFullyUnlocked = courseService.isCourseFullyUnlocked(userId, id);
                }
            }

            // Cập nhật quyền truy cập cho từng episode dựa trên logic mới
            for (CourseDetailResponseDTO detail : details) {
                // Nếu đã mua và đã qua 3 ngày, mở khóa tất cả
                // Nếu chưa qua 3 ngày, chỉ mở khóa preview episodes
                // Nếu chưa mua, chỉ mở khóa preview episodes
                boolean hasAccess = detail.getIsPreview() || (isPurchased && isFullyUnlocked);
                detail.setHasAccess(hasAccess);
                detail.setIsPurchased(isPurchased);
                detail.setIsFullyUnlocked(isFullyUnlocked);
            }

            return ApiResponse.<List<CourseDetailResponseDTO>>builder()
                    .code(200)
                    .message("Fetched course details successfully.")
                    .result(details)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching course details: ", e);
            return ApiResponse.<List<CourseDetailResponseDTO>>builder()
                    .code(500)
                    .message("Error fetching course details: " + e.getMessage())
                    .build();
        }
    }

    @PostMapping("/{id}/rate")
    public ApiResponse<String> rateCourse(@PathVariable Integer id, @RequestBody CourseRatingRequest request) {
        try {
            courseService.submitRating(id, request.getUserId(), request.getRating());
            return ApiResponse.<String>builder()
                    .code(200)
                    .message("Rating submitted successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error rating course: ", e);
            return ApiResponse.<String>builder()
                    .code(500)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    @GetMapping("/{courseId}/user-rating/{userId}")
    public ApiResponse<CourseRatingResponseDTO> getUserRating(@PathVariable Integer courseId, @PathVariable Integer userId) {
        try {
            CourseRatingResponseDTO rating = courseService.getUserRating(courseId, userId);
            return ApiResponse.<CourseRatingResponseDTO>builder()
                    .code(200)
                    .message("Success")
                    .result(rating)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<CourseRatingResponseDTO>builder()
                    .code(500)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
    
    // Tìm kiếm khóa học theo từ khóa
    @GetMapping("/search")
    public ApiResponse<List<CourseListResponseDTO>> searchCourses(@RequestParam(required = false) String keyword) {
        try {
            List<CourseListResponseDTO> courses;
            if (keyword == null || keyword.trim().isEmpty()) {
                courses = courseService.getAllCourses();
            } else {
                courses = courseService.searchCourses(keyword.trim());
            }
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(200)
                    .message("Search completed successfully")
                    .result(courses)
                    .build();
        } catch (Exception e) {
            log.error("Error searching courses: ", e);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(500)
                    .message("Error searching courses: " + e.getMessage())
                    .build();
        }
    }
    
    // Tìm kiếm khóa học theo category
    @GetMapping("/search/category/{categoryId}")
    public ApiResponse<List<CourseListResponseDTO>> searchCoursesByCategory(@PathVariable Integer categoryId) {
        try {
            List<CourseListResponseDTO> courses = courseService.getCoursesByCategory(categoryId);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(200)
                    .message("Search by category completed successfully")
                    .result(courses)
                    .build();
        } catch (Exception e) {
            log.error("Error searching courses by category: ", e);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(500)
                    .message("Error searching courses by category: " + e.getMessage())
                    .build();
        }
    }
    
    // Tìm kiếm khóa học theo khoảng giá
    @GetMapping("/search/price")
    public ApiResponse<List<CourseListResponseDTO>> searchCoursesByPriceRange(
            @RequestParam Double minPrice, 
            @RequestParam Double maxPrice) {
        try {
            List<CourseListResponseDTO> courses = courseService.getCoursesByPriceRange(minPrice, maxPrice);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(200)
                    .message("Search by price range completed successfully")
                    .result(courses)
                    .build();
        } catch (Exception e) {
            log.error("Error searching courses by price range: ", e);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(500)
                    .message("Error searching courses by price range: " + e.getMessage())
                    .build();
        }
    }
    

    
    // Tìm kiếm nâng cao với nhiều tiêu chí
    @GetMapping("/search/advanced")
    public ApiResponse<List<CourseListResponseDTO>> searchCoursesAdvanced(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean status) {
        try {
            List<CourseListResponseDTO> courses = courseService.searchCoursesAdvanced(
                keyword, categoryId, minPrice, maxPrice, minRating, status);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(200)
                    .message("Advanced search completed successfully")
                    .result(courses)
                    .build();
        } catch (Exception e) {
            log.error("Error in advanced search: ", e);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(500)
                    .message("Error in advanced search: " + e.getMessage())
                    .build();
        }
    }
}
