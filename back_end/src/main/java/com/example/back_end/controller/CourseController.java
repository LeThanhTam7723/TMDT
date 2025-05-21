package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Course;

import com.example.back_end.entity.CourseDetail;
import com.example.back_end.service.CourseServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseServiceImpl courseService;

    @GetMapping
    public ApiResponse<List<Course>> getAllCourses() {
        return ApiResponse.<List<Course>>builder()
                .code(200)
                .message("Fetched all courses successfully.")
                .result(courseService.getAllCourses())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        if (course == null) {
            return ApiResponse.<Course>builder()
                    .code(404)
                    .message("Course not found")
                    .build();
        }
        return ApiResponse.<Course>builder()
                .code(200)
                .message("Course found")
                .result(course)
                .build();
    }
    @GetMapping("/{id}/details")
    public ApiResponse<List<CourseDetail>> getCourseDetailsByCourseId(@PathVariable Long id) {
        List<CourseDetail> details = courseService.getCourseDetailsByCourseId(id);
        if (details == null) {
            return ApiResponse.<List<CourseDetail>>builder()
                    .code(404)
                    .message("Course not found")
                    .build();
        }

        return ApiResponse.<List<CourseDetail>>builder()
                .code(200)
                .message("Fetched course details successfully.")
                .result(details)
                .build();
    }

}
