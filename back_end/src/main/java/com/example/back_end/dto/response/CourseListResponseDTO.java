package com.example.back_end.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseListResponseDTO {
    private Integer id;
    private String name;
    private Double price;
    private Integer sellerId;
    private Integer categoryId;
    private String description;
    private Double rating;
    private Boolean status;
    private String sellerName;
    private String categoryName;
    private boolean isPurchased;
    private LocalDate purchaseDate;
    private boolean isFullyUnlocked; // Thêm trường để kiểm tra xem khóa học đã được mở khóa hoàn toàn sau 3 ngày chưa

    private LocalDate datePurchased;

} 