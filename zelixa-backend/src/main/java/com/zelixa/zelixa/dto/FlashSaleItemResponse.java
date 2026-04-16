package com.zelixa.zelixa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long variantId;
    private String variantName;
    private BigDecimal discountPrice;
    private Integer stockLimit;
    private Integer soldCount;
}
