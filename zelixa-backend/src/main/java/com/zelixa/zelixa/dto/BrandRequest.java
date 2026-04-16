package com.zelixa.zelixa.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class BrandRequest {
    @NotBlank(message = "Brand name is required")
    private String name;
    private String slug;
    private String logoUrl;
    private String description;
    private Boolean isActive;
}
