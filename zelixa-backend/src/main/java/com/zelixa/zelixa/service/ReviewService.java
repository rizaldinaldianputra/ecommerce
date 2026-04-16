package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.ReviewRequest;
import com.zelixa.zelixa.dto.ReviewResponse;
import com.zelixa.zelixa.entity.Review;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        Review review = Review.builder()
                .productId(request.getProductId())
                .userId(userId)
                .userName(request.getUserName())
                .rating(request.getRating())
                .comment(request.getComment())
                .isActive(false) // Default to inactive for moderation
                .build();

        return mapToResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse updateReviewStatus(Long id, Boolean isActive) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        review.setIsActive(isActive);
        return mapToResponse(reviewRepository.save(review));
    }

    public Page<ReviewResponse> getActiveReviewsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.findByProductIdAndIsActiveTrue(productId, pageable).map(this::mapToResponse);
    }

    public Page<ReviewResponse> getAllReviews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.findAll(pageable).map(this::mapToResponse);
    }

    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        reviewRepository.delete(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .productName(review.getProduct() != null ? review.getProduct().getName() : null)
                .userId(review.getUserId())
                .userName(review.getUserName())
                .rating(review.getRating())
                .comment(review.getComment())
                .isActive(review.getIsActive())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
