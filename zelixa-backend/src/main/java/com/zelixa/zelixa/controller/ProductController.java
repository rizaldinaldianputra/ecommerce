package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ProductRequest;
import com.zelixa.zelixa.dto.ProductResponse;
import com.zelixa.zelixa.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return new ResponseEntity<>(productService.createProduct(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(productService.getAllProducts(page, size, search, categoryId));
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<ProductResponse>> getAllProductsPaged(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String q,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProductsElastic(q, pageable));
    }

    @PostMapping("/reindex")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reindexAll() {
        productService.reindexAllProducts();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public ResponseEntity<List<ProductResponse>> getProductsByIds(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(productService.getProductsByIds(ids));
    }

    @GetMapping("/top")
    public ResponseEntity<Page<ProductResponse>> getTopProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getTopProducts(pageable));
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<Page<ProductResponse>> getBestSellers(Pageable pageable) {
        return ResponseEntity.ok(productService.getBestSellers(pageable));
    }

    @GetMapping("/recommended")
    public ResponseEntity<Page<ProductResponse>> getRecommended(Pageable pageable) {
        return ResponseEntity.ok(productService.getRecommendedProducts(pageable));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<ProductResponse>> getFeatured(Pageable pageable) {
        return ResponseEntity.ok(productService.getFeaturedProducts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
