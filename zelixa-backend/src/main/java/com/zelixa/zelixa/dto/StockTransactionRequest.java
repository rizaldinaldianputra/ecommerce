package com.zelixa.zelixa.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransactionRequest {
    private Long variantId;
    private Integer quantity;
    private String type; // ADDITION, ADJUSTMENT
    private String notes;
}
