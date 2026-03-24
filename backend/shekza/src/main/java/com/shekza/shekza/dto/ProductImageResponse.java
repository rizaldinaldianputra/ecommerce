package com.shekza.shekza.dto;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductImageResponse {
    private Long id;
    private Long productId;
    private Long variantId;
    private String url;
    private Integer sortOrder;
    private LocalDateTime createdAt;
}
