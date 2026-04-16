package com.zelixa.zelixa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockSummaryResponse {
    private Long variantId;
    private String sku;
    private String productName;
    private Integer currentStock;
    private Long totalIn;
    private Long totalOut;
}
