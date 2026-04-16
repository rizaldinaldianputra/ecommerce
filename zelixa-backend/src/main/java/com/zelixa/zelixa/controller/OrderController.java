package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.entity.Order;
import com.zelixa.zelixa.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final com.zelixa.zelixa.repository.UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<com.zelixa.zelixa.dto.OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.mapToResponseList(orderService.getAllOrders()));
    }

    @GetMapping("/my")
    public ResponseEntity<com.zelixa.zelixa.dto.ApiResponse<List<com.zelixa.zelixa.dto.OrderResponse>>> getMyOrders(@org.springframework.security.core.annotation.AuthenticationPrincipal com.zelixa.zelixa.security.CustomUserDetails userDetails) {
        return ResponseEntity.ok(com.zelixa.zelixa.dto.ApiResponse.success("Orders fetched successfully", 
                orderService.mapToResponseList(orderService.getOrdersByUserId(userDetails.getId()))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.zelixa.zelixa.dto.ApiResponse<com.zelixa.zelixa.dto.OrderResponse>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(com.zelixa.zelixa.dto.ApiResponse.success("Order fetched successfully", 
                orderService.mapToResponse(orderService.getOrderById(id))));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<com.zelixa.zelixa.dto.ApiResponse<com.zelixa.zelixa.dto.OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(com.zelixa.zelixa.dto.ApiResponse.success("Order fetched successfully", 
                orderService.mapToResponse(orderService.getOrderByOrderNumber(orderNumber))));
    }

    @PostMapping
    public ResponseEntity<com.zelixa.zelixa.dto.ApiResponse<com.zelixa.zelixa.dto.OrderResponse>> createOrder(@RequestBody com.zelixa.zelixa.entity.Order order) {
        return ResponseEntity.ok(com.zelixa.zelixa.dto.ApiResponse.success("Order created successfully", 
                orderService.mapToResponse(orderService.createOrder(order))));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<com.zelixa.zelixa.dto.OrderResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(orderService.mapToResponse(orderService.updateOrderStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
}
