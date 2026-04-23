package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.ContentSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentSectionRepository extends JpaRepository<ContentSection, Long> {
    List<ContentSection> findByPlatformOrderByDisplayOrderAsc(String platform);
    List<ContentSection> findByPlatformAndType(String platform, String type);
}
