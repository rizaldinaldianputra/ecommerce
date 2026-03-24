package com.shekza.shekza.controller;

import com.shekza.shekza.dto.StockAdjustmentRequest;
import com.shekza.shekza.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/adjust")
    public ResponseEntity<Void> adjustStock(@RequestBody StockAdjustmentRequest request) {
        stockService.adjustStock(request);
        return ResponseEntity.ok().build();
    }
}
