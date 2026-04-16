package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.SeoConfigRequest;
import com.zelixa.zelixa.dto.SeoConfigResponse;
import com.zelixa.zelixa.service.SeoConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/seo-configs")
@RequiredArgsConstructor
public class SeoConfigController {

    private final SeoConfigService seoConfigService;

    @GetMapping
    public ResponseEntity<List<SeoConfigResponse>> getAll() {
        return ResponseEntity.ok(seoConfigService.getAll());
    }

    @GetMapping("/{pageName}")
    public ResponseEntity<SeoConfigResponse> getByPageName(@PathVariable String pageName) {
        return ResponseEntity.ok(seoConfigService.getByPageName(pageName));
    }

    @PostMapping
    public ResponseEntity<SeoConfigResponse> save(@RequestBody SeoConfigRequest request) {
        return ResponseEntity.ok(seoConfigService.save(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        seoConfigService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
