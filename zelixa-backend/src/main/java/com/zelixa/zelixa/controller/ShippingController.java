package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ShippingCourierResponse;
import com.zelixa.zelixa.dto.ApiResponse;
import com.zelixa.zelixa.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @GetMapping("/provinces")
    public ResponseEntity<ApiResponse<List<Object>>> getProvinces() {
        return ResponseEntity.ok(ApiResponse.success("Provinces fetched", shippingService.getProvinces()));
    }

    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<List<Object>>> getCities(@RequestParam String provinceId) {
        return ResponseEntity.ok(ApiResponse.success("Cities fetched", shippingService.getCities(provinceId)));
    }

    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<Object>>> getDistricts(@RequestParam String cityId) {
        return ResponseEntity.ok(ApiResponse.success("Districts fetched", shippingService.getDistricts(cityId)));
    }

    @GetMapping("/sub-districts")
    public ResponseEntity<ApiResponse<List<Object>>> getSubdistricts(@RequestParam String districtId) {
        return ResponseEntity.ok(ApiResponse.success("Subdistricts fetched", shippingService.getSubdistricts(districtId)));
    }

    @PostMapping("/cost")
    public ResponseEntity<ApiResponse<List<ShippingCourierResponse>>> calculateCost(@RequestBody Map<String, Object> payload) {
        String origin = payload.get("origin").toString();
        String destination = payload.get("destination").toString();
        int weight = Integer.parseInt(payload.get("weight").toString());
        String courier = payload.get("courier").toString();
        
        return ResponseEntity.ok(ApiResponse.success("Shipping cost calculated", 
            shippingService.calculateCost(origin, destination, weight, courier)));
    }
}
