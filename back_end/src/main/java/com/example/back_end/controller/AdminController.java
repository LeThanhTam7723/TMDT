package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.CourseListResponseDTO;
import com.example.back_end.service.CourseServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CourseServiceImpl courseService;

    // Lấy danh sách tất cả khóa học (bao gồm cả chờ phê duyệt và đã phê duyệt)
    @GetMapping("/courses")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<List<CourseListResponseDTO>> getAllCoursesForAdmin() {
        try {
            List<CourseListResponseDTO> courses = courseService.getAllCoursesForAdmin();
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(200)
                    .message("Fetched all courses for admin successfully.")
                    .result(courses)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching courses for admin: ", e);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(500)
                    .message("Error fetching courses: " + e.getMessage())
                    .build();
        }
    }

    // Lấy danh sách khóa học chờ phê duyệt
    @GetMapping("/courses/pending")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<List<CourseListResponseDTO>> getPendingCourses() {
        try {
            List<CourseListResponseDTO> pendingCourses = courseService.getPendingCourses();
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(200)
                    .message("Fetched pending courses successfully.")
                    .result(pendingCourses)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching pending courses: ", e);
            return ApiResponse.<List<CourseListResponseDTO>>builder()
                    .code(500)
                    .message("Error fetching pending courses: " + e.getMessage())
                    .build();
        }
    }

    // Phê duyệt khóa học
    @PutMapping("/courses/{courseId}/approve")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<String> approveCourse(@PathVariable Integer courseId) {
        try {
            boolean success = courseService.approveCourse(courseId);
            if (success) {
                return ApiResponse.<String>builder()
                        .code(200)
                        .message("Course approved successfully.")
                        .result("Course with ID " + courseId + " has been approved.")
                        .build();
            } else {
                return ApiResponse.<String>builder()
                        .code(404)
                        .message("Course not found or already approved.")
                        .build();
            }
        } catch (Exception e) {
            log.error("Error approving course: ", e);
            return ApiResponse.<String>builder()
                    .code(500)
                    .message("Error approving course: " + e.getMessage())
                    .build();
        }
    }

    // Từ chối khóa học
    @PutMapping("/courses/{courseId}/reject")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<String> rejectCourse(@PathVariable Integer courseId, 
                                          @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ApiResponse.<String>builder()
                        .code(400)
                        .message("Rejection reason is required.")
                        .build();
            }
            
            boolean success = courseService.rejectCourse(courseId, reason);
            if (success) {
                return ApiResponse.<String>builder()
                        .code(200)
                        .message("Course rejected successfully.")
                        .result("Course with ID " + courseId + " has been rejected.")
                        .build();
            } else {
                return ApiResponse.<String>builder()
                        .code(404)
                        .message("Course not found.")
                        .build();
            }
        } catch (Exception e) {
            log.error("Error rejecting course: ", e);
            return ApiResponse.<String>builder()
                    .code(500)
                    .message("Error rejecting course: " + e.getMessage())
                    .build();
        }
    }

    // Lấy thống kê khóa học cho admin
    @GetMapping("/courses/statistics")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<Map<String, Object>> getCourseStatistics() {
        try {
            Map<String, Object> statistics = courseService.getCourseStatistics();
            return ApiResponse.<Map<String, Object>>builder()
                    .code(200)
                    .message("Course statistics fetched successfully.")
                    .result(statistics)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching course statistics: ", e);
            return ApiResponse.<Map<String, Object>>builder()
                    .code(500)
                    .message("Error fetching statistics: " + e.getMessage())
                    .build();
        }
    }
} 