package com.example.back_end.service;

import com.example.back_end.dto.response.CourseListResponseDTO;
import com.example.back_end.dto.response.FavoriteResponseDTO;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.Favorite;
import com.example.back_end.entity.User;
import com.example.back_end.repository.FavoriteRepository;
import com.example.back_end.repositories.UserRepository;
import com.example.back_end.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    private final UserRepository userRepository;

    private final CourseRepository courseRepository;

    public List<FavoriteResponseDTO> getUserFavorites(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Favorite> favorites = favoriteRepository.findByIdUser(user);
        return favorites.stream()
                .map(favorite -> FavoriteResponseDTO.builder()
                        .id(favorite.getId())
                        .idUser(favorite.getIdUser().getId())
                        .idCourse(favorite.getIdCourse().getId())
                        .build())
                .collect(Collectors.toList());
    }

    public FavoriteResponseDTO addToFavorites(Integer userId, Integer courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Favorite favorite = Favorite.builder()
                .idUser(user)
                .idCourse(course)
                .build();
        Favorite savedFavorite = favoriteRepository.save(favorite);
        return FavoriteResponseDTO.builder()
                .id(savedFavorite.getId())
                .idUser(savedFavorite.getIdUser().getId())
                .idCourse(savedFavorite.getIdCourse().getId())
                .build();
    }

    public void removeFromFavorites(Integer userId, Integer courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        favoriteRepository.deleteByIdUserAndIdCourse(user, course);
    }

    private CourseListResponseDTO mapCourseToDTO(Course course) {
        return CourseListResponseDTO.builder()
                .id(course.getId())
                .name(course.getName())
                .price(course.getPrice())
                .sellerId(course.getSellerId())
                .categoryId(course.getCategoryId())
                .description(course.getDescription())
                .rating(course.getRating())
                .status(course.getStatus())
                .build();
    }
} 