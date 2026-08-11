package com.smartagri.backend.service.admin;

import com.smartagri.backend.dto.admin.NewsRequest;
import com.smartagri.backend.entity.News;
import com.smartagri.backend.exception.BusinessException;
import com.smartagri.backend.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminNewsService {

    private final NewsRepository newsRepository;

    public Page<News> getAllNews(Pageable pageable) {
        return newsRepository.findAll(pageable);
    }

    public Page<News> getNewsByStatus(String status, Pageable pageable) {
        return newsRepository.findByStatus(status, pageable);
    }

    public Page<News> getNewsByCategory(String category, Pageable pageable) {
        return newsRepository.findByCategory(category, pageable);
    }

    public News getNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new BusinessException("News not found with id: " + id));
    }

    @Transactional
    public News createNews(NewsRequest request) {
        News news = News.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .summary(request.getSummary())
                .category(request.getCategory())
                .author(request.getAuthor())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus() != null ? request.getStatus() : "DRAFT")
                .source(request.getSource())
                .publishedDate(request.getStatus() != null && request.getStatus().equals("PUBLISHED") 
                    ? LocalDateTime.now() : null)
                .viewCount(0)
                .build();

        news = newsRepository.save(news);
        log.info("News created: {}", news.getTitle());
        return news;
    }

    @Transactional
    public News updateNews(Long id, NewsRequest request) {
        News news = getNewsById(id);

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setSummary(request.getSummary());
        news.setCategory(request.getCategory());
        
        if (request.getAuthor() != null) {
            news.setAuthor(request.getAuthor());
        }
        
        if (request.getImageUrl() != null) {
            news.setImageUrl(request.getImageUrl());
        }
        
        news.setStatus(request.getStatus());
        
        if (request.getSource() != null) {
            news.setSource(request.getSource());
        }

        // Update published date if status is changing to PUBLISHED
        if (request.getStatus().equals("PUBLISHED") && news.getPublishedDate() == null) {
            news.setPublishedDate(LocalDateTime.now());
        }

        news = newsRepository.save(news);
        log.info("News updated: {}", news.getTitle());
        return news;
    }

    @Transactional
    public void deleteNews(Long id) {
        News news = getNewsById(id);
        newsRepository.delete(news);
        log.info("News deleted: {}", news.getTitle());
    }

    @Transactional
    public News publishNews(Long id) {
        News news = getNewsById(id);
        news.setStatus("PUBLISHED");
        news.setPublishedDate(LocalDateTime.now());
        news = newsRepository.save(news);
        log.info("News published: {}", news.getTitle());
        return news;
    }

    @Transactional
    public News archiveNews(Long id) {
        News news = getNewsById(id);
        news.setStatus("ARCHIVED");
        news = newsRepository.save(news);
        log.info("News archived: {}", news.getTitle());
        return news;
    }

    public List<News> getLatestPublishedNews() {
        return newsRepository.findTop5ByStatusOrderByPublishedDateDesc("PUBLISHED");
    }

    public long getNewsCount() {
        return newsRepository.count();
    }

    public long getPublishedNewsCount() {
        return newsRepository.countByStatus("PUBLISHED");
    }
}