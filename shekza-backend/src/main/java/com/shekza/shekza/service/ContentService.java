package com.shekza.shekza.service;

import com.shekza.shekza.dto.ContentSectionRequest;
import com.shekza.shekza.dto.ContentSectionResponse;
import com.shekza.shekza.dto.ContentItemRequest;
import com.shekza.shekza.dto.ContentItemResponse;
import com.shekza.shekza.entity.ContentItem;
import com.shekza.shekza.entity.ContentSection;
import com.shekza.shekza.exception.ResourceNotFoundException;
import com.shekza.shekza.repository.ContentItemRepository;
import com.shekza.shekza.repository.ContentSectionRepository;
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
                .displayOrder(request.getDisplayOrder())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        ContentSection savedSection = sectionRepository.save(section);

        if (request.getItems() != null) {
            List<ContentItem> items = request.getItems().stream().map(itemReq -> 
                ContentItem.builder()
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
                        .build()
            ).collect(Collectors.toList());

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
                .displayOrder(section.getDisplayOrder())
                .isActive(section.getIsActive())
                .items(section.getItems() != null ? section.getItems().stream().map(item -> 
                    ContentItemResponse.builder()
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
                        .build()
                ).collect(Collectors.toList()) : null)
                .build();
    }
}
