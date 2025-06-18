package com.example.back_end.repositories;


import com.example.back_end.dto.response.CategoryOrderStatsDTO;
import com.example.back_end.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT new com.example.back_end.dto.response.CategoryOrderStatsDTO(c.categoryId, COUNT(o), SUM(o.price)) " +
            "FROM Order o JOIN Course c ON o.courseId = c.id " +
            "GROUP BY c.categoryId")
    List<CategoryOrderStatsDTO> getOrderStatsByCategory();
}