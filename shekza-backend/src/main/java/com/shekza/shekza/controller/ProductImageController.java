package com.shekza.shekza.controller;

import com.shekza.shekza.dto.ProductImageRequest;
import com.shekza.shekza.dto.ProductImageResponse;
import com.shekza.shekza.service.ProductImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/{productId}/images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService imageService;

    @PostMapping
    public ResponseEntity<ProductImageResponse> addImageToProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductImageRequest request) {
        return new ResponseEntity<>(imageService.addImageToProduct(productId, request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductImageResponse>> getImagesByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(imageService.getImagesByProductId(productId));
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<ProductImageResponse> getImageById(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        return ResponseEntity.ok(imageService.getImageById(productId, imageId));
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        imageService.deleteImage(productId, imageId);
        return ResponseEntity.noContent().build();
    }
}
