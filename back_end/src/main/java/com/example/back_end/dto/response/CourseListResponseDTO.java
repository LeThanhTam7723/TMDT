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

    private LocalDate datePurchased;

} 