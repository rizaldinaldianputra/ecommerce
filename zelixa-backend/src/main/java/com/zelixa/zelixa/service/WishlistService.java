package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.WishlistItemResponse;
import com.zelixa.zelixa.entity.Product;
import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.entity.WishlistItem;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ProductImageRepository;
import com.zelixa.zelixa.repository.ProductRepository;
import com.zelixa.zelixa.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public List<WishlistItemResponse> getWishlist(User user) {
        return wishlistRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        wishlistRepository.findByUserAndProduct(user, product).ifPresentOrElse(
                wishlistRepository::delete,
                () -> wishlistRepository.save(WishlistItem.builder()
                        .user(user)
                        .product(product)
                        .build())
        );
    }

    @Transactional
    public void removeFromWishlist(User user, Long wishlistId) {
        WishlistItem wishlistItem = wishlistRepository.findById(wishlistId)
                .filter(item -> item.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));

        wishlistRepository.delete(wishlistItem);
    }

    private WishlistItemResponse mapToResponse(WishlistItem wishlistItem) {
        Product product = wishlistItem.getProduct();
        
        WishlistItemResponse response = WishlistItemResponse.builder()
                .id(wishlistItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .slug(product.getSlug())
                .build();

        // Get default price from first variant if available
        if (!product.getVariants().isEmpty()) {
            response.setPrice(product.getVariants().get(0).getPrice());
        }

        // Get image
        productImageRepository.findByProductId(product.getId()).stream()
                .filter(img -> img.getVariantId() == null)
                .findFirst()
                .ifPresent(img -> response.setImageUrl(img.getUrl()));

        return response;
    }
}
