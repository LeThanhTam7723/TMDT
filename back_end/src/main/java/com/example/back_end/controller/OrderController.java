package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.CategoryOrderStatsDTO;
import com.example.back_end.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/category-stats")
    public ApiResponse<List<CategoryOrderStatsDTO>> getOrderStatsByCategory() {
        List<CategoryOrderStatsDTO> stats = orderService.getCategoryOrderStats();
        return ApiResponse.<List<CategoryOrderStatsDTO>>builder()
                .code(200)
                .message("Success")
                .result(stats)
                .build();
    }
}