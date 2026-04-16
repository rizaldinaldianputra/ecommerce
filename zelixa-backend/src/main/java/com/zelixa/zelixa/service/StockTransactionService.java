package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.StockSummaryResponse;
import com.zelixa.zelixa.dto.StockTransactionRequest;
import com.zelixa.zelixa.dto.StockTransactionResponse;
import com.zelixa.zelixa.entity.ProductVariant;
import com.zelixa.zelixa.entity.StockTransaction;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ProductVariantRepository;
import com.zelixa.zelixa.repository.StockTransactionRepository;
import com.zelixa.zelixa.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockTransactionService {

    private final StockTransactionRepository transactionRepository;
    private final ProductVariantRepository variantRepository;

    private String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @Transactional
    public StockTransactionResponse addStock(StockTransactionRequest request) {
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Variant not found with id: " + request.getVariantId()));

        int oldStock = variant.getStock() != null ? variant.getStock() : 0;
        int qty = request.getQuantity();
        variant.setStock(oldStock + qty);
        variantRepository.save(variant);

        StockTransaction transaction = StockTransaction.builder()
                .variant(variant)
                .quantity(qty)
                .type("ADDITION")
                .notes(request.getNotes())
                .createdBy(getCurrentUser())
                .build();

        StockTransaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Transactional
    public StockTransactionResponse adjustStock(StockTransactionRequest request) {
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Variant not found with id: " + request.getVariantId()));

        int oldStock = variant.getStock() != null ? variant.getStock() : 0;
        int newTotal = request.getQuantity();
        int diff = newTotal - oldStock;

        variant.setStock(newTotal);
        variantRepository.save(variant);

        StockTransaction transaction = StockTransaction.builder()
                .variant(variant)
                .quantity(diff)
                .type("ADJUSTMENT")
                .notes(request.getNotes())
                .createdBy(getCurrentUser())
                .build();

        StockTransaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    public Page<StockTransactionResponse> getHistoryByVariant(Long variantId, Pageable pageable) {
        return transactionRepository.findByVariantIdOrderByCreatedAtDesc(variantId, pageable)
                .map(this::mapToResponse);
    }

    public Page<StockTransactionResponse> getHistoryByProduct(Long productId, Pageable pageable) {
        return transactionRepository.findByVariantProductIdOrderByCreatedAtDesc(productId, pageable)
                .map(this::mapToResponse);
    }

    public Page<StockTransactionResponse> searchHistory(String query, Pageable pageable) {
        if (query == null || query.isEmpty()) {
            return transactionRepository.findAll(pageable).map(this::mapToResponse);
        }
        return transactionRepository
                .findByVariantSkuContainingIgnoreCaseOrVariantProductNameContainingIgnoreCase(query, query, pageable)
                .map(this::mapToResponse);
    }

    public StockSummaryResponse getStockSummary(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        Long totalIn = transactionRepository.getTotalInByVariantId(variantId);
        Long totalOut = transactionRepository.getTotalOutByVariantId(variantId);

        return StockSummaryResponse.builder()
                .variantId(variantId)
                .sku(variant.getSku())
                .productName(variant.getProduct().getName())
                .currentStock(variant.getStock())
                .totalIn(totalIn != null ? totalIn : 0L)
                .totalOut(totalOut != null ? totalOut : 0L)
                .build();
    }

    public List<StockSummaryResponse> getSummariesForVariants(List<Long> variantIds) {
        return variantIds.stream().map(this::getStockSummary).collect(Collectors.toList());
    }

    private StockTransactionResponse mapToResponse(StockTransaction transaction) {
        return StockTransactionResponse.builder()
                .id(transaction.getId())
                .variantId(transaction.getVariant().getId())
                .sku(transaction.getVariant().getSku())
                .productId(transaction.getVariant().getProduct().getId())
                .productName(transaction.getVariant().getProduct().getName())
                .quantity(transaction.getQuantity())
                .type(transaction.getType())
                .notes(transaction.getNotes())
                .createdBy(transaction.getCreatedBy())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
