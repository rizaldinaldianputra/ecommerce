package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ApiResponse;
import com.zelixa.zelixa.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/callbacks")
@RequiredArgsConstructor
@Slf4j
public class PaymentWebhookController {

    private final OrderService orderService;

    @PostMapping("/midtrans")
    public ResponseEntity<ApiResponse<String>> handleMidtransCallback(@RequestBody Map<String, Object> payload) {
        log.info("Received Midtrans Webhook: {}", payload);
        
        try {
            String orderId = payload.get("order_id").toString();
            String transactionStatus = payload.get("transaction_status").toString();
            String fraudStatus = payload.get("fraud_status") != null ? payload.get("fraud_status").toString() : "";

            if (transactionStatus.equals("capture")) {
                if (fraudStatus.equals("challenge")) {
                    orderService.updateOrderStatusByNumber(orderId, "CHALLENGE");
                } else if (fraudStatus.equals("accept")) {
                    orderService.updateOrderStatusByNumber(orderId, "PROCESSING");
                }
            } else if (transactionStatus.equals("settlement")) {
                orderService.updateOrderStatusByNumber(orderId, "PROCESSING");
            } else if (transactionStatus.equals("deny") || transactionStatus.equals("expire") || transactionStatus.equals("cancel")) {
                orderService.updateOrderStatusByNumber(orderId, "CANCELLED");
            } else if (transactionStatus.equals("pending")) {
                orderService.updateOrderStatusByNumber(orderId, "PENDING");
            } else {
                log.info("Unhandled transaction status: {} for order: {}", transactionStatus, orderId);
            }

            return ResponseEntity.ok(ApiResponse.success("Webhook processed", null));
        } catch (Exception e) {
            log.error("Error processing Midtrans webhook", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error(500, e.getMessage()));
        }
    }
}
