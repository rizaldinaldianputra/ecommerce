package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.FlashSaleRequest;
import com.zelixa.zelixa.dto.FlashSaleResponse;
import com.zelixa.zelixa.service.FlashSaleService;
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

    @PutMapping("/{id}")
    public ResponseEntity<FlashSaleResponse> updateFlashSale(@PathVariable Long id, @RequestBody FlashSaleRequest request) {
        return ResponseEntity.ok(flashSaleService.updateFlashSale(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashSale(@PathVariable Long id) {
        flashSaleService.deleteFlashSale(id);
        return ResponseEntity.noContent().build();
    }
}
