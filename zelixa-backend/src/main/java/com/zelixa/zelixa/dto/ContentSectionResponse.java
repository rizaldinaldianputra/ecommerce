package com.zelixa.zelixa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentSectionResponse {
    private Long id;
    private String platform;
    private String type;
    private String title;
    private String subtitle;
    private Integer displayOrder;
    private Boolean isActive;
    private List<ContentItemResponse> items;
}
