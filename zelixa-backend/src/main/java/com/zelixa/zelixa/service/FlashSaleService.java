package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.FlashSaleRequest;
import com.zelixa.zelixa.dto.FlashSaleResponse;
import com.zelixa.zelixa.dto.FlashSaleItemRequest;
import com.zelixa.zelixa.dto.FlashSaleItemResponse;
import com.zelixa.zelixa.entity.FlashSale;
import com.zelixa.zelixa.entity.FlashSaleItem;
import com.zelixa.zelixa.entity.Product;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.FlashSaleItemRepository;
import com.zelixa.zelixa.repository.FlashSaleRepository;
import com.zelixa.zelixa.repository.ProductRepository;
import com.zelixa.zelixa.repository.ProductVariantRepository;
import com.zelixa.zelixa.entity.ProductVariant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public FlashSaleResponse createFlashSale(FlashSaleRequest request) {
        FlashSale flashSale = FlashSale.builder()
                .name(request.getName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isActive(request.getIsActive())
                .build();

        FlashSale savedFlashSale = flashSaleRepository.save(flashSale);

        if (request.getItems() != null) {
            List<FlashSaleItem> items = request.getItems().stream().map(itemReq -> {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + itemReq.getProductId()));

                ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Variant not found with id: " + itemReq.getVariantId()));

                return FlashSaleItem.builder()
                        .flashSale(savedFlashSale)
                        .product(product)
                        .productVariant(variant)
                        .discountPrice(itemReq.getDiscountPrice())
                        .stockLimit(itemReq.getStockLimit())
                        .flashStock(itemReq.getStockLimit())
                        .soldCount(0)
                        .build();
            }).collect(Collectors.toList());

            flashSaleItemRepository.saveAll(items);
            savedFlashSale.setItems(items);
        }

        return mapToResponse(savedFlashSale);
    }

    public List<FlashSaleResponse> getAllFlashSales() {
        return flashSaleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FlashSaleResponse> getActiveFlashSales() {
        return flashSaleRepository.findActiveFlashSales(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FlashSaleResponse getFlashSaleById(Long id) {
        FlashSale flashSale = flashSaleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found with id: " + id));
        return mapToResponse(flashSale);
    }

    @Transactional
    public FlashSaleResponse updateFlashSale(Long id, FlashSaleRequest request) {
        FlashSale flashSale = flashSaleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found with id: " + id));

        flashSale.setName(request.getName());
        flashSale.setStartTime(request.getStartTime());
        flashSale.setEndTime(request.getEndTime());
        flashSale.setIsActive(request.getIsActive());

        if (request.getItems() != null) {
            // Clear existing items first for simplicity
            flashSaleItemRepository.deleteByFlashSaleId(id);

            List<FlashSaleItem> items = request.getItems().stream().map(itemReq -> {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + itemReq.getProductId()));

                ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Variant not found with id: " + itemReq.getVariantId()));

                return FlashSaleItem.builder()
                        .flashSale(flashSale)
                        .product(product)
                        .productVariant(variant)
                        .discountPrice(itemReq.getDiscountPrice())
                        .stockLimit(itemReq.getStockLimit())
                        .flashStock(itemReq.getStockLimit())
                        .soldCount(0)
                        .build();
            }).collect(Collectors.toList());

            flashSaleItemRepository.saveAll(items);
            flashSale.setItems(items);
        }

        FlashSale updatedFlashSale = flashSaleRepository.save(flashSale);
        return mapToResponse(updatedFlashSale);
    }

    @Transactional
    public void deleteFlashSale(Long id) {
        if (!flashSaleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Flash sale not found with id: " + id);
        }
        flashSaleRepository.deleteById(id);
    }

    private FlashSaleResponse mapToResponse(FlashSale flashSale) {
        return FlashSaleResponse.builder()
                .id(flashSale.getId())
                .name(flashSale.getName())
                .startTime(flashSale.getStartTime())
                .endTime(flashSale.getEndTime())
                .isActive(flashSale.getIsActive())
                .createdAt(flashSale.getCreatedAt())
                .items(flashSale.getItems() != null ? flashSale.getItems().stream()
                        .map(item -> FlashSaleItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .variantId(item.getProductVariant().getId())
                                .variantName(item.getProductVariant().getSku())
                                .discountPrice(item.getDiscountPrice())
                                .stockLimit(item.getStockLimit())
                                .soldCount(item.getSoldCount())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
