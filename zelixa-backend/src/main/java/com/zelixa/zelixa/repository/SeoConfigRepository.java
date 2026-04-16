package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.SeoConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeoConfigRepository extends JpaRepository<SeoConfig, Long> {
    Optional<SeoConfig> findByPageName(String pageName);
}
