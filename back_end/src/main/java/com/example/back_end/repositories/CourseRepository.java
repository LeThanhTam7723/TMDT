package com.example.back_end.repositories;

import com.example.back_end.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface CourseRepository extends JpaRepository<Course, Integer> {
    Optional<Course> findById(int CourseId);
    List<Course> findBySellerId(Integer sellerId);

}
