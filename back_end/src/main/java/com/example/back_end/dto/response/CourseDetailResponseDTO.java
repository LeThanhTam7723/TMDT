package com.example.back_end.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailResponseDTO {
    private Integer id;
    private Integer episodeNumber;
    private String link;
    private Integer duration;
    private Boolean isPreview;
} 