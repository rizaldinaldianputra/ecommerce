package com.shekza.shekza.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;
    private String shortDescription;
    private Long categoryId;
    private Long brandId;
    private String gender;
    private String material;
    private Integer weight;
    private Boolean isActive;
    private Boolean isFeatured;

    // Simplified fields for admin form
    private BigDecimal price;
    private Integer qty;
    private String imageUrl;
    private java.util.List<ProductVariantRequest> variants;
    private java.util.List<String> images;
}
