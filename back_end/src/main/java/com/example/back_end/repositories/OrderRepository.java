package com.example.back_end.repositories;

import com.example.back_end.entity.Order;
import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> getOrdersByIdUser(User user);
    List<Order> findAll();
    
    @Query("SELECT o FROM Order o WHERE o.idCourse.sellerId = :sellerId")
    List<Order> findBySellerIdThroughCourses(@Param("sellerId") Integer sellerId);

    boolean existsByIdUser_IdAndIdCourse_Id(Integer userId, Integer courseId);
}
