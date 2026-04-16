package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.SeoConfigRequest;
import com.zelixa.zelixa.dto.SeoConfigResponse;
import com.zelixa.zelixa.entity.SeoConfig;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.SeoConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeoConfigService {

    private final SeoConfigRepository seoConfigRepository;

    public List<SeoConfigResponse> getAll() {
        return seoConfigRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SeoConfigResponse getByPageName(String pageName) {
        return seoConfigRepository.findByPageName(pageName)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("SEO config not found for page: " + pageName));
    }

    @Transactional
    public SeoConfigResponse save(SeoConfigRequest request) {
        SeoConfig seoConfig = seoConfigRepository.findByPageName(request.getPageName())
                .orElse(new SeoConfig());
        
        seoConfig.setPageName(request.getPageName());
        seoConfig.setScriptCode(request.getScriptCode());

        return mapToResponse(seoConfigRepository.save(seoConfig));
    }

    @Transactional
    public void delete(Long id) {
        if (!seoConfigRepository.existsById(id)) {
            throw new ResourceNotFoundException("SEO config not found with id: " + id);
        }
        seoConfigRepository.deleteById(id);
    }

    private SeoConfigResponse mapToResponse(SeoConfig seoConfig) {
        return SeoConfigResponse.builder()
                .id(seoConfig.getId())
                .pageName(seoConfig.getPageName())
                .scriptCode(seoConfig.getScriptCode())
                .build();
    }
}
