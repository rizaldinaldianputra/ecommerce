package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentItemRepository extends JpaRepository<ContentItem, Long> {
    List<ContentItem> findByTypeAndPlatformAndIsActiveTrueOrderByCreatedAtDesc(String type, String platform);
    List<ContentItem> findAllByTypeOrderByCreatedAtDesc(String type);
    List<ContentItem> findByPlatformOrderByCreatedAtDesc(String platform);
    List<ContentItem> findAllByOrderByCreatedAtDesc();
}
