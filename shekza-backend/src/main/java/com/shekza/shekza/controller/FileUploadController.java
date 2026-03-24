package com.shekza.shekza.controller;

import com.shekza.shekza.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final FileStorageService storageService;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String url = storageService.store(file);
        // Prepend host to make it a full URL if needed, 
        // but for now relative path is fine if proxy is configured
        return ResponseEntity.ok(Map.of("url", url));
    }
}
