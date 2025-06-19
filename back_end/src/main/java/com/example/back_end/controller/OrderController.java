package com.example.back_end.controller;

import com.example.back_end.dto.request.OrderRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Order;
import com.example.back_end.service.order.IOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService iOrderService;

    @PostMapping("/add")
    public ApiResponse<Void> addOrder(@RequestBody OrderRequest request){
        iOrderService.addOrder(request.getOrderId());
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping("/invidual")
    public ApiResponse<List<Order>> getPersonalOrder(){
        List<Order> orders = iOrderService.getStudentOrder();
        return ApiResponse.<List<Order>>builder().result(orders).build();
    }
}
