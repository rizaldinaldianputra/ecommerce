package com.zelixa.zelixa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentItemResponse {
    private Long id;
    private String type;
    private String platform;
    private Boolean isActive;
    private String title;
    private String subtitle;
    private String imageUrl;
    private String linkUrl;
    private Long productId;
    private String tag;
    private String ctaText;
    private String badgeText;
    private String iconName;
    private String emoji;
    private String styleConfig;
    private Integer displayOrder;
    private java.time.LocalDateTime startDate;
    private java.time.LocalDateTime endDate;
    private String contentBody;
    private String bannerUrl;
    private String productIds;
    private java.util.List<ProductResponse> products;
    private ProductResponse product;
}
