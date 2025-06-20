package com.example.back_end.controller;

import com.example.back_end.dto.request.OrderRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.OrderResponse;
import com.example.back_end.entity.Order;
import com.example.back_end.service.order.IOrderService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/order")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService iOrderService;

    @GetMapping("/add")
    public ApiResponse<Void> addOrder(@RequestParam int orderId,@RequestParam int userId, HttpServletResponse response) throws IOException {
        iOrderService.addOrder(orderId,userId);
        response.sendRedirect("http://localhost:5173");
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping("/invidual")// lấy danh sách khóa học đã đăng ký của học viên
    public ApiResponse<List<Order>> getPersonalOrders(){
        List<Order> orders = iOrderService.getStudentOrder();
        return ApiResponse.<List<Order>>builder().result(orders).build();
    }
    @GetMapping("/all")// lấy danh sách khóa học đã đăng ký của học viên
    public ApiResponse<List<OrderResponse>> getAllOrders(){
        List<OrderResponse> orders = iOrderService.getAll();
        return ApiResponse.<List<OrderResponse>>builder().result(orders).build();
    }

}
