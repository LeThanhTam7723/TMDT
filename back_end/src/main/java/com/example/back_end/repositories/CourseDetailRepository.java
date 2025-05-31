package com.example.back_end.repositories;

import com.example.back_end.entity.CourseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseDetailRepository extends JpaRepository<CourseDetail, Long> {
    List<CourseDetail> findByCourseId(Long courseId);
}
