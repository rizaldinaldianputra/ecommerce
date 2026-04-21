package com.zelixa.zelixa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "content_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String type;

    @Column(length = 20)
    @Builder.Default
    private String platform = "WEB";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }

    @Column(length = 255)
    private String title;

    @Column(length = 500)
    private String subtitle;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "product_id")
    private Long productId;

    @Column(length = 100)
    private String tag;

    @Column(name = "cta_text", length = 100)
    private String ctaText;

    @Column(name = "badge_text", length = 100)
    private String badgeText;

    @Column(name = "icon_name", length = 100)
    private String iconName;

    @Column(length = 50)
    private String emoji;

    @Column(name = "style_config", length = 500)
    private String styleConfig;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "start_date")
    private java.time.LocalDateTime startDate;

    @Column(name = "end_date")
    private java.time.LocalDateTime endDate;

    @Column(name = "content_body", columnDefinition = "TEXT")
    private String contentBody;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "product_ids", length = 1000)
    private String productIds;
}
