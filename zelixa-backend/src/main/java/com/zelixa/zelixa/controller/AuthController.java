package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ApiResponse;
import com.zelixa.zelixa.dto.AuthResponse;
import com.zelixa.zelixa.dto.LoginRequest;
import com.zelixa.zelixa.dto.OtpLoginRequest;
import com.zelixa.zelixa.dto.OtpRequest;
import com.zelixa.zelixa.dto.RegisterRequest;
import com.zelixa.zelixa.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.zelixa.zelixa.security.CustomUserDetails;

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
    public ResponseEntity<ApiResponse<AuthResponse>> getMe(@AuthenticationPrincipal Object principal) {
        if (principal instanceof CustomUserDetails) {
            String email = ((CustomUserDetails) principal).getUsername();
            return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully",
                    authService.getMe(email)));
        } else if (principal instanceof Jwt) {
            return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully",
                    authService.syncUserFromJwt((Jwt) principal)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Token is missing or invalid"));
        }
    }

    @PostMapping("/otp/request")
    public ResponseEntity<ApiResponse<Void>> requestOtp(@Valid @RequestBody OtpRequest request) {
        authService.requestOtp(request.getPhoneNumber());
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", null));
    }

    @PostMapping("/otp/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithOtp(@Valid @RequestBody OtpLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful",
                authService.loginWithOtp(request.getPhoneNumber(), request.getCode())));
    }
}
