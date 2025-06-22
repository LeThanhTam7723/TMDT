package com.example.back_end.controller;

import com.example.back_end.dto.CourseSummaryDTO;
import com.example.back_end.dto.SellerDTO;
import com.example.back_end.dto.request.CourseCreateRequest;
import com.example.back_end.dto.request.CourseDetailCreateRequest;
import com.example.back_end.dto.request.CourseDetailUpdateRequest;
import com.example.back_end.dto.request.CourseUpdateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.SellerRevenueResponseDTO;
import com.example.back_end.dto.response.SellerStatsResponseDTO;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.CourseDetail;
import com.example.back_end.entity.User;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.UserRepository;
import com.example.back_end.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/seller")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SellerController {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final SellerService sellerService;

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getSellerByCourseId(@PathVariable Integer courseId) {
        try {
            log.info("🔍 Getting seller info for courseId: {}", courseId);
            
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                log.warn("❌ Course not found with ID: {}", courseId);
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .code(404)
                        .message("Course not found with ID: " + courseId)
                        .build()
                );
            }

            Course course = courseOpt.get();
            Integer sellerId = course.getSellerId();
            
            if (sellerId == null) {
                log.warn("❌ Course {} has no sellerId", courseId);
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .code(400)
                        .message("Course has no associated seller")
                        .build()
                );
            }

            log.info("🔍 Looking for seller with ID: {}", sellerId);
            Optional<User> userOpt = userRepository.findById(sellerId);
            if (userOpt.isEmpty()) {
                log.warn("❌ Seller not found with ID: {}", sellerId);
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .code(404)
                        .message("Seller not found with ID: " + sellerId)
                        .build()
                );
            }

            User seller = userOpt.get();
            
            if (!seller.getActive()) {
                log.warn("❌ Seller {} is inactive", sellerId);
                return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                        .code(400)
                        .message("Seller account is inactive")
                        .build()
                );
            }

            SellerDTO sellerDTO = SellerDTO.builder()
                    .id(seller.getId())
                    .fullname(seller.getFullname() != null ? seller.getFullname() : "Unknown")
                    .email(seller.getEmail())
                    .phone(seller.getPhone())
                    .avatar(seller.getAvatar())
                    .introduce(seller.getIntroduce())
                    .certificate(seller.getCertificate())
                    .gender(seller.getGender())
                    .build();

            log.info("✅ Successfully found seller: {}", seller.getFullname());
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(200)
                    .message("Success")
                    .result(sellerDTO)
                    .build());
            
        } catch (Exception e) {
            log.error("❌ Error getting seller for courseId {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                ApiResponse.builder()
                    .code(500)
                    .message("Internal server error: " + e.getMessage())
                    .build()
            );
        }
    }
    @GetMapping("/{sellerId}/courses")
    public ResponseEntity<?> getCoursesBySeller(@PathVariable Integer sellerId) {
        List<Course> courses = courseRepository.findBySellerId(sellerId);

        List<CourseSummaryDTO> courseSummaries = courses.stream().map(course -> {
            int totalEpisodes = course.getCourseDetails() != null ? course.getCourseDetails().size() : 0;
            int totalDuration = course.getCourseDetails() != null
                    ? course.getCourseDetails().stream().mapToInt(detail -> detail.getDuration() != null ? detail.getDuration() : 0).sum()
                    : 0;

            return CourseSummaryDTO.builder()
                    .id(course.getId())
                    .name(course.getName())
                    .description(course.getDescription())
                    .price(course.getPrice())
                    .rating(course.getRating())
                    .episodeCount(totalEpisodes)
                    .duration(totalDuration)
                    .build();
        }).toList();

        return ResponseEntity.ok().body(
                new ApiResponse(200, "Success", courseSummaries)
        );
    }

    // ===== SELLER COURSE MANAGEMENT APIs =====

    @PostMapping("/{sellerId}/courses")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<Course>> createCourse(
            @PathVariable Integer sellerId,
            @RequestBody CourseCreateRequest request) {
        try {
            Course course = sellerService.createCourse(sellerId, request);
            return ResponseEntity.ok(ApiResponse.<Course>builder()
                    .code(200)
                    .message("Course created successfully")
                    .result(course)
                    .build());
        } catch (Exception e) {
            log.error("Error creating course: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<Course>builder()
                    .code(400)
                    .message("Error creating course: " + e.getMessage())
                    .build());
        }
    }

    @PutMapping("/{sellerId}/courses/{courseId}")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<Course>> updateCourse(
            @PathVariable Integer sellerId,
            @PathVariable Integer courseId,
            @RequestBody CourseUpdateRequest request) {
        try {
            Course course = sellerService.updateCourse(sellerId, courseId, request);
            return ResponseEntity.ok(ApiResponse.<Course>builder()
                    .code(200)
                    .message("Course updated successfully")
                    .result(course)
                    .build());
        } catch (Exception e) {
            log.error("Error updating course: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<Course>builder()
                    .code(400)
                    .message("Error updating course: " + e.getMessage())
                    .build());
        }
    }

    @DeleteMapping("/{sellerId}/courses/{courseId}")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Integer sellerId,
            @PathVariable Integer courseId) {
        try {
            sellerService.deleteCourse(sellerId, courseId);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .code(200)
                    .message("Course deleted successfully")
                    .build());
        } catch (Exception e) {
            log.error("Error deleting course: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                    .code(400)
                    .message("Error deleting course: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{sellerId}/courses/managed") 
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<List<CourseSummaryDTO>>> getSellerCoursesManaged(
            @PathVariable Integer sellerId) {
        try {
            List<CourseSummaryDTO> courses = sellerService.getSellerCourses(sellerId);
            return ResponseEntity.ok(ApiResponse.<List<CourseSummaryDTO>>builder()
                    .code(200)
                    .message("Success")
                    .result(courses)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching seller courses: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<CourseSummaryDTO>>builder()
                    .code(400)
                    .message("Error fetching courses: " + e.getMessage())
                    .build());
        }
    }

    // ===== SELLER STATISTICS APIs =====

    @GetMapping("/{sellerId}/stats")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<SellerStatsResponseDTO>> getSellerStats(
            @PathVariable Integer sellerId) {
        try {
            SellerStatsResponseDTO stats = sellerService.getSellerStats(sellerId);
            return ResponseEntity.ok(ApiResponse.<SellerStatsResponseDTO>builder()
                    .code(200)
                    .message("Success")
                    .result(stats)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching seller stats: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<SellerStatsResponseDTO>builder()
                    .code(400)
                    .message("Error fetching stats: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{sellerId}/revenue")
    @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<SellerRevenueResponseDTO>> getSellerRevenue(
            @PathVariable Integer sellerId) {
        try {
            SellerRevenueResponseDTO revenue = sellerService.getSellerRevenue(sellerId);
            return ResponseEntity.ok(ApiResponse.<SellerRevenueResponseDTO>builder()
                    .code(200)
                    .message("Success")
                    .result(revenue)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching seller revenue: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<SellerRevenueResponseDTO>builder()
                    .code(400)
                    .message("Error fetching revenue: " + e.getMessage())
                    .build());
        }
    }

    // ===== COURSE DETAILS MANAGEMENT APIs =====

    @PostMapping("/{sellerId}/courses/{courseId}/details")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<CourseDetail>> createCourseDetail(
            @PathVariable Integer sellerId,
            @PathVariable Integer courseId,
            @RequestBody CourseDetailCreateRequest request) {
        try {
            CourseDetail courseDetail = sellerService.createCourseDetail(sellerId, courseId, request);
            return ResponseEntity.ok(ApiResponse.<CourseDetail>builder()
                    .code(200)
                    .message("Course detail created successfully")
                    .result(courseDetail)
                    .build());
        } catch (Exception e) {
            log.error("Error creating course detail: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<CourseDetail>builder()
                    .code(400)
                    .message("Error creating course detail: " + e.getMessage())
                    .build());
        }
    }

    @PutMapping("/{sellerId}/courses/{courseId}/details/{detailId}")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<CourseDetail>> updateCourseDetail(
            @PathVariable Integer sellerId,
            @PathVariable Integer courseId,
            @PathVariable Integer detailId,
            @RequestBody CourseDetailUpdateRequest request) {
        try {
            CourseDetail courseDetail = sellerService.updateCourseDetail(sellerId, courseId, detailId, request);
            return ResponseEntity.ok(ApiResponse.<CourseDetail>builder()
                    .code(200)
                    .message("Course detail updated successfully")
                    .result(courseDetail)
                    .build());
        } catch (Exception e) {
            log.error("Error updating course detail: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<CourseDetail>builder()
                    .code(400)
                    .message("Error updating course detail: " + e.getMessage())
                    .build());
        }
    }

    @DeleteMapping("/{sellerId}/courses/{courseId}/details/{detailId}")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCourseDetail(
            @PathVariable Integer sellerId,
            @PathVariable Integer courseId,
            @PathVariable Integer detailId) {
        try {
            sellerService.deleteCourseDetail(sellerId, courseId, detailId);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .code(200)
                    .message("Course detail deleted successfully")
                    .build());
        } catch (Exception e) {
            log.error("Error deleting course detail: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                    .code(400)
                    .message("Error deleting course detail: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{sellerId}/courses/{courseId}/details")
    // @PreAuthorize("hasAuthority('SCOPE_SELLER') or hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<List<CourseDetail>>> getCourseDetails(
            @PathVariable Integer sellerId,
            @PathVariable Integer courseId) {
        try {
            List<CourseDetail> courseDetails = sellerService.getCourseDetails(sellerId, courseId);
            return ResponseEntity.ok(ApiResponse.<List<CourseDetail>>builder()
                    .code(200)
                    .message("Success")
                    .result(courseDetails)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching course details: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<CourseDetail>>builder()
                    .code(400)
                    .message("Error fetching course details: " + e.getMessage())
                    .build());
        }
    }

    // Debug endpoint to check JWT authorities - PUBLIC ACCESS
    @GetMapping("/debug/auth")
    public ResponseEntity<?> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok().body(Map.of(
            "principal", auth.getPrincipal(),
            "authorities", auth.getAuthorities(),
            "name", auth.getName(),
            "authenticated", auth.isAuthenticated()
        ));
    }

}
