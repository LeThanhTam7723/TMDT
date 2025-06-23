package com.example.back_end.dto.request;

import lombok.Data;

@Data
public class CourseDetailCreateRequest {
    private String name;
    private Integer episodeNumber;
    private String link;
    private Integer duration; // in minutes
    private Boolean isPreview = false;
} 