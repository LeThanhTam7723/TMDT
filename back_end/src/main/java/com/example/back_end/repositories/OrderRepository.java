package com.example.back_end.repositories;

import com.example.back_end.entity.Order;
import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> getOrdersByIdUser(User user);
    List<Order> findAll();
    
    @Query("SELECT o FROM Order o WHERE o.idCourse.sellerId = :sellerId")
    List<Order> findBySellerIdThroughCourses(@Param("sellerId") Integer sellerId);

    boolean existsByIdUser_IdAndIdCourse_Id(Integer userId, Integer courseId);
    
    // Lấy ngày mua khóa học theo userId và courseId
    @Query("SELECT o.dateOrder FROM Order o WHERE o.idUser.id = :userId AND o.idCourse.id = :courseId")
    Optional<LocalDate> findPurchaseDateByUserIdAndCourseId(@Param("userId") Integer userId, @Param("courseId") Integer courseId);
}
