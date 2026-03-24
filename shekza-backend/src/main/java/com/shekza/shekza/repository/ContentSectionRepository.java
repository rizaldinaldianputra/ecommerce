package com.shekza.shekza.repository;

import com.shekza.shekza.entity.ContentSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentSectionRepository extends JpaRepository<ContentSection, Long> {
    List<ContentSection> findAllByOrderByDisplayOrderAsc();
    List<ContentSection> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<ContentSection> findByTypeOrderByDisplayOrderAsc(String type);
    List<ContentSection> findByTypeAndIsActiveTrueOrderByDisplayOrderAsc(String type);
}
