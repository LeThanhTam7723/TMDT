package com.example.back_end.service;

import com.example.back_end.dto.response.CourseDetailResponseDTO;
import com.example.back_end.dto.response.CourseListResponseDTO;
import com.example.back_end.dto.response.CourseRatingResponseDTO;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.CourseDetail;
import com.example.back_end.entity.CourseRating;
import com.example.back_end.entity.User;
import com.example.back_end.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CourseRatingRepository courseRatingRepository;


    @Autowired
    private CourseDetailRepository courseDetailRepository;

    @Autowired
    private UserRepository userRepository;


    public List<CourseListResponseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(course -> {
                    // 👇 Lấy thông tin người bán
                    User seller = userRepository.findById(course.getSellerId()).orElse(null);

                    return CourseListResponseDTO.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .price(course.getPrice())
                            .sellerId(course.getSellerId())
                            .categoryId(course.getCategoryId())
                            .description(course.getDescription())
                            .rating(course.getRating())
                            .status(course.getStatus())

                            // 👇 Thêm tên người bán vào đây
                            .sellerName(seller != null ? seller.getFullname() : "Unknown")

                            .categoryName(getCategoryName(course.getCategoryId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    public boolean isCoursePurchasedByUser(Integer userId, Integer courseId) {
        return orderRepository.existsByIdUser_IdAndIdCourse_Id(userId, courseId);
    }
    
    // Lấy ngày mua khóa học - trả về null nếu chưa mua
    public LocalDate getCoursePurchaseDate(Integer userId, Integer courseId) {
        Optional<LocalDate> purchaseDate = orderRepository.findPurchaseDateByUserIdAndCourseId(userId, courseId);
        return purchaseDate.orElse(null);
    }

    public CourseListResponseDTO getCourseById(Integer id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return null;
        }
        User seller = userRepository.findById(course.getSellerId())
                .orElse(null);
        return CourseListResponseDTO.builder()
                .id(course.getId())
                .name(course.getName())
                .price(course.getPrice())
                .sellerId(course.getSellerId())
                .categoryId(course.getCategoryId())
                .description(course.getDescription())
                .rating(course.getRating())
                .status(course.getStatus())
                .sellerName(seller != null ? seller.getFullname() : "Unknown")
                .categoryName(getCategoryName(course.getCategoryId()))
                .build();
    }

    public List<CourseDetailResponseDTO> getCourseDetailsByCourseId(Integer courseId) {
        return courseDetailRepository.findByCourse_Id(courseId).stream()
                .map(detail -> CourseDetailResponseDTO.builder()
                        .id(detail.getId())
                        .episodeNumber(detail.getEpisodeNumber())
                        .link(detail.getLink())
                        .duration(detail.getDuration())
                        .isPreview(detail.getIsPreview())
                        .build())
                .collect(Collectors.toList());
    }

    public void updateCourseRating(Integer courseId, Double newRating) {
        if (newRating < 1.0 || newRating > 5.0) {
            throw new IllegalArgumentException("Rating must be between 1.0 and 5.0");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Simple approach: directly set the new rating
        course.setRating(newRating);
        courseRepository.save(course);
    }

    private String getCategoryName(Integer categoryId) {
        // Map category IDs to names based on our data.sql
        switch (categoryId) {
            case 1: return "IELTS";
            case 2: return "Business English";
            case 3: return "Kids English";
            case 4: return "Conversation";
            case 5: return "Grammar";
            case 6: return "General English";
            default: return "Unknown Category";
        }
    }

    // Search courses by keyword
    public List<CourseListResponseDTO> searchCourses(String keyword) {
        List<Course> courses = courseRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                keyword, keyword);
        
        return courses.stream()
                .filter(Course::getStatus) // Only active courses
                .map(course -> {
                    User seller = userRepository.findById(course.getSellerId()).orElse(null);
                    return CourseListResponseDTO.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .price(course.getPrice())
                            .sellerId(course.getSellerId())
                            .categoryId(course.getCategoryId())
                            .description(course.getDescription())
                            .rating(course.getRating())
                            .status(course.getStatus())
                            .sellerName(seller != null ? seller.getFullname() : "Unknown")
                            .categoryName(getCategoryName(course.getCategoryId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Advanced search with filters
    public List<CourseListResponseDTO> searchCoursesAdvanced(String keyword, Integer categoryId, 
                                                           Double minPrice, Double maxPrice, 
                                                           Double minRating, Boolean status) {
        List<Course> courses = courseRepository.findCoursesWithFilters(
                keyword, categoryId, minPrice, maxPrice, minRating, status);
        
        return courses.stream()
                .map(course -> {
                    User seller = userRepository.findById(course.getSellerId()).orElse(null);
                    return CourseListResponseDTO.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .price(course.getPrice())
                            .sellerId(course.getSellerId())
                            .categoryId(course.getCategoryId())
                            .description(course.getDescription())
                            .rating(course.getRating())
                            .status(course.getStatus())
                            .sellerName(seller != null ? seller.getFullname() : "Unknown")
                            .categoryName(getCategoryName(course.getCategoryId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Get courses by category
    public List<CourseListResponseDTO> getCoursesByCategory(Integer categoryId) {
        List<Course> courses = courseRepository.findByCategoryIdAndStatusTrue(categoryId);
        
        return courses.stream()
                .map(course -> {
                    User seller = userRepository.findById(course.getSellerId()).orElse(null);
                    return CourseListResponseDTO.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .price(course.getPrice())
                            .sellerId(course.getSellerId())
                            .categoryId(course.getCategoryId())
                            .description(course.getDescription())
                            .rating(course.getRating())
                            .status(course.getStatus())
                            .sellerName(seller != null ? seller.getFullname() : "Unknown")
                            .categoryName(getCategoryName(course.getCategoryId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Get courses by price range
    public List<CourseListResponseDTO> getCoursesByPriceRange(Double minPrice, Double maxPrice) {
        List<Course> courses = courseRepository.findByPriceBetweenAndStatusTrue(minPrice, maxPrice);
        
        return courses.stream()
                .map(course -> {
                    User seller = userRepository.findById(course.getSellerId()).orElse(null);
                    return CourseListResponseDTO.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .price(course.getPrice())
                            .sellerId(course.getSellerId())
                            .categoryId(course.getCategoryId())
                            .description(course.getDescription())
                            .rating(course.getRating())
                            .status(course.getStatus())
                            .sellerName(seller != null ? seller.getFullname() : "Unknown")
                            .categoryName(getCategoryName(course.getCategoryId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void submitRating(Integer courseId, Integer userId, Integer rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be 1-5");
        }

        CourseRating courseRating = courseRatingRepository
                .findByCourseIdAndUserId(courseId, userId)
                .orElse(CourseRating.builder()
                        .courseId(courseId)
                        .userId(userId)
                        .build());

        courseRating.setRating(rating);
        courseRatingRepository.save(courseRating);

        // Update course average
        updateCourseAverageRating(courseId);
    }

    public CourseRatingResponseDTO getUserRating(Integer courseId, Integer userId) {
        Optional<CourseRating> rating = courseRatingRepository.findByCourseIdAndUserId(courseId, userId);
        return rating.map(this::convertToResponseDTO).orElse(null);
    }

    private void updateCourseAverageRating(Integer courseId) {
        Double avg = courseRatingRepository.getAverageRating(courseId);
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course != null) {
            course.setRating(avg != null ? avg : 0.0);
            courseRepository.save(course);
        }
    }

    private CourseRatingResponseDTO convertToResponseDTO(CourseRating rating) {
        return CourseRatingResponseDTO.builder()
                .id(rating.getId())
                .courseId(rating.getCourseId())
                .userId(rating.getUserId())
                .rating(rating.getRating())
                .createdAt(rating.getCreatedAt().toString())
                .build();
    }
    
    // Tìm kiếm khóa học theo từ khóa
    public List<CourseListResponseDTO> searchCoursesByKeyword(String keyword) {
        List<Course> courses = courseRepository.findByNameOrDescriptionContainingIgnoreCase(keyword);
        return convertToResponseDTOList(courses);
    }
    
    // Tìm kiếm khóa học theo category
    public List<CourseListResponseDTO> searchCoursesByCategory(Integer categoryId) {
        List<Course> courses = courseRepository.findByCategoryId(categoryId);
        return convertToResponseDTOList(courses);
    }
    
    // Tìm kiếm khóa học theo khoảng giá
    public List<CourseListResponseDTO> searchCoursesByPriceRange(Double minPrice, Double maxPrice) {
        List<Course> courses = courseRepository.findByPriceBetween(minPrice, maxPrice);
        return convertToResponseDTOList(courses);
    }
    
    // Tìm kiếm khóa học theo rating tối thiểu
    public List<CourseListResponseDTO> searchCoursesByMinRating(Double minRating) {
        List<Course> courses = courseRepository.findByRatingGreaterThanEqual(minRating);
        return convertToResponseDTOList(courses);
    }
    

    
    // Helper method để convert danh sách Course thành CourseListResponseDTO
    private List<CourseListResponseDTO> convertToResponseDTOList(List<Course> courses) {
        return courses.stream()
                .map(course -> {
                    User seller = userRepository.findById(course.getSellerId())
                            .orElse(null);
                    return CourseListResponseDTO.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .price(course.getPrice())
                            .sellerId(course.getSellerId())
                            .categoryId(course.getCategoryId())
                            .description(course.getDescription())
                            .rating(course.getRating())
                            .status(course.getStatus())
                            .sellerName(seller != null ? seller.getFullname() : "Unknown")
                            .categoryName(getCategoryName(course.getCategoryId()))
                            .build();
                })
                .collect(Collectors.toList());
    }
}
