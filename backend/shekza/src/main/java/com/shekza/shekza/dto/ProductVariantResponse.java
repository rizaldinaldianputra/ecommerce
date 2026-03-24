package com.shekza.shekza.dto;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductVariantResponse {
    private Long id;
    private Long productId;
    private String sku;
    private String size;
    private String color;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal costPrice;
    private String barcode;
    private Integer stock;
    private Boolean isActive;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
