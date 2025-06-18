package com.example.back_end.service;


import com.example.back_end.dto.request.ReportRequestDTO;
import com.example.back_end.dto.response.ReportResponseDTO;
import com.example.back_end.dto.response.UserResponse;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.Report;
import com.example.back_end.entity.User;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.ReportRepository;
import com.example.back_end.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final UserService userService;

    public ReportResponseDTO createReport(ReportRequestDTO dto) {
        // Lấy email từ token
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        System.out.println("🧩 Email from token: " + email);

        // Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found by email: " + email));

        Course course = courseRepository.findById(dto.getCourseId().intValue())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Report report = new Report();
        report.setUser(user);
        report.setCourse(course);
        report.setSubject(dto.getSubject());
        report.setDetail(dto.getDetail());
        report.setCategory(dto.getCategory());
        report.setPriority(dto.getPriority());
        report.setStatus("pending");
        report.setDate(LocalDateTime.now());

        reportRepository.save(report);

        return ReportResponseDTO.builder()
                .id(report.getId())
                .subject(report.getSubject())
                .detail(report.getDetail())
                .status(report.getStatus())
                .priority(report.getPriority())
                .category(report.getCategory())
                .date(report.getDate())
                .userFullName(user.getFullname())
                .userEmail(user.getEmail())
                .courseName(course.getName())
                .build();
    }

    public List<ReportResponseDTO> getAllReports() {
        List<Report> reports = reportRepository.findAll();

        return reports.stream().map(report -> {
            User user = report.getUser();
            Course course = report.getCourse();

            return ReportResponseDTO.builder()
                    .id(report.getId())
                    .subject(report.getSubject())
                    .detail(report.getDetail())
                    .category(report.getCategory())
                    .priority(report.getPriority())
                    .status(report.getStatus())
                    .date(report.getDate())
                    .userFullName(user.getFullname())
                    .userEmail(user.getEmail())
                    .courseName(course != null ? course.getName() : null)
                    .build();
        }).collect(Collectors.toList());
    }
}
