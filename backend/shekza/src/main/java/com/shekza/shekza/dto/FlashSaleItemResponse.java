package com.shekza.shekza.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class FlashSaleItemResponse {
    private Long id;
    private Long variantId;
    private String variantSku;
    private String productName;
    private BigDecimal originalPrice;
    private BigDecimal discountPrice;
    private Integer flashStock;
    private Integer soldCount;
}
