package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.ContentItemRequest;
import com.zelixa.zelixa.dto.ContentItemResponse;
import com.zelixa.zelixa.dto.ProductResponse;
import com.zelixa.zelixa.entity.ContentItem;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ContentItemRepository;
import com.zelixa.zelixa.repository.ContentSectionRepository;
import com.zelixa.zelixa.entity.ContentSection;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentItemRepository itemRepository;
    private final ContentSectionRepository sectionRepository;
    private final ProductService productService;

    @Value("${app.minio.url:https://storage.zelixa.my.id}")
    private String storageUrl;

    @Transactional
    public ContentItemResponse createItem(ContentItemRequest request) {
        ContentItem item = ContentItem.builder()
                .type(request.getType())
                .platform(request.getPlatform() != null ? request.getPlatform() : "WEB")
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .imageUrl(request.getImageUrl())
                .linkUrl(request.getLinkUrl())
                .productId(request.getProductId())
                .tag(request.getTag())
                .ctaText(request.getCtaText())
                .badgeText(request.getBadgeText())
                .iconName(request.getIconName())
                .emoji(request.getEmoji())
                .styleConfig(request.getStyleConfig())
                .displayOrder(request.getDisplayOrder())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .contentBody(request.getContentBody())
                .bannerUrl(request.getBannerUrl())
                .productIds(request.getProductIds())
                .build();

        if (request.getSectionId() != null) {
            ContentSection section = sectionRepository.findById(request.getSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + request.getSectionId()));
            item.setSection(section);
        }

        return mapToItemResponse(itemRepository.save(item));
    }

    public List<ContentItemResponse> getItemsByType(String type, String platform, boolean activeOnly) {
        List<ContentItem> items;
        if (activeOnly) {
            String targetPlatform = platform != null ? platform : "WEB";
            items = itemRepository.findByTypeAndPlatformAndIsActiveTrueOrderByCreatedAtDesc(type, targetPlatform);
        } else {
            items = itemRepository.findAllByTypeOrderByCreatedAtDesc(type);
        }
        return items.stream().map(this::mapToItemResponse).collect(Collectors.toList());
    }

    public List<ContentItemResponse> getAllItems(String platform) {
        List<ContentItem> items;
        if (platform != null && !platform.isEmpty()) {
            items = itemRepository.findByPlatformOrderByCreatedAtDesc(platform);
        } else {
            items = itemRepository.findAllByOrderByCreatedAtDesc();
        }
        return items.stream().map(this::mapToItemResponse).collect(Collectors.toList());
    }

    @Transactional
    public ContentItemResponse updateItem(Long id, ContentItemRequest request) {
        ContentItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content item not found with id: " + id));

        item.setType(request.getType());
        item.setPlatform(request.getPlatform() != null ? request.getPlatform() : item.getPlatform());
        item.setIsActive(request.getIsActive() != null ? request.getIsActive() : item.getIsActive());
        item.setTitle(request.getTitle());
        item.setSubtitle(request.getSubtitle());
        item.setImageUrl(request.getImageUrl());
        item.setLinkUrl(request.getLinkUrl());
        item.setProductId(request.getProductId());
        item.setTag(request.getTag());
        item.setCtaText(request.getCtaText());
        item.setBadgeText(request.getBadgeText());
        item.setIconName(request.getIconName());
        item.setEmoji(request.getEmoji());
        item.setStyleConfig(request.getStyleConfig());
        item.setDisplayOrder(request.getDisplayOrder());
        item.setStartDate(request.getStartDate());
        item.setEndDate(request.getEndDate());
        item.setContentBody(request.getContentBody());
        item.setBannerUrl(request.getBannerUrl());
        item.setProductIds(request.getProductIds());

        if (request.getSectionId() != null) {
            ContentSection section = sectionRepository.findById(request.getSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + request.getSectionId()));
            item.setSection(section);
        }

        return mapToItemResponse(itemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Content item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    public ContentItemResponse getById(String id) {
        ContentItem item = itemRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new ResourceNotFoundException("Content item not found with id: " + id));
        return mapToItemResponse(item);
    }

    public ContentItemResponse mapToItemResponse(ContentItem item) {
        ProductResponse product = null;
        if (item.getProductId() != null) {
            try {
                product = productService.getProductById(item.getProductId());
            } catch (Exception e) {
                // Product might have been deleted
            }
        }

        List<ProductResponse> products = null;
        if (item.getProductIds() != null && !item.getProductIds().trim().isEmpty()) {
            try {
                List<Long> ids = java.util.Arrays.stream(item.getProductIds().split(","))
                        .map(String::trim)
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
                products = productService.getProductsByIds(ids);
            } catch (Exception e) {
                // Ignore if products not found
            }
        }

        return ContentItemResponse.builder()
                .id(item.getId())
                .type(item.getType())
                .platform(item.getPlatform())
                .isActive(item.getIsActive())
                .title(item.getTitle())
                .subtitle(item.getSubtitle())
                .imageUrl(formatImageUrl(item.getImageUrl()))
                .linkUrl(item.getLinkUrl())
                .productId(item.getProductId())
                .tag(item.getTag())
                .ctaText(item.getCtaText())
                .badgeText(item.getBadgeText())
                .iconName(item.getIconName())
                .emoji(item.getEmoji())
                .styleConfig(item.getStyleConfig())
                .displayOrder(item.getDisplayOrder())
                .startDate(item.getStartDate())
                .endDate(item.getEndDate())
                .contentBody(item.getContentBody())
                .bannerUrl(formatImageUrl(item.getBannerUrl()))
                .productIds(item.getProductIds())
                .sectionId(item.getSection() != null ? item.getSection().getId() : null)
                .products(products)
                .product(product)
                .build();
    }

    private String formatImageUrl(String path) {
        if (path == null || path.trim().isEmpty() || path.startsWith("http") || path.startsWith("data:")) {
            return path;
        }

        // Clean up internal endpoints if they somehow got into the DB
        String cleanPath = path;
        String[] internalEndpoints = {"minio:9000", "localhost:9000", "127.0.0.1:9000"};
        for (String endpoint : internalEndpoints) {
            if (cleanPath.contains(endpoint)) {
                cleanPath = cleanPath.substring(cleanPath.indexOf(endpoint) + endpoint.length());
            }
        }

        // Ensure it starts with a single slash
        if (!cleanPath.startsWith("/")) {
            cleanPath = "/" + cleanPath;
        }

        // Clean storage URL
        String base = storageUrl;
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }

        return base + cleanPath;
    }
}
