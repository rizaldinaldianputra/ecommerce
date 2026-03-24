package com.shekza.shekza.service;

import com.shekza.shekza.dto.ProductImageRequest;
import com.shekza.shekza.dto.ProductImageResponse;
import com.shekza.shekza.entity.Product;
import com.shekza.shekza.entity.ProductImage;
import com.shekza.shekza.exception.ResourceNotFoundException;
import com.shekza.shekza.repository.ProductImageRepository;
import com.shekza.shekza.repository.ProductRepository;
import com.shekza.shekza.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductImageResponse addImageToProduct(Long productId, ProductImageRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (request.getVariantId() != null && !productVariantRepository.existsById(request.getVariantId())) {
            throw new ResourceNotFoundException("Variant not found with id: " + request.getVariantId());
        }

        ProductImage image = ProductImage.builder()
                .product(product)
                .variantId(request.getVariantId())
                .url(request.getUrl())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        ProductImage savedImage = productImageRepository.save(image);
        return mapToResponse(savedImage);
    }

    public ProductImageResponse getImageById(Long productId, Long imageId) {
        ProductImage image = getImageAndVerifyProduct(productId, imageId);
        return mapToResponse(image);
    }

    public List<ProductImageResponse> getImagesByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return productImageRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteImage(Long productId, Long imageId) {
        ProductImage image = getImageAndVerifyProduct(productId, imageId);
        productImageRepository.delete(image);
    }

    private ProductImage getImageAndVerifyProduct(Long productId, Long imageId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Product Image not found with id: " + imageId));
        if (!image.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Image does not belong to the specified product");
        }
        return image;
    }

    private ProductImageResponse mapToResponse(ProductImage image) {
        return ProductImageResponse.builder()
                .id(image.getId())
                .productId(image.getProduct().getId())
                .variantId(image.getVariantId())
                .url(image.getUrl())
                .sortOrder(image.getSortOrder())
                .createdAt(image.getCreatedAt())
                .build();
    }
}
