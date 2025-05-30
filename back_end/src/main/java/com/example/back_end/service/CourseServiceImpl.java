package com.example.back_end.service;

import com.example.back_end.entity.Course;


import com.example.back_end.entity.CourseDetail;
import com.example.back_end.repositories.CourseDetailRepository;
import com.example.back_end.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl  {

    @Autowired
    private CourseRepository courseRepository;


    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }


    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }
    @Autowired
    private CourseDetailRepository courseDetailRepository;

    public List<CourseDetail> getCourseDetailsByCourseId(Long courseId) {
        return courseDetailRepository.findByCourseId(courseId);
    }



}
