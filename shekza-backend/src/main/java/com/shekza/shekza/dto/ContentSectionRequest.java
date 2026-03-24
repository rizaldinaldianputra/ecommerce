package com.shekza.shekza.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentSectionRequest {
    private String title;
    private String type; // CAROUSEL, GRID, BANNER, NEWS
    private Integer displayOrder;
    private Boolean isActive;
    private List<ContentItemRequest> items;
}
