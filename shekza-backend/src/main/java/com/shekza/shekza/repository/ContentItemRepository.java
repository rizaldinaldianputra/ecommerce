package com.shekza.shekza.repository;

import com.shekza.shekza.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentItemRepository extends JpaRepository<ContentItem, Long> {
    List<ContentItem> findBySectionIdOrderByDisplayOrderAsc(Long sectionId);
}
