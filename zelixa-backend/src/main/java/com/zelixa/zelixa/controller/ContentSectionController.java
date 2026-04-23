package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ContentSectionRequest;
import com.zelixa.zelixa.dto.ContentSectionResponse;
import com.zelixa.zelixa.service.ContentSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content/sections")
@RequiredArgsConstructor
public class ContentSectionController {

    private final ContentSectionService sectionService;

    @PostMapping
    public ResponseEntity<ContentSectionResponse> createSection(@RequestBody ContentSectionRequest request) {
        return ResponseEntity.ok(sectionService.createSection(request));
    }

    @GetMapping
    public ResponseEntity<List<ContentSectionResponse>> getSections(
            @RequestParam(defaultValue = "WEB") String platform) {
        return ResponseEntity.ok(sectionService.getSectionsByPlatform(platform));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentSectionResponse> getSectionById(@PathVariable Long id) {
        return ResponseEntity.ok(sectionService.getSectionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentSectionResponse> updateSection(@PathVariable Long id, @RequestBody ContentSectionRequest request) {
        return ResponseEntity.ok(sectionService.updateSection(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
