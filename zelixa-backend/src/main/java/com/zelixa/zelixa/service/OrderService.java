package com.zelixa.zelixa.service;

import com.zelixa.zelixa.entity.Order;
import com.zelixa.zelixa.entity.OrderItem;
import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.repository.CartItemRepository;
import com.zelixa.zelixa.repository.OrderRepository;
import com.zelixa.zelixa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderWorkflowService workflowService;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final CartItemRepository cartItemRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order createOrder(Order order) {
        if (order.getOrderNumber() == null) {
            order.setOrderNumber("ORD-" + System.currentTimeMillis());
        }
        order.setStatus("PENDING");
        Order saved = orderRepository.save(order);
        paymentService.createTransaction(saved);
        saved = orderRepository.save(saved);

        String username = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "guest";
        workflowService.startOrderProcess(saved, username);

        User user = userRepository.findById(saved.getUserId()).orElse(null);
        if (user != null) {
            notificationService.notifyUser(user, "Order Placed",
                "Your order " + saved.getOrderNumber() + " has been placed. Please complete the payment.",
                "ORDER", null);
        }
        return saved;
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        String oldStatus = order.getStatus();
        order.setStatus(status);
        Order saved = orderRepository.save(order);

        if (!status.equals(oldStatus)) {
            User user = userRepository.findById(saved.getUserId()).orElse(null);
            if (user != null) {
                notificationService.notifyUser(user, "Order Status Updated",
                    "Your order " + saved.getOrderNumber() + " is now " + status,
                    "ORDER", null);
            }
        }
        return saved;
    }

    public Order updateOrderStatusByNumber(String orderNumber, String status) {
        Order order = getOrderByOrderNumber(orderNumber);
        return updateOrderStatus(order.getId(), status);
    }

    public Order updateTrackingNumber(Long id, String trackingNumber) {
        Order order = getOrderById(id);
        order.setTrackingNumber(trackingNumber);
        order.setStatus("DELIVERING");
        return orderRepository.save(order);
    }

    @Transactional
    public com.zelixa.zelixa.dto.OrderResponse checkout(User user, com.zelixa.zelixa.dto.CheckoutRequest request) {
        // Ensure user is managed
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        List<com.zelixa.zelixa.dto.CartItemResponse> cartItems = cartService.getCart(managedUser);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Server error: Cart is empty for user " + user.getId());
        }

        double totalAmount = cartItems.stream()
                .mapToDouble(item -> (item.getDiscountPrice() != null
                        ? item.getDiscountPrice().doubleValue()
                        : item.getPrice().doubleValue()) * item.getQuantity())
                .sum();

        if (request.getShippingAmount() != null) {
            totalAmount += request.getShippingAmount();
        }

        Order order = Order.builder()
                .userId(user.getId())
                .orderNumber("ORD-" + System.currentTimeMillis())
                .totalAmount(totalAmount)
                .shippingAmount(request.getShippingAmount())
                .shippingService(request.getShippingService())
                .destinationSubdistrictId(request.getDestinationSubdistrictId())
                .status("PENDING")
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> OrderItem.builder()
                .order(savedOrder)
                .productId(cartItem.getProductId())
                .productName(cartItem.getProductName())
                .groupName(cartItem.getGroupName())
                .size(cartItem.getSize())
                .color(cartItem.getColor())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getDiscountPrice() != null
                        ? cartItem.getDiscountPrice().doubleValue()
                        : cartItem.getPrice().doubleValue())
                .build()).collect(Collectors.toList());

        savedOrder.setItems(orderItems);
        orderRepository.save(savedOrder);

        paymentService.createTransaction(savedOrder);
        workflowService.startOrderProcess(savedOrder, user.getEmail());
        cartService.clearCart(user);

        return mapToResponse(savedOrder);
    }

    public com.zelixa.zelixa.dto.OrderResponse mapToResponse(Order order) {
        // Automatically generate payment token if it's missing for a pending order
        if (order.getStatus().equalsIgnoreCase("PENDING") && 
            (order.getPaymentToken() == null || order.getPaymentToken().isEmpty())) {
            try {
                paymentService.createTransaction(order);
                if (order.getPaymentToken() != null) {
                    orderRepository.save(order);
                }
            } catch (Exception e) {
                // Log and continue, client will see null token and show warning
            }
        }

        return com.zelixa.zelixa.dto.OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .trackingNumber(order.getTrackingNumber())
                .paymentToken(order.getPaymentToken())
                .paymentUrl(order.getPaymentUrl())
                .shippingAmount(order.getShippingAmount())
                .shippingService(order.getShippingService())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(order.getItems() != null ? order.getItems().stream()
                        .map(item -> com.zelixa.zelixa.dto.OrderItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .groupName(item.getGroupName())
                                .size(item.getSize())
                                .color(item.getColor())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }

    public List<com.zelixa.zelixa.dto.OrderResponse> mapToResponseList(List<Order> orders) {
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
