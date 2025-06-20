package com.example.back_end.dto.response;

import com.example.back_end.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Integer id;
    private Integer idUser;
    private Course idCourse;
    private LocalDate dateOrder;
}
