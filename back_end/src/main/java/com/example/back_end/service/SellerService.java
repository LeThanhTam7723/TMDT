package com.example.back_end.service;

import com.example.back_end.dto.CourseSummaryDTO;
import com.example.back_end.dto.request.CourseCreateRequest;
import com.example.back_end.dto.request.CourseDetailCreateRequest;
import com.example.back_end.dto.request.CourseDetailUpdateRequest;
import com.example.back_end.dto.request.CourseUpdateRequest;
import com.example.back_end.dto.response.SellerRevenueResponseDTO;
import com.example.back_end.dto.response.SellerStatsResponseDTO;
import com.example.back_end.dto.response.StudentEnrollmentResponseDTO;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.CourseDetail;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.User;
import com.example.back_end.repositories.CourseDetailRepository;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerService {
    
    private final CourseRepository courseRepository;
    private final CourseDetailRepository courseDetailRepository;
    private final OrderRepository orderRepository;

    public Course createCourse(Integer sellerId, CourseCreateRequest request) {
        // Log request for debugging
        System.out.println("🔍 Creating course for seller: " + sellerId);
        System.out.println("🔍 Request data: " + request);
        
        Course course = Course.builder()
                .name(request.getName())
                .price(request.getPrice() != null ? request.getPrice() : 0.0)
                .sellerId(sellerId)
                .categoryId(request.getCategoryId() != null ? request.getCategoryId() : 1)
                .description(request.getDescription() != null ? request.getDescription() : "")
                .rating(0.0)
                .status(false) // Pending approval
                .build();
        
        try {
            Course savedCourse = courseRepository.save(course);
            System.out.println("✅ Course created successfully with ID: " + savedCourse.getId());
            return savedCourse;
        } catch (Exception e) {
            System.err.println("❌ Error saving course: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create course: " + e.getMessage());
        }
    }

    public Course updateCourse(Integer sellerId, Integer courseId, CourseUpdateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: You can only update your own courses");
        }

        course.setName(request.getName());
        course.setPrice(request.getPrice());
        course.setCategoryId(request.getCategoryId());
        course.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            course.setStatus(request.getStatus());
        }
        
        return courseRepository.save(course);
    }

    public void deleteCourse(Integer sellerId, Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own courses");
        }
        
        courseRepository.delete(course);
    }

    public List<CourseSummaryDTO> getSellerCourses(Integer sellerId) {
        List<Course> courses = courseRepository.findBySellerId(sellerId);
        
        return courses.stream().map(course -> {
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
                    .status(course.getStatus()) // Thêm trạng thái duyệt
                    .build();
        }).collect(Collectors.toList());
    }

    public SellerStatsResponseDTO getSellerStats(Integer sellerId) {
        List<Course> courses = courseRepository.findBySellerId(sellerId);
        List<Order> orders = orderRepository.findBySellerIdThroughCourses(sellerId);
        
        int totalCourses = courses.size();
        int activeCourses = (int) courses.stream().filter(Course::getStatus).count();
        int pendingCourses = totalCourses - activeCourses;
        
        // Calculate total students (unique users who ordered)
        int totalStudents = (int) orders.stream()
                .map(order -> order.getIdUser().getId())
                .distinct()
                .count();
        
        // Calculate total revenue
        double totalRevenue = orders.stream()
                .mapToDouble(order -> {
                    Course course = order.getIdCourse();
                    return course != null ? course.getPrice() : 0.0;
                })
                .sum();
        
        // Calculate average rating
        double averageRating = courses.stream()
                .filter(course -> course.getRating() != null && course.getRating() > 0)
                .mapToDouble(Course::getRating)
                .average()
                .orElse(0.0);
        
        return SellerStatsResponseDTO.builder()
                .totalCourses(totalCourses)
                .activeCourses(activeCourses)
                .pendingCourses(pendingCourses)
                .totalStudents(totalStudents)
                .totalRevenue(totalRevenue)
                .averageRating(averageRating)
                .totalOrders(orders.size())
                .build();
    }

    public SellerRevenueResponseDTO getSellerRevenue(Integer sellerId) {
        List<Order> orders = orderRepository.findBySellerIdThroughCourses(sellerId);
        
        // Calculate total revenue
        double totalRevenue = orders.stream()
                .mapToDouble(order -> {
                    Course course = order.getIdCourse();
                    return course != null ? course.getPrice() : 0.0;
                })
                .sum();
        
        // Calculate current month revenue
        LocalDate now = LocalDate.now();
        double monthlyRevenue = orders.stream()
                .filter(order -> {
                    if (order.getDateOrder() == null) return false;
                    LocalDate orderDate = order.getDateOrder();
                    return orderDate.getYear() == now.getYear() && 
                           orderDate.getMonth() == now.getMonth();
                })
                .mapToDouble(order -> {
                    Course course = order.getIdCourse();
                    return course != null ? course.getPrice() : 0.0;
                })
                .sum();
        
        // Group by month for chart data
        Map<String, List<Order>> ordersByMonth = orders.stream()
                .filter(order -> order.getDateOrder() != null)
                .collect(Collectors.groupingBy(order -> 
                    order.getDateOrder().format(DateTimeFormatter.ofPattern("yyyy-MM"))));
        
        List<SellerRevenueResponseDTO.MonthlyRevenueData> monthlyData = new ArrayList<>();
        ordersByMonth.forEach((month, monthOrders) -> {
            double monthRevenue = monthOrders.stream()
                    .mapToDouble(order -> {
                        Course course = order.getIdCourse();
                        return course != null ? course.getPrice() : 0.0;
                    })
                    .sum();
            
            monthlyData.add(SellerRevenueResponseDTO.MonthlyRevenueData.builder()
                    .month(month)
                    .revenue(monthRevenue)
                    .orders(monthOrders.size())
                    .build());
        });
        
        return SellerRevenueResponseDTO.builder()
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .monthlyData(monthlyData)
                .build();
    }

    public List<StudentEnrollmentResponseDTO> getSellerStudents(Integer sellerId) {
        List<Order> orders = orderRepository.findBySellerIdThroughCourses(sellerId);
        
        return orders.stream().map(order -> {
            User student = order.getIdUser();
            Course course = order.getIdCourse();
            LocalDate enrollmentDate = order.getDateOrder();
            
            // Calculate days since enrollment
            int daysSinceEnrollment = enrollmentDate != null 
                ? (int) ChronoUnit.DAYS.between(enrollmentDate, LocalDate.now())
                : 0;
            
            // Check if fully unlocked (3+ days)
            boolean isFullyUnlocked = daysSinceEnrollment >= 3;
            
            // Determine enrollment status
            String enrollmentStatus;
            if (daysSinceEnrollment < 3) {
                enrollmentStatus = "active"; // Still in preview period
            } else if (daysSinceEnrollment > 90) {
                enrollmentStatus = "completed"; // Consider completed after 90 days
            } else {
                enrollmentStatus = "active"; // Actively learning
            }
            
            return StudentEnrollmentResponseDTO.builder()
                    .id(order.getId())
                    .userId(student.getId())
                    .studentName(student.getFullname() != null ? student.getFullname() : "Unknown")
                    .studentEmail(student.getEmail())
                    .studentAvatar(student.getAvatar())
                    .studentPhone(student.getPhone())
                    .studentGender(student.getGender())
                    .courseId(course.getId())
                    .courseName(course.getName())
                    .coursePrice(course.getPrice())
                    .enrollmentDate(enrollmentDate)
                    .enrollmentStatus(enrollmentStatus)
                    .daysSinceEnrollment(daysSinceEnrollment)
                    .isFullyUnlocked(isFullyUnlocked)
                    .build();
        }).collect(Collectors.toList());
    }
    
    // ===== COURSE DETAILS MANAGEMENT =====
    
    public CourseDetail createCourseDetail(Integer sellerId, Integer courseId, CourseDetailCreateRequest request) {
        // Verify course exists and belongs to seller
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: You can only manage your own courses");
        }
        
        // Auto-generate episode number if not provided
        Integer episodeNumber = request.getEpisodeNumber();
        if (episodeNumber == null) {
            // Get next episode number
            Long maxEpisode = courseDetailRepository.countByCourseId(courseId);
            episodeNumber = maxEpisode.intValue() + 1;
        }
        
        // Check if episode number already exists
        if (courseDetailRepository.existsByCourse_IdAndEpisodeNumber(courseId, episodeNumber)) {
            throw new RuntimeException("Episode number " + episodeNumber + " already exists for this course");
        }
        
        CourseDetail courseDetail = CourseDetail.builder()
                .course(course)
                .name(request.getName())
                .episodeNumber(episodeNumber)
                .link(request.getLink())
                .duration(request.getDuration())
                .isPreview(request.getIsPreview() != null ? request.getIsPreview() : false)
                .build();
        
        return courseDetailRepository.save(courseDetail);
    }
    
    public CourseDetail updateCourseDetail(Integer sellerId, Integer courseId, Integer detailId, CourseDetailUpdateRequest request) {
        // Verify course exists and belongs to seller
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: You can only manage your own courses");
        }
        
        CourseDetail courseDetail = courseDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Course detail not found"));
        
        if (!courseDetail.getCourseId().equals(courseId)) {
            throw new RuntimeException("Course detail does not belong to this course");
        }
        
        // Check episode number conflict if changing
        if (request.getEpisodeNumber() != null && 
            !request.getEpisodeNumber().equals(courseDetail.getEpisodeNumber()) &&
            courseDetailRepository.existsByCourse_IdAndEpisodeNumber(courseId, request.getEpisodeNumber())) {
            throw new RuntimeException("Episode number " + request.getEpisodeNumber() + " already exists for this course");
        }
        
        // Update fields
        if (request.getName() != null) courseDetail.setName(request.getName());
        if (request.getEpisodeNumber() != null) courseDetail.setEpisodeNumber(request.getEpisodeNumber());
        if (request.getLink() != null) courseDetail.setLink(request.getLink());
        if (request.getDuration() != null) courseDetail.setDuration(request.getDuration());
        if (request.getIsPreview() != null) courseDetail.setIsPreview(request.getIsPreview());
        
        return courseDetailRepository.save(courseDetail);
    }
    
    public void deleteCourseDetail(Integer sellerId, Integer courseId, Integer detailId) {
        // Verify course exists and belongs to seller
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: You can only manage your own courses");
        }
        
        CourseDetail courseDetail = courseDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Course detail not found"));
        
        if (!courseDetail.getCourseId().equals(courseId)) {
            throw new RuntimeException("Course detail does not belong to this course");
        }
        
        courseDetailRepository.delete(courseDetail);
    }
    
    public List<CourseDetail> getCourseDetails(Integer sellerId, Integer courseId) {
        // Verify course exists and belongs to seller
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: You can only manage your own courses");
        }
        
        return courseDetailRepository.findByCourse_IdOrderByEpisodeNumberAsc(courseId);
    }
} 