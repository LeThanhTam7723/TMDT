package com.example.back_end.service;

import com.example.back_end.dto.CourseSummaryDTO;
import com.example.back_end.dto.request.CourseCreateRequest;
import com.example.back_end.dto.request.CourseUpdateRequest;
import com.example.back_end.dto.response.SellerRevenueResponseDTO;
import com.example.back_end.dto.response.SellerStatsResponseDTO;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.Order;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerService {
    
    private final CourseRepository courseRepository;
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
} 