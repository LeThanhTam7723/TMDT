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
    private Boolean hasAccess; // Quyền truy cập của user hiện tại cho episode này
    private Boolean isPurchased; // User đã mua khóa học chưa
    private Boolean isFullyUnlocked; // Khóa học đã được mở khóa hoàn toàn sau 3 ngày chưa
} 