package com.shekza.shekza.repository;

import com.shekza.shekza.entity.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {
    List<FlashSale> findByIsActiveTrueAndStartTimeBeforeAndEndTimeAfter(LocalDateTime now1, LocalDateTime now2);
}
