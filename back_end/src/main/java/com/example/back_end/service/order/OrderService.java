package com.example.back_end.service.order;

import com.example.back_end.dto.response.OrderResponse;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.OrderMapper;
import com.example.back_end.repositories.CourseRepository;
import com.example.back_end.repositories.OrderRepository;
import com.example.back_end.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    @Override
    public void addOrder(Integer idCourse,Integer idUser) {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Course course = courseRepository.findById(idCourse)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        Order newOne = new Order();
        newOne.setIdUser(user);
        newOne.setIdCourse(course);
        newOne.setDateOrder(LocalDate.now());
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

    @Override
    public List<OrderResponse> getAll() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse convertToResponse(Order order) {
        if (order == null) {
            return null;
        }

        return OrderResponse.builder()
                .id(order.getId())
                .idUser(order.getIdUser().getId())  // lấy ID từ User
                .idCourse(order.getIdCourse())      // có thể giữ nguyên nếu Course là entity bạn muốn trả ra
                .dateOrder(order.getDateOrder())
                .build();
    }


}
