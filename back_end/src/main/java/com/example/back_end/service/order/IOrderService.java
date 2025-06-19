package com.example.back_end.service.order;

import com.example.back_end.entity.Order;

import java.util.List;

public interface IOrderService {
    void addOrder(Integer idCourse);
    List<Order> getStudentOrder();
}
