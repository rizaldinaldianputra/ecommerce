package com.zelixa.zelixa.dto;

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
    private String platform; // WEB, MOBILE, ALL
    private Integer displayOrder;
    private Boolean isActive;
    private List<ContentItemRequest> items;
}
