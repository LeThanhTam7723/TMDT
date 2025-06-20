package com.example.back_end.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReportResponseDTO {
    private Long id;
    private String subject;
    private String detail;
    private String category;
    private String priority;
    private String status;
    private LocalDateTime date;

    private String userFullName;
    private String userEmail;

    private String courseName;
}
