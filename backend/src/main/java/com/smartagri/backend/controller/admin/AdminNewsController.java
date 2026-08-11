package com.smartagri.backend.controller.admin;

import com.smartagri.backend.dto.admin.NewsRequest;
import com.smartagri.backend.entity.News;
import com.smartagri.backend.service.admin.AdminNewsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminNewsController {

    private final AdminNewsService adminNewsService;

    @GetMapping
    public ResponseEntity<Page<News>> getAllNews(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(adminNewsService.getAllNews(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<News>> getNewsByStatus(
            @PathVariable String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminNewsService.getNewsByStatus(status, pageable));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<News>> getNewsByCategory(
            @PathVariable String category,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminNewsService.getNewsByCategory(category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(adminNewsService.getNewsById(id));
    }

    @PostMapping
    public ResponseEntity<News> createNews(@Valid @RequestBody NewsRequest request) {
        News news = adminNewsService.createNews(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(news);
    }

    @PutMapping("/{id}")
    public ResponseEntity<News> updateNews(
            @PathVariable Long id,
            @Valid @RequestBody NewsRequest request) {
        return ResponseEntity.ok(adminNewsService.updateNews(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        adminNewsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<News> publishNews(@PathVariable Long id) {
        return ResponseEntity.ok(adminNewsService.publishNews(id));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<News> archiveNews(@PathVariable Long id) {
        return ResponseEntity.ok(adminNewsService.archiveNews(id));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<News>> getLatestPublishedNews() {
        return ResponseEntity.ok(adminNewsService.getLatestPublishedNews());
    }

    @GetMapping("/stats")
    public ResponseEntity<Object> getNewsStats() {
        return ResponseEntity.ok(new Object() {
            public final long total = adminNewsService.getNewsCount();
            public final long published = adminNewsService.getPublishedNewsCount();
        });
    }
}