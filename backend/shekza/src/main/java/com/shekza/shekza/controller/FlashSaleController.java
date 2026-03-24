package com.shekza.shekza.controller;

import com.shekza.shekza.dto.FlashSaleRequest;
import com.shekza.shekza.dto.FlashSaleResponse;
import com.shekza.shekza.service.FlashSaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/flash-sales")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    @PostMapping
    public ResponseEntity<FlashSaleResponse> create(@Valid @RequestBody FlashSaleRequest request) {
        return new ResponseEntity<>(flashSaleService.createFlashSale(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FlashSaleResponse>> getAll() {
        return ResponseEntity.ok(flashSaleService.getAllFlashSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlashSaleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(flashSaleService.getFlashSaleById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flashSaleService.deleteFlashSale(id);
        return ResponseEntity.noContent().build();
    }
}
