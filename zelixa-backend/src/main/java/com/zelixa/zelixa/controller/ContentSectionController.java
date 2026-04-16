package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ContentSectionRequest;
import com.zelixa.zelixa.dto.ContentSectionResponse;
import com.zelixa.zelixa.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content-sections")
@RequiredArgsConstructor
public class ContentSectionController {

    private final ContentService contentService;

    @PostMapping
    public ResponseEntity<ContentSectionResponse> createSection(@RequestBody ContentSectionRequest request) {
        return ResponseEntity.ok(contentService.createSection(request));
    }

    @GetMapping
    public ResponseEntity<List<ContentSectionResponse>> getAllSections(@RequestParam(required = false) String platform) {
        if (platform != null) {
            return ResponseEntity.ok(contentService.getSectionsByPlatform(platform));
        }
        return ResponseEntity.ok(contentService.getAllSections());
    }

    @GetMapping("/active")
    public ResponseEntity<List<ContentSectionResponse>> getActiveSections(@RequestParam(required = false) String platform) {
        if (platform != null) {
            return ResponseEntity.ok(contentService.getActiveSectionsByPlatform(platform));
        }
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

    @PutMapping("/{id}")
    public ResponseEntity<ContentSectionResponse> updateSection(@PathVariable Long id, @RequestBody ContentSectionRequest request) {
        return ResponseEntity.ok(contentService.updateSection(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        contentService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
