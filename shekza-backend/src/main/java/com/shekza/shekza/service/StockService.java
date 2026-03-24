package com.shekza.shekza.service;

import com.shekza.shekza.dto.StockAdjustmentRequest;
import com.shekza.shekza.entity.ProductVariant;
import com.shekza.shekza.exception.ResourceNotFoundException;
import com.shekza.shekza.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StockService {

    private final ProductVariantRepository variantRepository;

    @Transactional
    public void adjustStock(StockAdjustmentRequest request) {
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found with id: " + request.getVariantId()));

        int newStock;
        String type = request.getType().toUpperCase();

        switch (type) {
            case "ADD":
                newStock = variant.getStock() + request.getQuantity();
                break;
            case "SUBTRACT":
                newStock = variant.getStock() - request.getQuantity();
                if (newStock < 0) newStock = 0;
                break;
            case "SET":
                newStock = request.getQuantity();
                break;
            default:
                throw new IllegalArgumentException("Invalid adjustment type: " + type);
        }

        variant.setStock(newStock);
        variantRepository.save(variant);
    }
}
