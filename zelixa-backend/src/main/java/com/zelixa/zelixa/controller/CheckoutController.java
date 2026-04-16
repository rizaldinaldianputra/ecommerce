package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ApiResponse;
import com.zelixa.zelixa.dto.CheckoutRequest;
import com.zelixa.zelixa.dto.OrderResponse;
import com.zelixa.zelixa.security.CustomUserDetails;
import com.zelixa.zelixa.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CheckoutController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CheckoutRequest request) {
        OrderResponse order = orderService.checkout(userDetails.getUser(), request);
        return ResponseEntity.ok(ApiResponse.success("Checkout successful", order));
    }
}
