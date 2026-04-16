package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ApiResponse;
import com.zelixa.zelixa.service.WahaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/waha")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class WahaController {

    private final WahaService wahaService;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, String>>> getStatus() {
        String status = wahaService.getStatus();
        return ResponseEntity.ok(ApiResponse.success("WAHA session status fetched", Map.of("status", status)));
    }

    @GetMapping("/qr")
    public ResponseEntity<byte[]> getQrCode() {
        byte[] qrCode = wahaService.getQrCode();
        if (qrCode == null) {
            // Return placeholder or empty if error
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        return new ResponseEntity<>(qrCode, headers, HttpStatus.OK);
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Void>> startSession() {
        boolean success = wahaService.startSession();
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("WAHA session started successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Failed to start WAHA session"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logoutSession() {
        boolean success = wahaService.logoutSession();
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("WAHA session logged out successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Failed to logout WAHA session"));
        }
    }
}
