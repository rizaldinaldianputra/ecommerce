package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.NotificationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationHistoryRepository extends JpaRepository<NotificationHistory, Long> {

    List<NotificationHistory> findByUserIdOrderByCreatedAtDesc(Long userId);

    Long countByUserIdAndIsReadFalse(Long userId);

    List<NotificationHistory> findByUserIdAndIsReadFalse(Long userId);

    void deleteByUserId(Long userId);

    // For news (global)
    List<NotificationHistory> findByUserIdIsNullOrderByCreatedAtDesc();
}
