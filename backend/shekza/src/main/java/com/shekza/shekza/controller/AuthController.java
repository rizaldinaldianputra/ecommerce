package com.shekza.shekza.controller;

import com.shekza.shekza.dto.ApiResponse;
import com.shekza.shekza.dto.AuthResponse;
import com.shekza.shekza.dto.LoginRequest;
import com.shekza.shekza.dto.RegisterRequest;
import com.shekza.shekza.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", authService.register(request)),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getMe(java.security.Principal principal) {
        return ResponseEntity
                .ok(ApiResponse.success("User profile fetched successfully", authService.getMe(principal.getName())));
    }
}
