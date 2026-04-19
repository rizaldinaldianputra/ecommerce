package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ContentItemRequest;
import com.zelixa.zelixa.dto.ContentItemResponse;
import com.zelixa.zelixa.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @PostMapping("/items")
    public ResponseEntity<ContentItemResponse> createItem(@RequestBody ContentItemRequest request) {
        return ResponseEntity.ok(contentService.createItem(request));
    }

    @GetMapping("/items/type/{type}")
    public ResponseEntity<List<ContentItemResponse>> getItemsByType(
            @PathVariable String type,
            @RequestParam(required = false) String platform,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        return ResponseEntity.ok(contentService.getItemsByType(type, platform, activeOnly));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ContentItemResponse> updateItem(@PathVariable Long id, @RequestBody ContentItemRequest request) {
        return ResponseEntity.ok(contentService.updateItem(id, request));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<ContentItemResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(contentService.getById(id));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        contentService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
