package com.zelixa.zelixa.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductImageRequest {
    private Long variantId;

    @NotBlank(message = "Image URL is required")
    private String url;

    private Integer sortOrder;
}
