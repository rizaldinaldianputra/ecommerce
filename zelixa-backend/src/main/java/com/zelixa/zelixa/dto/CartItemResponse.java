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
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long productVariantId;
    private String size;
    private String color;
    private String groupName;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer quantity;
    private String imageUrl;
}
