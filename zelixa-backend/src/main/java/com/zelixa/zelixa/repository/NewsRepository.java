package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    Optional<News> findBySlug(String slug);

    List<News> findByIsActiveTrueOrderByPublishedAtDesc();
}
