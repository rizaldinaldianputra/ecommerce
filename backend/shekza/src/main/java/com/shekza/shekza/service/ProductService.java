package com.shekza.shekza.service;

import com.shekza.shekza.dto.ProductRequest;
import com.shekza.shekza.dto.ProductResponse;
import com.shekza.shekza.entity.Product;
import com.shekza.shekza.entity.ProductImage;
import com.shekza.shekza.entity.ProductVariant;
import com.shekza.shekza.exception.ResourceNotFoundException;
import com.shekza.shekza.repository.ProductImageRepository;
import com.shekza.shekza.repository.ProductRepository;
import com.shekza.shekza.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .slug(request.getName().toLowerCase().replace(" ", "-") + "-"
                        + UUID.randomUUID().toString().substring(0, 8))
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .categoryId(request.getCategoryId())
                .brandId(request.getBrandId())
                .gender(request.getGender())
                .material(request.getMaterial())
                .weight(request.getWeight())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .build();

        Product savedProduct = productRepository.save(product);

        // Handle Variants if provided
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (com.shekza.shekza.dto.ProductVariantRequest vReq : request.getVariants()) {
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
            variantRepository.save(variant);
        }

        // Handle General Images
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (int i = 0; i < request.getImages().size(); i++) {
                ProductImage image = ProductImage.builder()
                        .product(savedProduct)
                        .url(request.getImages().get(i))
                        .sortOrder(i + 1)
                        .build();
                imageRepository.save(image);
            }
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            // Legacy support
            ProductImage image = ProductImage.builder()
                    .product(savedProduct)
                    .url(request.getImageUrl())
                    .sortOrder(0)
                    .build();
            imageRepository.save(image);
        }

        return mapToResponse(savedProduct);
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

        Product updatedProduct = productRepository.save(product);

        // Intelligent Merge for Variants
        List<ProductVariant> existingVariants = variantRepository.findByProductId(id);
        List<com.shekza.shekza.dto.ProductVariantRequest> incomingVariants = request.getVariants() != null ? 
                request.getVariants() : new java.util.ArrayList<>();

        // 1. Identify variants to delete
        java.util.Set<Long> incomingIds = incomingVariants.stream()
                .map(v -> v.getId())
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());
        
        List<ProductVariant> toDelete = existingVariants.stream()
                .filter(v -> !incomingIds.contains(v.getId()))
                .collect(java.util.stream.Collectors.toList());
        
        variantRepository.deleteAll(toDelete);
        variantRepository.flush(); // CRITICAL: Flush deletions to clear SKU index

        // 2. Update or Create variants
        for (com.shekza.shekza.dto.ProductVariantRequest vReq : incomingVariants) {
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
            variant.setStock(vReq.getStock() != null ? vReq.getStock() : 0);
            variant.setIsActive(vReq.getIsActive() != null ? vReq.getIsActive() : true);
            
            ProductVariant savedVariant = variantRepository.save(variant);

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

        // 3. Handle General Images (Simple approach: replace non-variant images)
        imageRepository.deleteByProductIdAndVariantIdIsNull(id);
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (int i = 0; i < request.getImages().size(); i++) {
                imageRepository.save(ProductImage.builder()
                        .product(updatedProduct)
                        .url(request.getImages().get(i))
                        .sortOrder(i + 1)
                        .build());
            }
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            imageRepository.save(ProductImage.builder()
                        .product(updatedProduct)
                        .url(request.getImageUrl())
                        .sortOrder(0)
                        .build());
        }

        return mapToResponse(updatedProduct);
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

    public Page<ProductResponse> getAllProducts(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;

        if (search != null && !search.trim().isEmpty()) {
            productPage = productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        return productPage.map(this::mapToResponse);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
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
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();

        List<ProductVariant> variants = variantRepository.findByProductId(product.getId());
        List<ProductImage> images = imageRepository.findByProductId(product.getId());

        if (!variants.isEmpty()) {
            response.setPrice(variants.get(0).getPrice());
            response.setQty(variants.get(0).getStock());
            
            response.setVariants(variants.stream().map(v -> {
                com.shekza.shekza.dto.ProductVariantResponse vRes = com.shekza.shekza.dto.ProductVariantResponse.builder()
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
