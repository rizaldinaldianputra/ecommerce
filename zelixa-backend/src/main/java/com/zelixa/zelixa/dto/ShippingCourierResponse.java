package com.zelixa.zelixa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingCourierResponse {
    private String code;
    private String name;
    private String service;
    private String description;
    private Double cost;
    private String etd;
}
