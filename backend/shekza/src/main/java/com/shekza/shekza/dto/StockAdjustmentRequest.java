package com.shekza.shekza.dto;

import lombok.Data;

@Data
public class StockAdjustmentRequest {
    private Long variantId;
    private Integer quantity;
    private String type; // ADD, SUBTRACT, SET
    private String reason;
}
