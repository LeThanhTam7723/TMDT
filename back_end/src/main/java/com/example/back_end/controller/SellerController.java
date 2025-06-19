package com.example.back_end.controller;

import com.example.back_end.dto.CourseSummaryDTO;
import com.example.back_end.dto.SellerDTO;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.User;


import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/seller")
@RequiredArgsConstructor
public class SellerController {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getSellerByCourseId(@PathVariable Integer courseId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Course not found");
        }

        Course course = courseOpt.get();
        Integer sellerId = course.getSellerId();

        Optional<User> userOpt = userRepository.findById(sellerId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Seller not found");
        }

        User seller = userOpt.get();

        SellerDTO sellerDTO = SellerDTO.builder()
                .id(seller.getId())
                .fullname(seller.getFullname())
                .email(seller.getEmail())
                .phone(seller.getPhone())
                .avatar(seller.getAvatar())
                .introduce(seller.getIntroduce())
                .certificate(seller.getCertificate())
                .gender(seller.getGender())
                .build();

        return ResponseEntity.ok(sellerDTO);
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

}
