package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.NewsRequest;
import com.zelixa.zelixa.entity.News;
import com.zelixa.zelixa.exception.ResourceNotFoundException;
import com.zelixa.zelixa.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final NotificationService notificationService;

    @Transactional
    public News createNews(NewsRequest request) {
        News news = News.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        News saved = newsRepository.save(news);
        
        // Trigger notification
        if (saved.getIsActive()) {
            notificationService.notifyTopic("news", request.getTitle(), "Check out our latest news!", "NEWS", null);
        }
        
        return saved;
    }

    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    public News getNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id: " + id));
    }

    public News getNewsBySlug(String slug) {
        return newsRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with slug: " + slug));
    }

    @Transactional
    public News updateNews(Long id, NewsRequest request) {
        News news = getNewsById(id);
        news.setTitle(request.getTitle());
        news.setSlug(request.getSlug());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        if (request.getIsActive() != null) {
            news.setIsActive(request.getIsActive());
        }
        return newsRepository.save(news);
    }

    @Transactional
    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News not found with id: " + id);
        }
        newsRepository.deleteById(id);
    }
}
