package com.example.back_end.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentEnrollmentResponseDTO {
    private Integer id;
    private Integer userId;
    private String studentName;
    private String studentEmail;
    private String studentAvatar;
    private Integer courseId;
    private String courseName;
    private Double coursePrice;
    private LocalDate enrollmentDate;
    private String enrollmentStatus; // "active", "completed", "paused"
    private Integer daysSinceEnrollment;
    private Boolean isFullyUnlocked; // true if 3+ days have passed
    private String studentPhone;
    private String studentGender;
} 