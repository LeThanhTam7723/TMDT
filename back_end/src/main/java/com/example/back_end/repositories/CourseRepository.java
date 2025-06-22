package com.example.back_end.repositories;

import com.example.back_end.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface CourseRepository extends JpaRepository<Course, Integer> {
    Optional<Course> findById(int CourseId);
    List<Course> findBySellerId(Integer sellerId);
    
    // Tìm kiếm theo tên khóa học
    List<Course> findByNameContainingIgnoreCase(String name);
    
    // Tìm kiếm theo mô tả
    List<Course> findByDescriptionContainingIgnoreCase(String description);
    
    // Tìm kiếm theo tên hoặc mô tả
    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Course> findByNameOrDescriptionContainingIgnoreCase(@Param("keyword") String keyword);
    
    // Tìm kiếm theo category
    List<Course> findByCategoryId(Integer categoryId);
    
    // Tìm kiếm theo khoảng giá
    List<Course> findByPriceBetween(Double minPrice, Double maxPrice);
    
    // Tìm kiếm theo rating tối thiểu
    List<Course> findByRatingGreaterThanEqual(Double minRating);
    
    // Tìm kiếm theo tên hoặc mô tả (method name query)
    List<Course> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    
    // Tìm kiếm theo category và status
    List<Course> findByCategoryIdAndStatusTrue(Integer categoryId);
    
    // Tìm kiếm theo khoảng giá và status
    List<Course> findByPriceBetweenAndStatusTrue(Double minPrice, Double maxPrice);
    
    // Tìm kiếm nâng cao với nhiều tiêu chí
    @Query("SELECT c FROM Course c WHERE " +
           "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR c.categoryId = :categoryId) AND " +
           "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR c.rating >= :minRating) AND " +
           "(:status IS NULL OR c.status = :status)")
    List<Course> searchCourses(@Param("keyword") String keyword,
                              @Param("categoryId") Integer categoryId,
                              @Param("minPrice") Double minPrice,
                              @Param("maxPrice") Double maxPrice,
                              @Param("minRating") Double minRating,
                              @Param("status") Boolean status);
    
    // Alias for advanced search to match service method name
    @Query("SELECT c FROM Course c WHERE " +
           "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR c.categoryId = :categoryId) AND " +
           "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR c.rating >= :minRating) AND " +
           "(:status IS NULL OR c.status = :status)")
    List<Course> findCoursesWithFilters(@Param("keyword") String keyword,
                                       @Param("categoryId") Integer categoryId,
                                       @Param("minPrice") Double minPrice,
                                       @Param("maxPrice") Double maxPrice,
                                       @Param("minRating") Double minRating,
                                       @Param("status") Boolean status);

}
