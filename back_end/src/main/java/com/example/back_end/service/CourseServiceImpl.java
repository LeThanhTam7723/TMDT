package com.example.back_end.service;

import com.example.back_end.dto.response.CourseDetailResponseDTO;
import com.example.back_end.dto.response.CourseListResponseDTO;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.CourseDetail;
import com.example.back_end.entity.User;
import com.example.back_end.repositories.CourseDetailRepository;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseDetailRepository courseDetailRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CourseListResponseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
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

    private String getCategoryName(Integer categoryId) {
        // TODO: Implement category name lookup
        return "Category " + categoryId;
    }
}
