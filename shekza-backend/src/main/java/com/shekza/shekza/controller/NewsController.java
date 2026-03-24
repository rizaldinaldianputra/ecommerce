package com.shekza.shekza.controller;

import com.shekza.shekza.dto.NewsRequest;
import com.shekza.shekza.entity.News;
import com.shekza.shekza.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @PostMapping
    public ResponseEntity<News> createNews(@RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.createNews(request));
    }

    @GetMapping
    public ResponseEntity<List<News>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<News> getNewsBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(newsService.getNewsBySlug(slug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<News> updateNews(@PathVariable Long id, @RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.updateNews(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}
