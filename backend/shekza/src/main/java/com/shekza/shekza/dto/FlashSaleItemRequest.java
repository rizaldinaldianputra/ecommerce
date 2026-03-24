package com.shekza.shekza.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FlashSaleItemRequest {
    private Long variantId;
    private BigDecimal discountPrice;
    private Integer flashStock;
}
