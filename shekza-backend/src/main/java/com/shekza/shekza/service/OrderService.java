package com.shekza.shekza.service;

import com.shekza.shekza.entity.Order;
import com.shekza.shekza.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderWorkflowService workflowService;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order createOrder(Order order) {
        // Generate a simple order number if not provided
        if (order.getOrderNumber() == null) {
            order.setOrderNumber("ORD-" + System.currentTimeMillis());
        }
        Order saved = orderRepository.save(order);
        // Start workflow
        String username = SecurityContextHolder.getContext().getAuthentication() != null 
                ? SecurityContextHolder.getContext().getAuthentication().getName() 
                : "guest";
        workflowService.startOrderProcess(saved, username);
        return saved;
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order updateTrackingNumber(Long id, String trackingNumber) {
        Order order = getOrderById(id);
        order.setTrackingNumber(trackingNumber);
        order.setStatus("DELIVERING");
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
