package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.ContentItemRequest;
import com.zelixa.zelixa.dto.ContentItemResponse;
import com.zelixa.zelixa.entity.ContentItem;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ContentItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentItemRepository itemRepository;

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
                .build();

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

    private ContentItemResponse mapToItemResponse(ContentItem item) {
        return ContentItemResponse.builder()
                .id(item.getId())
                .type(item.getType())
                .platform(item.getPlatform())
                .isActive(item.getIsActive())
                .title(item.getTitle())
                .subtitle(item.getSubtitle())
                .imageUrl(item.getImageUrl())
                .linkUrl(item.getLinkUrl())
                .productId(item.getProductId())
                .tag(item.getTag())
                .ctaText(item.getCtaText())
                .badgeText(item.getBadgeText())
                .iconName(item.getIconName())
                .emoji(item.getEmoji())
                .styleConfig(item.getStyleConfig())
                .displayOrder(item.getDisplayOrder())
                .build();
    }
}
