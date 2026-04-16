package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.ProductResponse;
import com.zelixa.zelixa.entity.Product;
import com.zelixa.zelixa.entity.ProductDocument;
import com.zelixa.zelixa.entity.ProductImage;
import com.zelixa.zelixa.entity.ProductVariant;
import com.zelixa.zelixa.repository.ProductImageRepository;
import com.zelixa.zelixa.repository.ProductSearchRepository;
import com.zelixa.zelixa.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductSearchService {

    private final ProductSearchRepository productSearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;

    /**
     * Full-text search across product fields using Elasticsearch
     */
    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        try {
            Criteria criteria = new Criteria("name").contains(query)
                    .or(new Criteria("description").contains(query))
                    .or(new Criteria("shortDescription").contains(query))
                    .or(new Criteria("categoryName").contains(query))
                    .or(new Criteria("material").contains(query));

            CriteriaQuery criteriaQuery = new CriteriaQuery(criteria).setPageable(pageable);

            SearchHits<ProductDocument> hits = elasticsearchOperations.search(criteriaQuery, ProductDocument.class);

            List<ProductResponse> results = hits.getSearchHits().stream()
                    .map(SearchHit::getContent)
                    .map(this::mapDocumentToResponse)
                    .collect(Collectors.toList());

            return new PageImpl<>(results, pageable, hits.getTotalHits());
        } catch (Exception e) {
            log.error("Elasticsearch search failed for query '{}': {}", query, e.getMessage());
            // Fallback to empty result
            return Page.empty(pageable);
        }
    }

    /**
     * Index a product into Elasticsearch
     */
    public void indexProduct(Product product) {
        try {
            List<ProductVariant> variants = variantRepository.findByProductId(product.getId());
            List<ProductImage> images = imageRepository.findByProductId(product.getId());

            String imageUrl = images.stream()
                    .filter(img -> img.getVariantId() == null)
                    .map(ProductImage::getUrl)
                    .findFirst()
                    .orElse(null);

            java.math.BigDecimal price = variants.isEmpty() ? null : variants.get(0).getPrice();

            ProductDocument doc = ProductDocument.builder()
                    .id(product.getId().toString())
                    .productId(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .shortDescription(product.getShortDescription())
                    .slug(product.getSlug())
                    .categoryId(product.getCategoryId())
                    .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                    .brandId(product.getBrandId())
                    .gender(product.getGender())
                    .material(product.getMaterial())
                    .price(price)
                    .isActive(product.getIsActive())
                    .isFeatured(product.getIsFeatured())
                    .isTopProduct(product.getIsTopProduct())
                    .isBestSeller(product.getIsBestSeller())
                    .isRecommended(product.getIsRecommended())
                    .imageUrl(imageUrl)
                    .createdAt(product.getCreatedAt())
                    .updatedAt(product.getUpdatedAt())
                    .build();

            productSearchRepository.save(doc);
            log.info("Indexed product {} into Elasticsearch", product.getId());
        } catch (Exception e) {
            log.error("Failed to index product {}: {}", product.getId(), e.getMessage());
        }
    }

    /**
     * Remove a product from Elasticsearch index
     */
    public void deleteProductFromIndex(Long productId) {
        try {
            productSearchRepository.deleteById(productId.toString());
            log.info("Deleted product {} from Elasticsearch index", productId);
        } catch (Exception e) {
            log.error("Failed to delete product {} from index: {}", productId, e.getMessage());
        }
    }

    /**
     * Re-index all products (admin operation)
     */
    public void reindexAll(List<Product> products) {
        products.forEach(this::indexProduct);
        log.info("Re-indexed {} products into Elasticsearch", products.size());
    }

    private ProductResponse mapDocumentToResponse(ProductDocument doc) {
        ProductResponse response = ProductResponse.builder()
                .id(doc.getProductId())
                .name(doc.getName())
                .slug(doc.getSlug())
                .description(doc.getDescription())
                .shortDescription(doc.getShortDescription())
                .categoryId(doc.getCategoryId())
                .brandId(doc.getBrandId())
                .gender(doc.getGender())
                .material(doc.getMaterial())
                .price(doc.getPrice())
                .isActive(doc.getIsActive())
                .isFeatured(doc.getIsFeatured())
                .isTopProduct(doc.getIsTopProduct())
                .isBestSeller(doc.getIsBestSeller())
                .isRecommended(doc.getIsRecommended())
                .imageUrl(doc.getImageUrl())
                .createdAt(doc.getCreatedAt())
                .updatedAt(doc.getUpdatedAt())
                .build();

        if (doc.getCategoryId() != null && doc.getCategoryName() != null) {
            response.setCategory(com.zelixa.zelixa.dto.CategoryResponse.builder()
                    .id(doc.getCategoryId())
                    .name(doc.getCategoryName())
                    .build());
        }

        return response;
    }
}
