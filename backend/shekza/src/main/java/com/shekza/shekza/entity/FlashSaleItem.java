package com.shekza.shekza.entity;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flash_sale_id", nullable = false)
    private FlashSale flashSale;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(name = "discount_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountPrice;

    @Column(name = "flash_stock", nullable = false)
    private Integer flashStock;

    @Builder.Default
    @Column(name = "sold_count", nullable = false)
    private Integer soldCount = 0;
}
