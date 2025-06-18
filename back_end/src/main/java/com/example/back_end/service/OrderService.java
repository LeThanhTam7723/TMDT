package com.example.back_end.service;

import com.example.back_end.dto.response.CategoryOrderStatsDTO;

import java.util.List;

public interface OrderService {
    List<CategoryOrderStatsDTO> getCategoryOrderStats();
}