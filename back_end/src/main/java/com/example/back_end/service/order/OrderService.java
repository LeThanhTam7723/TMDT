package com.example.back_end.service.order;

import com.example.back_end.entity.Course;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.OrderRepository;
import com.example.back_end.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    @Override
    public void addOrder(Integer idCourse) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Course course = courseRepository.findById(idCourse)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        Order newOne = new Order();
        newOne.setIdUser(user);
        newOne.setIdCourse(course);
        orderRepository.save(newOne);
    }

    @Override
    public List<Order> getStudentOrder() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return orderRepository.getOrdersByIdUser(user);
    }
}
