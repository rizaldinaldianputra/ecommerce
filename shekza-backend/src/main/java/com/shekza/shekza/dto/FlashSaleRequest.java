package com.shekza.shekza.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleRequest {
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isActive;
    private List<FlashSaleItemRequest> items;
}
