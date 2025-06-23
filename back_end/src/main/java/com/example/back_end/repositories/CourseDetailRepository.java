package com.example.back_end.repositories;

import com.example.back_end.entity.CourseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseDetailRepository extends JpaRepository<CourseDetail, Integer> {
    List<CourseDetail> findByCourse_Id(Integer courseId);
    
    // Tìm course details theo courseId và sắp xếp theo episodeNumber
    List<CourseDetail> findByCourse_IdOrderByEpisodeNumberAsc(Integer courseId);
    
    // Đếm số episode của một course
    @Query("SELECT COUNT(cd) FROM CourseDetail cd WHERE cd.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Integer courseId);
    
    // Tính tổng duration của một course
    @Query("SELECT COALESCE(SUM(cd.duration), 0) FROM CourseDetail cd WHERE cd.course.id = :courseId")
    Long sumDurationByCourseId(@Param("courseId") Integer courseId);
    
    // Kiểm tra episode number đã tồn tại chưa
    boolean existsByCourse_IdAndEpisodeNumber(Integer courseId, Integer episodeNumber);
}
