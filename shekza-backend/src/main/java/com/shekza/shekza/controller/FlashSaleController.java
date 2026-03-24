package com.shekza.shekza.controller;

import com.shekza.shekza.dto.FlashSaleRequest;
import com.shekza.shekza.dto.FlashSaleResponse;
import com.shekza.shekza.service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flash-sales")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    @PostMapping
    public ResponseEntity<FlashSaleResponse> createFlashSale(@RequestBody FlashSaleRequest request) {
        return ResponseEntity.ok(flashSaleService.createFlashSale(request));
    }

    @GetMapping
    public ResponseEntity<List<FlashSaleResponse>> getAllFlashSales() {
        return ResponseEntity.ok(flashSaleService.getAllFlashSales());
    }

    @GetMapping("/active")
    public ResponseEntity<List<FlashSaleResponse>> getActiveFlashSales() {
        return ResponseEntity.ok(flashSaleService.getActiveFlashSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlashSaleResponse> getFlashSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(flashSaleService.getFlashSaleById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashSale(@PathVariable Long id) {
        flashSaleService.deleteFlashSale(id);
        return ResponseEntity.noContent().build();
    }
}
