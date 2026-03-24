package com.shekza.shekza.repository;

import com.shekza.shekza.entity.FlashSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashSaleItemRepository extends JpaRepository<FlashSaleItem, Long> {
    List<FlashSaleItem> findByFlashSaleId(Long flashSaleId);
}
