package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.ContentSectionRequest;
import com.zelixa.zelixa.dto.ContentSectionResponse;
import com.zelixa.zelixa.dto.ContentItemRequest;
import com.zelixa.zelixa.dto.ContentItemResponse;
import com.zelixa.zelixa.entity.ContentItem;
import com.zelixa.zelixa.entity.ContentSection;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.ContentItemRepository;
import com.zelixa.zelixa.repository.ContentSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentSectionRepository sectionRepository;
    private final ContentItemRepository itemRepository;

    @Transactional
    public ContentSectionResponse createSection(ContentSectionRequest request) {
        ContentSection section = ContentSection.builder()
                .title(request.getTitle())
                .type(request.getType())
                .platform(request.getPlatform() != null ? request.getPlatform() : "WEB")
                .displayOrder(request.getDisplayOrder())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        ContentSection savedSection = sectionRepository.save(section);

        if (request.getItems() != null) {
            List<ContentItem> items = request.getItems().stream().map(itemReq -> ContentItem.builder()
                    .section(savedSection)
                    .title(itemReq.getTitle())
                    .subtitle(itemReq.getSubtitle())
                    .imageUrl(itemReq.getImageUrl())
                    .linkUrl(itemReq.getLinkUrl())
                    .productId(itemReq.getProductId())
                    .tag(itemReq.getTag())
                    .ctaText(itemReq.getCtaText())
                    .badgeText(itemReq.getBadgeText())
                    .iconName(itemReq.getIconName())
                    .emoji(itemReq.getEmoji())
                    .styleConfig(itemReq.getStyleConfig())
                    .displayOrder(itemReq.getDisplayOrder())
                    .build()).collect(Collectors.toList());

            itemRepository.saveAll(items);
            savedSection.setItems(items);
        }

        return mapToResponse(savedSection);
    }

    public List<ContentSectionResponse> getAllSections() {
        return sectionRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ContentSectionResponse> getActiveSections() {
        return sectionRepository.findByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ContentSectionResponse> getSectionsByPlatform(String platform) {
        return sectionRepository.findByPlatformOrderByDisplayOrderAsc(platform).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ContentSectionResponse> getActiveSectionsByPlatform(String platform) {
        return sectionRepository.findByPlatformAndIsActiveTrueOrderByDisplayOrderAsc(platform).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ContentSectionResponse> getSectionsByType(String type) {
        return sectionRepository.findByTypeOrderByDisplayOrderAsc(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ContentSectionResponse> getActiveSectionsByType(String type) {
        return sectionRepository.findByTypeAndIsActiveTrueOrderByDisplayOrderAsc(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContentSectionResponse updateSection(Long id, ContentSectionRequest request) {
        ContentSection section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + id));

        section.setTitle(request.getTitle());
        section.setType(request.getType());
        section.setPlatform(request.getPlatform());
        section.setDisplayOrder(request.getDisplayOrder());
        section.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        if (request.getItems() != null) {
            // Clear existing items first
            itemRepository.deleteBySectionId(id);

            List<ContentItem> items = request.getItems().stream().map(itemReq -> ContentItem.builder()
                    .section(section)
                    .title(itemReq.getTitle())
                    .subtitle(itemReq.getSubtitle())
                    .imageUrl(itemReq.getImageUrl())
                    .linkUrl(itemReq.getLinkUrl())
                    .productId(itemReq.getProductId())
                    .tag(itemReq.getTag())
                    .ctaText(itemReq.getCtaText())
                    .badgeText(itemReq.getBadgeText())
                    .iconName(itemReq.getIconName())
                    .emoji(itemReq.getEmoji())
                    .styleConfig(itemReq.getStyleConfig())
                    .displayOrder(itemReq.getDisplayOrder())
                    .build()).collect(Collectors.toList());

            itemRepository.saveAll(items);
            section.setItems(items);
        }

        ContentSection updatedSection = sectionRepository.save(section);
        return mapToResponse(updatedSection);
    }

    @Transactional
    public void deleteSection(Long id) {
        if (!sectionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Section not found with id: " + id);
        }
        sectionRepository.deleteById(id);
    }

    private ContentSectionResponse mapToResponse(ContentSection section) {
        return ContentSectionResponse.builder()
                .id(section.getId())
                .title(section.getTitle())
                .type(section.getType())
                .platform(section.getPlatform())
                .displayOrder(section.getDisplayOrder())
                .isActive(section.getIsActive())
                .items(section.getItems() != null ? section.getItems().stream()
                        .map(item -> ContentItemResponse.builder()
                                .id(item.getId())
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
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
