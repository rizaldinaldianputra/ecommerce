package com.shekza.shekza.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String shortDescription;
    private Long categoryId;
    private CategoryResponse category;
    private Long brandId;
    private String gender;
    private String material;
    private Integer weight;
    private Boolean isActive;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Simplified fields for admin form
    private BigDecimal price;
    private Integer qty;
    private String imageUrl;
    private java.util.List<ProductVariantResponse> variants;
    private java.util.List<String> images;
}
