package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.StockAdjustmentRequest;
import com.zelixa.zelixa.service.StockService;
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
