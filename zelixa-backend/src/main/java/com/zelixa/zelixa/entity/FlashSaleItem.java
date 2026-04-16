package com.zelixa.zelixa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "flash_sale_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "flash_sale_id", nullable = false)
    private FlashSale flashSale;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(name = "discount_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal discountPrice;

    @Column(name = "stock_limit")
    private Integer stockLimit;

    @Column(name = "flash_stock", nullable = false)
    private Integer flashStock;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        if (this.flashStock == null)
            this.flashStock = this.stockLimit;
        if (this.stockLimit == null)
            this.stockLimit = this.flashStock;
        if (this.flashStock == null) {
            this.flashStock = 0; // fallback if both are null
            this.stockLimit = 0;
        }
    }

    @Column(name = "sold_count")
    @Builder.Default
    private Integer soldCount = 0;
}
