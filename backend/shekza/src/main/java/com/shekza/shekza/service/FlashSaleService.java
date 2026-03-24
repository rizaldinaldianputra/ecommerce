package com.shekza.shekza.service;

import com.shekza.shekza.dto.*;
import com.shekza.shekza.entity.FlashSale;
import com.shekza.shekza.entity.FlashSaleItem;
import com.shekza.shekza.entity.ProductVariant;
import com.shekza.shekza.exception.ResourceNotFoundException;
import com.shekza.shekza.repository.FlashSaleItemRepository;
import com.shekza.shekza.repository.FlashSaleRepository;
import com.shekza.shekza.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository itemRepository;
    private final ProductVariantRepository variantRepository;

    @Transactional
    public FlashSaleResponse createFlashSale(FlashSaleRequest request) {
        FlashSale flashSale = FlashSale.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        FlashSale savedSale = flashSaleRepository.save(flashSale);

        if (request.getItems() != null) {
            List<FlashSaleItem> items = request.getItems().stream().map(iReq -> 
                FlashSaleItem.builder()
                    .flashSale(savedSale)
                    .variantId(iReq.getVariantId())
                    .discountPrice(iReq.getDiscountPrice())
                    .flashStock(iReq.getFlashStock())
                    .soldCount(0)
                    .build()
            ).collect(Collectors.toList());
            itemRepository.saveAll(items);
            savedSale.setItems(items);
        }

        return mapToResponse(savedSale);
    }

    public List<FlashSaleResponse> getAllFlashSales() {
        return flashSaleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FlashSaleResponse getFlashSaleById(Long id) {
        FlashSale sale = flashSaleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flash Sale not found"));
        return mapToResponse(sale);
    }

    @Transactional
    public void deleteFlashSale(Long id) {
        flashSaleRepository.deleteById(id);
    }

    private FlashSaleResponse mapToResponse(FlashSale sale) {
        List<FlashSaleItemResponse> items = sale.getItems() == null ? null : 
            sale.getItems().stream().map(item -> {
                ProductVariant variant = variantRepository.findById(item.getVariantId()).orElse(null);
                return FlashSaleItemResponse.builder()
                        .id(item.getId())
                        .variantId(item.getVariantId())
                        .variantSku(variant != null ? variant.getSku() : "N/A")
                        .productName(variant != null ? variant.getProduct().getName() : "N/A")
                        .originalPrice(variant != null ? variant.getPrice() : null)
                        .discountPrice(item.getDiscountPrice())
                        .flashStock(item.getFlashStock())
                        .soldCount(item.getSoldCount())
                        .build();
            }).collect(Collectors.toList());

        return FlashSaleResponse.builder()
                .id(sale.getId())
                .title(sale.getTitle())
                .description(sale.getDescription())
                .startTime(sale.getStartTime())
                .endTime(sale.getEndTime())
                .isActive(sale.getIsActive())
                .items(items)
                .createdAt(sale.getCreatedAt())
                .updatedAt(sale.getUpdatedAt())
                .build();
    }
}
