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
public class StockTransactionResponse {
    private Long id;
    private Long variantId;
    private String sku;
    private String productName;
    private Long productId;
    private Integer quantity;
    private String type;
    private String notes;
    private String createdBy;
    private LocalDateTime createdAt;
}
