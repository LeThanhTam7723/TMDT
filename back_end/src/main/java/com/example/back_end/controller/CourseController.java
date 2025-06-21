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

            // Kiểm tra xem người dùng đã mua chưa
            boolean isPurchased = false;
            if (userId != null) {
                isPurchased = courseService.isCoursePurchasedByUser(userId, id);
            }
            course.setPurchased(isPurchased);

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
    public ApiResponse<List<CourseDetailResponseDTO>> getCourseDetailsByCourseId(@PathVariable Integer id) {
        List<CourseDetailResponseDTO> details = courseService.getCourseDetailsByCourseId(id);
        if (details == null) {
            return ApiResponse.<List<CourseDetailResponseDTO>>builder()
                    .code(404)
                    .message("Course not found")
                    .build();
        }

        return ApiResponse.<List<CourseDetailResponseDTO>>builder()
                .code(200)
                .message("Fetched course details successfully.")
                .result(details)
                .build();
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
}
