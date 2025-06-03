package com.example.back_end.dto;

import lombok.Data;
import java.util.List;

@Data
public class CourseDto {
    private Integer id;
    private String name;
    private Double price;
    private Integer sellerId;
    private Integer categoryId;
    private String description;
    private Double rating;
    private Boolean status;
    private List<CourseDetailDto> courseDetails;
}
