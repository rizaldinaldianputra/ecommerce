package com.shekza.shekza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductVariantRequest {
    private Long id;

    @NotBlank(message = "SKU is required")
    private String sku;

    private String size;
    private String color;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private BigDecimal discountPrice;
    private BigDecimal costPrice;
    private String barcode;
    private Integer stock;
    private Boolean isActive;
    private String imageUrl;
}
