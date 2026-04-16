package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ApiResponse;
import com.zelixa.zelixa.dto.WishlistItemResponse;
import com.zelixa.zelixa.security.CustomUserDetails;
import com.zelixa.zelixa.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItemResponse>>> getWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getWishlist(userDetails.getUser())));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> toggleWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long productId) {
        wishlistService.toggleWishlist(userDetails.getUser(), productId);
        return ResponseEntity.ok(ApiResponse.success("Wishlist toggled", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        wishlistService.removeFromWishlist(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed from wishlist", null));
    }
}
