package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.CartItemRequest;
import com.zelixa.zelixa.dto.CartItemResponse;
import com.zelixa.zelixa.entity.CartItem;
import com.zelixa.zelixa.entity.ProductImage;
import com.zelixa.zelixa.entity.ProductVariant;
import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.CartItemRepository;
import com.zelixa.zelixa.repository.ProductImageRepository;
import com.zelixa.zelixa.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;

    public List<CartItemResponse> getCart(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse addToCart(User user, CartItemRequest request) {
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProductVariant(user, variant)
                .map(item -> {
                    item.setQuantity(item.getQuantity() + request.getQuantity());
                    return item;
                })
                .orElse(CartItem.builder()
                        .user(user)
                        .productVariant(variant)
                        .quantity(request.getQuantity())
                        .build());

        return mapToResponse(cartItemRepository.save(cartItem));
    }

    @Transactional
    public CartItemResponse updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cartItem.setQuantity(quantity);
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        return mapToResponse(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    private CartItemResponse mapToResponse(CartItem cartItem) {
        ProductVariant variant = cartItem.getProductVariant();
        
        CartItemResponse response = CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(variant.getProduct().getId())
                .productName(variant.getProduct().getName())
                .productVariantId(variant.getId())
                .size(variant.getSize())
                .color(variant.getColor())
                .groupName(variant.getGroupName())
                .price(variant.getPrice())
                .discountPrice(variant.getDiscountPrice())
                .quantity(cartItem.getQuantity())
                .build();

        // Get image - try variant image first, then product image
        productImageRepository.findByProductId(variant.getProduct().getId()).stream()
                .filter(img -> variant.getId().equals(img.getVariantId()))
                .findFirst()
                .ifPresentOrElse(
                        img -> response.setImageUrl(img.getUrl()),
                        () -> productImageRepository.findByProductId(variant.getProduct().getId()).stream()
                                .filter(img -> img.getVariantId() == null)
                                .findFirst()
                                .ifPresent(img -> response.setImageUrl(img.getUrl()))
                );

        return response;
    }
}
