package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.ProductRequest;
import com.zelixa.zelixa.dto.ProductResponse;
import com.zelixa.zelixa.entity.Product;
import com.zelixa.zelixa.entity.ProductImage;
import com.zelixa.zelixa.entity.ProductVariant;
import com.zelixa.zelixa.entity.StockTransaction;
import com.zelixa.zelixa.util.SlugUtils;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ProductImageRepository;
import com.zelixa.zelixa.repository.ProductRepository;
import com.zelixa.zelixa.repository.ProductVariantRepository;
import com.zelixa.zelixa.repository.StockTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;
    private final StockTransactionRepository transactionRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        String slug = request.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = SlugUtils.makeSlug(request.getName());
        }

        // Ensure uniqueness
        if (productRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 5);
        }

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .categoryId(request.getCategoryId())
                .brandId(request.getBrandId())
                .gender(request.getGender())
                .material(request.getMaterial())
                .weight(request.getWeight())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isTopProduct(request.getIsTopProduct() != null ? request.getIsTopProduct() : false)
                .isBestSeller(request.getIsBestSeller() != null ? request.getIsBestSeller() : false)
                .isRecommended(request.getIsRecommended() != null ? request.getIsRecommended() : false)
                .build();

        Product savedProduct = productRepository.save(product);

        // Handle Variants if provided
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (com.zelixa.zelixa.dto.ProductVariantRequest vReq : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(savedProduct)
                        .sku(vReq.getSku())
                        .size(vReq.getSize())
                        .color(vReq.getColor())
                        .price(vReq.getPrice())
                        .discountPrice(vReq.getDiscountPrice())
                        .costPrice(vReq.getCostPrice())
                        .barcode(vReq.getBarcode())
                        .stock(vReq.getStock() != null ? vReq.getStock() : 0)
                        .isActive(vReq.getIsActive() != null ? vReq.getIsActive() : true)
                        .build();
                ProductVariant savedVariant = variantRepository.save(variant);

                // Initial Stock Transaction
                if (savedVariant.getStock() > 0) {
                    transactionRepository.save(StockTransaction.builder()
                            .variant(savedVariant)
                            .quantity(savedVariant.getStock())
                            .type("INITIAL")
                            .notes("Initial stock on creation")
                            .build());
                }

                // Save variant image if provided
                if (vReq.getImageUrl() != null && !vReq.getImageUrl().isEmpty()) {
                    ProductImage vImg = ProductImage.builder()
                            .product(savedProduct)
                            .variantId(savedVariant.getId())
                            .url(vReq.getImageUrl())
                            .sortOrder(0)
                            .build();
                    imageRepository.save(vImg);
                }
            }
        } else {
            // Create Default Variant if none provided (legacy compatibility)
            ProductVariant variant = ProductVariant.builder()
                    .product(savedProduct)
                    .sku("SKU-" + savedProduct.getSlug().toUpperCase())
                    .price(request.getPrice())
                    .stock(request.getQty() != null ? request.getQty() : 0)
                    .isActive(true)
                    .build();
            ProductVariant savedVariant = variantRepository.save(variant);

            // Initial Stock Transaction
            if (savedVariant.getStock() > 0) {
                transactionRepository.save(StockTransaction.builder()
                        .variant(savedVariant)
                        .quantity(savedVariant.getStock())
                        .type("INITIAL")
                        .notes("Initial stock on creation (default variant)")
                        .build());
            }
        }

        // Handle Images (Treat imageUrl as primary)
        int sortOrder = 0;
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            imageRepository.save(ProductImage.builder()
                    .product(savedProduct)
                    .url(request.getImageUrl())
                    .sortOrder(sortOrder++)
                    .build());
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (String url : request.getImages()) {
                // Avoid duplicating the primary image if it's also in the gallery
                if (request.getImageUrl() != null && url.equals(request.getImageUrl()))
                    continue;

                imageRepository.save(ProductImage.builder()
                        .product(savedProduct)
                        .url(url)
                        .sortOrder(sortOrder++)
                        .build());
            }
        }

        ProductResponse resp = mapToResponse(savedProduct);
        return resp;
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setShortDescription(request.getShortDescription());
        product.setCategoryId(request.getCategoryId());
        product.setBrandId(request.getBrandId());
        product.setGender(request.getGender());
        product.setMaterial(request.getMaterial());
        product.setWeight(request.getWeight());
        if (request.getIsActive() != null)
            product.setIsActive(request.getIsActive());
        if (request.getIsFeatured() != null)
            product.setIsFeatured(request.getIsFeatured());
        if (request.getIsTopProduct() != null)
            product.setIsTopProduct(request.getIsTopProduct());
        if (request.getIsBestSeller() != null)
            product.setIsBestSeller(request.getIsBestSeller());
        if (request.getIsRecommended() != null)
            product.setIsRecommended(request.getIsRecommended());

        Product updatedProduct = productRepository.save(product);

        // Intelligent Merge for Variants
        List<ProductVariant> existingVariants = variantRepository.findByProductId(id);
        List<com.zelixa.zelixa.dto.ProductVariantRequest> incomingVariants = request.getVariants() != null
                ? request.getVariants()
                : new java.util.ArrayList<>();

        // 1. Identify variants to delete
        java.util.Set<Long> incomingIds = incomingVariants.stream()
                .map(v -> v.getId())
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());

        List<ProductVariant> toDelete = existingVariants.stream()
                .filter(v -> !incomingIds.contains(v.getId()))
                .collect(java.util.stream.Collectors.toList());

        for (ProductVariant v : toDelete) {
            boolean hasTransactions = transactionRepository.existsByVariantId(v.getId());
            if (hasTransactions) {
                // Cannot delete, just deactivate
                v.setIsActive(false);
                variantRepository.save(v);
            } else {
                // No transactions, safe to delete
                variantRepository.delete(v);
            }
        }
        variantRepository.flush(); // CRITICAL: Flush changes

        // 2. Update or Create variants
        for (com.zelixa.zelixa.dto.ProductVariantRequest vReq : incomingVariants) {
            ProductVariant variant;
            if (vReq.getId() != null) {
                variant = existingVariants.stream()
                        .filter(v -> v.getId().equals(vReq.getId()))
                        .findFirst()
                        .orElse(new ProductVariant());
            } else {
                variant = new ProductVariant();
            }

            variant.setProduct(updatedProduct);
            variant.setSku(vReq.getSku());
            variant.setSize(vReq.getSize());
            variant.setColor(vReq.getColor());
            variant.setPrice(vReq.getPrice());
            variant.setDiscountPrice(vReq.getDiscountPrice());
            variant.setCostPrice(vReq.getCostPrice());
            variant.setBarcode(vReq.getBarcode());
            // Only set stock if it's a new variant
            if (variant.getId() == null) {
                variant.setStock(vReq.getStock() != null ? vReq.getStock() : 0);
            }
            variant.setIsActive(vReq.getIsActive() != null ? vReq.getIsActive() : true);

            ProductVariant savedVariant = variantRepository.save(variant);

            // Initial Stock Transaction for new variants in update
            if (variant.getId() == null && savedVariant.getStock() > 0) {
                transactionRepository.save(StockTransaction.builder()
                        .variant(savedVariant)
                        .quantity(savedVariant.getStock())
                        .type("INITIAL")
                        .notes("Initial stock for new variant during update")
                        .build());
            }

            // Handle Variant Image
            if (vReq.getImageUrl() != null && !vReq.getImageUrl().isEmpty()) {
                // Remove old variant image if exists
                imageRepository.deleteByProductIdAndVariantId(id, savedVariant.getId());
                imageRepository.save(ProductImage.builder()
                        .product(updatedProduct)
                        .variantId(savedVariant.getId())
                        .url(vReq.getImageUrl())
                        .sortOrder(0)
                        .build());
            }
        }

        // 3. Handle General Images (Treat imageUrl as primary)
        imageRepository.deleteByProductIdAndVariantIdIsNull(id);
        int sortOrder = 0;
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            imageRepository.save(ProductImage.builder()
                    .product(updatedProduct)
                    .url(request.getImageUrl())
                    .sortOrder(sortOrder++)
                    .build());
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (String url : request.getImages()) {
                // Avoid duplicating moving the primary image to gallery twice
                if (request.getImageUrl() != null && url.equals(request.getImageUrl()))
                    continue;

                imageRepository.save(ProductImage.builder()
                        .product(updatedProduct)
                        .url(url)
                        .sortOrder(sortOrder++)
                        .build());
            }
        }

        ProductResponse resp = mapToResponse(updatedProduct);
        return resp;
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToResponse(product);
    }

    public Page<ProductResponse> getAllProducts(int page, int size, String search, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size);

        // 1. Try Category + Search or Category only
        if (categoryId != null) {
            if (search != null && !search.trim().isEmpty()) {
                return productRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, search, pageable).map(this::mapToResponse);
            } else {
                return productRepository.findByCategoryId(categoryId, pageable).map(this::mapToResponse);
            }
        }

        // 2. Try General Search
        if (search != null && !search.trim().isEmpty()) {
            return productRepository.searchProducts(search, pageable).map(this::mapToResponse);
        }

        // 3. Just All Products
        return productRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<ProductResponse> getTopProducts(Pageable pageable) {
        return productRepository.findByIsTopProductTrue(pageable).map(this::mapToResponse);
    }

    public Page<ProductResponse> getBestSellers(Pageable pageable) {
        return productRepository.findByIsBestSellerTrue(pageable).map(this::mapToResponse);
    }

    public Page<ProductResponse> getRecommendedProducts(Pageable pageable) {
        return productRepository.findByIsRecommendedTrue(pageable).map(this::mapToResponse);
    }

    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByIsFeaturedTrue(pageable).map(this::mapToResponse);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public List<ProductResponse> getProductsByIds(List<Long> ids) {
        return productRepository.findByIdIn(ids).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .shortDescription(product.getShortDescription())
                .categoryId(product.getCategoryId())
                .brandId(product.getBrandId())
                .gender(product.getGender())
                .material(product.getMaterial())
                .weight(product.getWeight())
                .isActive(product.getIsActive())
                .isFeatured(product.getIsFeatured())
                .isTopProduct(product.getIsTopProduct())
                .isBestSeller(product.getIsBestSeller())
                .isRecommended(product.getIsRecommended())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();

        if (product.getCategory() != null) {
            response.setCategory(com.zelixa.zelixa.dto.CategoryResponse.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .slug(product.getCategory().getSlug())
                    .imageUrl(product.getCategory().getImageUrl())
                    .build());
        }

        List<ProductVariant> variants = variantRepository.findByProductId(product.getId());
        List<ProductImage> images = imageRepository.findByProductId(product.getId());

        if (!variants.isEmpty()) {
            response.setPrice(variants.get(0).getPrice());
            response.setQty(variants.get(0).getStock());

            response.setVariants(variants.stream().map(v -> {
                com.zelixa.zelixa.dto.ProductVariantResponse vRes = com.zelixa.zelixa.dto.ProductVariantResponse
                        .builder()
                        .id(v.getId())
                        .productId(v.getProduct().getId())
                        .sku(v.getSku())
                        .size(v.getSize())
                        .color(v.getColor())
                        .price(v.getPrice())
                        .discountPrice(v.getDiscountPrice())
                        .costPrice(v.getCostPrice())
                        .barcode(v.getBarcode())
                        .stock(v.getStock())
                        .isActive(v.getIsActive())
                        .createdAt(v.getCreatedAt())
                        .updatedAt(v.getUpdatedAt())
                        .build();

                // Find image for this variant
                images.stream()
                        .filter(img -> v.getId().equals(img.getVariantId()))
                        .findFirst()
                        .ifPresent(img -> vRes.setImageUrl(img.getUrl()));

                return vRes;
            }).collect(java.util.stream.Collectors.toList()));
        }

        if (!images.isEmpty()) {
            response.setImageUrl(images.get(0).getUrl());
            response.setImages(images.stream()
                    .filter(img -> img.getVariantId() == null)
                    .map(ProductImage::getUrl)
                    .collect(java.util.stream.Collectors.toList()));
        }

        return response;
    }
}
