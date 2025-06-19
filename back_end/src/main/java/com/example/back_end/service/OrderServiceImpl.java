package com.example.back_end.service;

import com.example.back_end.dto.response.CategoryOrderStatsDTO;

import com.example.back_end.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<CategoryOrderStatsDTO> getCategoryOrderStats() {
        return orderRepository.getOrderStatsByCategory();
    }
}