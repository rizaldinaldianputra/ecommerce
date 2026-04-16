package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.StockTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    Page<StockTransaction> findByVariantIdOrderByCreatedAtDesc(Long variantId, Pageable pageable);

    Page<StockTransaction> findByVariantProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(CASE WHEN st.quantity > 0 THEN st.quantity ELSE 0 END) FROM StockTransaction st WHERE st.variant.id = :variantId")
    Long getTotalInByVariantId(Long variantId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(CASE WHEN st.quantity < 0 THEN ABS(st.quantity) ELSE 0 END) FROM StockTransaction st WHERE st.variant.id = :variantId")
    Long getTotalOutByVariantId(Long variantId);

    Page<StockTransaction> findByVariantSkuContainingIgnoreCaseOrVariantProductNameContainingIgnoreCase(String sku,
            String productName, Pageable pageable);

    boolean existsByVariantId(Long variantId);
}
