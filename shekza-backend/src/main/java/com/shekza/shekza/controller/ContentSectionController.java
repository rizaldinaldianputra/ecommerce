package com.shekza.shekza.controller;

import com.shekza.shekza.dto.ContentSectionRequest;
import com.shekza.shekza.dto.ContentSectionResponse;
import com.shekza.shekza.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content-sections")
@RequiredArgsConstructor
public class ContentSectionController {

    private final ContentService contentService;

    @PostMapping
    public ResponseEntity<ContentSectionResponse> createSection(@RequestBody ContentSectionRequest request) {
        return ResponseEntity.ok(contentService.createSection(request));
    }

    @GetMapping
    public ResponseEntity<List<ContentSectionResponse>> getAllSections() {
        return ResponseEntity.ok(contentService.getAllSections());
    }

    @GetMapping("/active")
    public ResponseEntity<List<ContentSectionResponse>> getActiveSections() {
        return ResponseEntity.ok(contentService.getActiveSections());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ContentSectionResponse>> getSectionsByType(@PathVariable String type) {
        return ResponseEntity.ok(contentService.getSectionsByType(type));
    }

    @GetMapping("/type/{type}/active")
    public ResponseEntity<List<ContentSectionResponse>> getActiveSectionsByType(@PathVariable String type) {
        return ResponseEntity.ok(contentService.getActiveSectionsByType(type));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        contentService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
