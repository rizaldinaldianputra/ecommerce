package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.ProductVariantRequest;
import com.zelixa.zelixa.dto.ProductVariantResponse;
import com.zelixa.zelixa.entity.Product;
import com.zelixa.zelixa.entity.ProductVariant;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ProductRepository;
import com.zelixa.zelixa.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;

    public ProductVariantResponse createVariant(Long productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .sku(request.getSku())
                .size(request.getSize())
                .color(request.getColor())
                .hexColor(request.getHexColor())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .costPrice(request.getCostPrice())
                .barcode(request.getBarcode())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        ProductVariant savedVariant = productVariantRepository.save(variant);
        return mapToResponse(savedVariant);
    }

    public ProductVariantResponse updateVariant(Long productId, Long variantId, ProductVariantRequest request) {
        ProductVariant variant = getVariantAndVerifyProduct(productId, variantId);

        variant.setSku(request.getSku());
        variant.setSize(request.getSize());
        variant.setColor(request.getColor());
        variant.setHexColor(request.getHexColor());
        variant.setPrice(request.getPrice());
        variant.setDiscountPrice(request.getDiscountPrice());
        variant.setCostPrice(request.getCostPrice());
        variant.setBarcode(request.getBarcode());
        if (request.getStock() != null)
            variant.setStock(request.getStock());
        if (request.getIsActive() != null)
            variant.setIsActive(request.getIsActive());

        ProductVariant updatedVariant = productVariantRepository.save(variant);
        return mapToResponse(updatedVariant);
    }

    public ProductVariantResponse getVariantById(Long productId, Long variantId) {
        ProductVariant variant = getVariantAndVerifyProduct(productId, variantId);
        return mapToResponse(variant);
    }

    public List<ProductVariantResponse> getVariantsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return productVariantRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteVariant(Long productId, Long variantId) {
        ProductVariant variant = getVariantAndVerifyProduct(productId, variantId);
        productVariantRepository.delete(variant);
    }

    private ProductVariant getVariantAndVerifyProduct(Long productId, Long variantId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Variant not found with id: " + variantId));
        if (!variant.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Variant does not belong to the specified product");
        }
        return variant;
    }

    private ProductVariantResponse mapToResponse(ProductVariant variant) {
        return ProductVariantResponse.builder()
                .id(variant.getId())
                .productId(variant.getProduct().getId())
                .sku(variant.getSku())
                .size(variant.getSize())
                .color(variant.getColor())
                .hexColor(variant.getHexColor())
                .price(variant.getPrice())
                .discountPrice(variant.getDiscountPrice())
                .costPrice(variant.getCostPrice())
                .barcode(variant.getBarcode())
                .stock(variant.getStock() != null ? variant.getStock() : 0)
                .isActive(variant.getIsActive())
                .createdAt(variant.getCreatedAt())
                .updatedAt(variant.getUpdatedAt())
                .build();
    }
}
