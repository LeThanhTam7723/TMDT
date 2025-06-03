package com.example.back_end.service.favourite;

import com.example.back_end.dto.CourseDto;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.Favorite;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.FavoriteRepository;
import com.example.back_end.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteService implements IFavoriteService{
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Override
    public ApiResponse<Course> addFavorite(int userId, int courseId) {
        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (user == null || course == null) {
            return ApiResponse.<Course>builder()
                    .code(1)
                    .message("User hoặc khóa học không tồn tại.")
                    .build();
        } else {
            if (favoriteRepository.existsByIdUser_IdAndIdCourse_Id(userId, courseId)) {
                return ApiResponse.<Course>builder()
                        .code(1)
                        .message("Khóa học đã được thêm vào yêu thích trước đó")
                        .build();
            }
        }
        Favorite favorite = new Favorite();
        favorite.setIdUser(user);
        favorite.setIdCourse(course);
        favoriteRepository.save(favorite);
        return ApiResponse.<Course>builder()
                .result(course)
                .message("Thêm thành công vào danh sách yêu thích.")
                .build();
    }
    @Override
    public ApiResponse<Void> removeFavorite(int userId, int courseId) {
        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if (user == null || course == null) {
            return ApiResponse.<Void>builder()
                    .code(1)
                    .message("User hoặc Khóa học không tồn tại.")
                    .build();
        }
        if (!favoriteRepository.existsByIdUser_IdAndIdCourse_Id(userId, courseId)) {
            return ApiResponse.<Void>builder()
                    .code(1)
                    .message("Favorite không tồn tại.")
                    .build();
        }

        favoriteRepository.deleteByIdUser_IdAndIdCourse_Id(userId, courseId);
        System.out.println("xóa");
        return ApiResponse.<Void>builder()
                .code(1)
                .message("Xóa thành công product khỏi danh sách yêu thích.")
                .build();
    }

    @Override
    public List<Course> getFavoritesByUserId(int userId) {
        return null;
    }

    @Override
    public boolean isFavorite(int userId, int courseId) {
        return favoriteRepository.existsByIdUser_IdAndIdCourse_Id(userId,courseId);
    }
}
