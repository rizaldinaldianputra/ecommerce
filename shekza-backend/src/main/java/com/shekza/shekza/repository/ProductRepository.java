package com.shekza.shekza.repository;

import com.shekza.shekza.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Product> findByIdIn(List<Long> ids);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
