package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductSearchRepository extends ElasticsearchRepository<ProductDocument, String> {

    // Multi-field search across name, description, shortDescription
    Page<ProductDocument> findByNameContainingOrDescriptionContainingOrShortDescriptionContaining(
            String name, String description, String shortDescription, Pageable pageable);

    Page<ProductDocument> findByIsActiveTrue(Pageable pageable);

    Page<ProductDocument> findByCategoryId(Long categoryId, Pageable pageable);

    Page<ProductDocument> findByGender(String gender, Pageable pageable);
}
