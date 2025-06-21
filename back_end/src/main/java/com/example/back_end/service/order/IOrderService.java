package com.example.back_end.service.order;

import com.example.back_end.dto.response.OrderResponse;
import com.example.back_end.entity.Order;

import java.util.List;

public interface IOrderService {
    void addOrder(Integer idCourse,Integer idUser);
    List<Order> getStudentOrder();
    List<OrderResponse> getAll();
}
