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

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private ContentSection section;

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
}
